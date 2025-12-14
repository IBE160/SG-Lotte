from fastapi import APIRouter, Depends, HTTPException, status, Response
from typing import Dict, Any
from supabase import Client # Import Client for type hinting

from app.api.v1.deps import get_current_user, get_supabase_client # Import get_supabase_client
from app.schemas.user import User  # Assuming a User schema exists
from app.services.ai_plan_generator import get_ai_plan, FullPlan
from app.schemas.meal import MealLogRequest, MealLogResponse # Import MealLogResponse
from app.core.exceptions import SupabaseDatabaseError
from postgrest.exceptions import APIError # Import APIError

router = APIRouter()

@router.post("/generate-initial", response_model=FullPlan, status_code=status.HTTP_201_CREATED)
def generate_initial_plan(
    current_user: User = Depends(get_current_user)
) -> FullPlan:
    """
    Generates an initial 7-day AI-driven workout and meal plan for the authenticated user.
    """
    if not current_user or not current_user.id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate user ID.",
        )

    # Placeholder for user preferences, in a real app these would come from
    # the user's profile after onboarding.
    user_preferences: Dict[str, Any] = {
        "fitness_goal": "lose weight",
        "dietary_preferences": "vegetarian, high protein",
        "fitness_persona": "beginner, prefers home workouts"
    }

    try:
        full_plan = get_ai_plan(str(current_user.id), user_preferences)
        return full_plan
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except SupabaseDatabaseError as e: # Catch my custom Supabase error
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate plan: {e.detail}"
        )
    except APIError as e: # Catch raw PostgREST API errors
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Supabase API Error during plan generation: {e.message}"
        )
    except Exception as e:
        # Ensure the detail is always a string, even if 'e' is not a typical exception object
        error_detail = str(e)
        if hasattr(e, 'message'): # For APIError or similar objects
            error_detail = e.message
        elif hasattr(e, 'detail'): # For SupabaseDatabaseError
            error_detail = e.detail
            
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred during plan generation: {error_detail}"
        )

@router.post("/log/meal", status_code=status.HTTP_201_CREATED)
def log_meal(
    meal_log_data: MealLogRequest,
    current_user: User = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client) # Inject Supabase client
) -> MealLogResponse: # Changed return type to MealLogResponse
    """
    Logs a meal as 'Eaten' or 'Skipped' for the authenticated user.
    """
    if not current_user or not current_user.id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate user ID.",
        )
    
    from app.crud.meal import crud_meal_log # Import crud_meal_log here
    crud_meal_log.client = supabase # Set the client

    try:
        created_log = crud_meal_log.create_meal_log(user_id=current_user.id, meal_log=meal_log_data)
        return created_log
    except SupabaseDatabaseError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to log meal: {e.detail}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred while logging meal: {str(e)}"
        )
