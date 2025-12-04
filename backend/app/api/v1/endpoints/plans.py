# backend/app/api/v1/endpoints/plans.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any
from uuid import uuid4
import logging
from supabase import Client # Import Client for type hinting

from app.core.dependencies import get_current_user, get_db_session, get_db # Add get_db dependency
from app.services.ai_plan_generator import AIPlanGeneratorService
from app.schemas.user_preferences import UserPreferences
from app.models.plan import WorkoutPlanModel, MealPlanModel

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
        logger.info(f"AI plans generated and stored successfully for user {user_id}.")
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