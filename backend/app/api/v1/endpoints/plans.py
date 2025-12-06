# backend/app/api/v1/endpoints/plans.py
import datetime
import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any
from uuid import uuid4
import logging
from supabase import Client # Import Client for type hinting

from app.core.dependencies import get_current_user, get_db_session, get_db # Add get_db dependency
from app.services.ai_plan_generator import AIPlanGeneratorService
from app.schemas.user_preferences import UserPreferences
from app.schemas.workout_log import LogWorkoutRequest # Import the new schema
from app.schemas.plan import WorkoutSession, TodaysWorkoutResponse
from app.models.plan import WorkoutPlanModel, MealPlanModel
from app.models.workout_log import WorkoutLogModel # Import the WorkoutLogModel

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/plans/generate", status_code=status.HTTP_201_CREATED)
async def generate_plan(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db_session: Session = Depends(get_db_session),
    db: Client = Depends(get_db) # Inject Supabase client
) -> Dict[str, str]:
    """
    Triggers the AI to generate a personalized workout and meal plan for the authenticated user.
    """
    user_id = current_user["id"]

    # Fetch user preferences from the database
    try:
        response = await db.from_('user_profiles').select('*').eq('user_id', user_id).single().execute()
        user_profile_data = response.data
    except Exception as e:
        logger.error(f"Error fetching user preferences for user {user_id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch user preferences."
        )

    if not user_profile_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User preferences not found. Please complete onboarding."
        )

    user_preferences = UserPreferences(
        fitness_goal=user_profile_data.get("fitness_goal"),
        dietary_preferences=user_profile_data.get("dietary_preferences", []),
        fitness_persona=user_profile_data.get("fitness_persona")
    )

    ai_plan_generator = AIPlanGeneratorService(db_session)

    try:
        existing_workout_plan = db_session.query(WorkoutPlanModel).filter_by(user_id=user_id).first()
        existing_meal_plan = db_session.query(MealPlanModel).filter_by(user_id=user_id).first()

        if existing_workout_plan and existing_meal_plan:
            logger.warning(f"User {user_id} already has generated plans. Conflict detected.")
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User already has generated plans. Use an update endpoint to modify plans."
            )

        await ai_plan_generator.generate_and_store_plan(user_id, user_preferences)
        db_session.commit()
        logger.info(f"AI plans generated and stored successfully for user {user_d}.")
        return {"message": "AI plans generated and stored successfully."}
    except HTTPException as e:
        db_session.rollback()
        logger.error(f"HTTP Exception during plan generation for user {user_id}: {e.detail}")
        raise e
    except Exception as e:
        db_session.rollback()
        logger.error(f"Unexpected error during plan generation for user {user_id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Internal Server Error"
        )

@router.get("/plans/today", response_model=TodaysWorkoutResponse)
async def get_todays_workout_plan(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db_session: Session = Depends(get_db_session),
) -> TodaysWorkoutResponse:
    """
    Gets the workout plan for the current day for the authenticated user.
    """
    user_id = current_user["id"]
    today = datetime.date.today().strftime("%A") # Day of week as string e.g. "Monday"

    try:
        # Get the latest workout plan for the user
        workout_plan = (
            db_session.query(WorkoutPlanModel)
            .filter(WorkoutPlanModel.user_id == user_id)
            .order_by(WorkoutPlanModel.generated_at.desc())
            .first()
        )

        if not workout_plan:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No workout plan found for the user.",
            )

        plan_data = json.loads(workout_plan.plan_data)
        
        todays_workout = None
        for session in plan_data.get("sessions", []):
            if session.get("day_of_week").lower() == today.lower():
                todays_workout = session
                break
        
        if not todays_workout:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No workout found for {today}.",
            )
            
        return TodaysWorkoutResponse(plan_id=workout_plan.id, session=WorkoutSession(**todays_workout))

    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error getting today's workout plan for user {user_id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error",
        )

@router.post("/plans/log-workout", status_code=status.HTTP_201_CREATED)
async def log_workout(
    request: LogWorkoutRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db_session: Session = Depends(get_db_session)
) -> Dict[str, str]:
    """
    Logs the completion status and perceived difficulty of a planned workout.
    """
    user_id = current_user["id"]

    if request.status == "Completed" and request.difficulty_rating is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Difficulty rating is required for completed workouts."
        )
    if request.status == "Skipped" and request.difficulty_rating is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Difficulty rating should not be provided for skipped workouts."
        )

    # In a real scenario, you'd fetch the workout plan to ensure it belongs to the user
    # and the workout_plan_id is valid. For now, we proceed to log.

    try:
        new_log_entry = WorkoutLogModel(
            id=uuid4(),
            user_id=user_id,
            workout_plan_id=request.workout_plan_id,
            day_of_week=request.day_of_week,
            status=request.status,
            difficulty_rating=request.difficulty_rating
        )
        db_session.add(new_log_entry)
        db_session.commit()
        db_session.refresh(new_log_entry) # Refresh to get logged_at
        logger.info(f"Workout logged successfully for user {user_id}: {new_log_entry.id}")
        return {"message": "Workout logged successfully."}
    except Exception as e:
        db_session.rollback()
        logger.error(f"Error logging workout for user {user_id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error"
        )