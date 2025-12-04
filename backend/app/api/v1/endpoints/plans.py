# backend/app/api/v1/endpoints/plans.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any
from uuid import uuid4
import logging # Import logging module

from app.core.dependencies import get_current_user, get_db_session # Assuming get_db_session exists now
from app.services.ai_plan_generator import AIPlanGeneratorService
from app.schemas.user_preferences import UserPreferences # To fetch preferences
from app.models.plan import WorkoutPlanModel, MealPlanModel # To check if plans exist

router = APIRouter()
logger = logging.getLogger(__name__) # Get logger instance

@router.post("/plans/generate", status_code=status.HTTP_201_CREATED)
async def generate_plan(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db_session: Session = Depends(get_db_session) # Use SQLAlchemy session
) -> Dict[str, str]:
    """
    Triggers the AI to generate a personalized workout and meal plan for the authenticated user.
    """
    user_id = current_user["id"]

    # TODO: Fetch actual user preferences from the database using user_id
    # For now, we'll use a placeholder or assume preferences are directly available
    # from current_user or can be fetched from a user_profiles table.
    # This needs to be refined when user profile management is fully implemented.
    user_preferences = UserPreferences(
        fitness_goal="gainMuscle", # Placeholder
        dietary_preferences=["vegetarian"], # Placeholder
        fitness_persona="dedicated" # Placeholder
    )

    ai_plan_generator = AIPlanGeneratorService(db_session)

    try:
        # Check if plans already exist for this user. If so, return existing plans or raise error.
        # This prevents regenerating plans if they already exist, unless explicitly allowed.
        existing_workout_plan = db_session.query(WorkoutPlanModel).filter_by(user_id=user_id).first()
        existing_meal_plan = db_session.query(MealPlanModel).filter_by(user_id=user_id).first()

        if existing_workout_plan and existing_meal_plan:
            logger.warning(f"User {user_id} already has generated plans. Conflict detected.")
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User already has generated plans. Use an update endpoint to modify plans."
            )

        await ai_plan_generator.generate_and_store_plan(user_id, user_preferences)
        db_session.commit() # Commit the transaction
        logger.info(f"AI plans generated and stored successfully for user {user_id}.")
        return {"message": "AI plans generated and stored successfully."}
    except HTTPException as e:
        db_session.rollback() # Rollback on HTTPException
        logger.error(f"HTTP Exception during plan generation for user {user_id}: {e.detail}")
        raise e
    except Exception as e:
        db_session.rollback() # Rollback on other exceptions
        logger.error(f"Unexpected error during plan generation for user {user_id}: {str(e)}", exc_info=True)
        # For generic exceptions, FastAPI's default 500 handler might not show the full detail by default.
        # Returning a more generic message here, as the full detail is logged.
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Internal Server Error" # Simplified for consistent API response
        )