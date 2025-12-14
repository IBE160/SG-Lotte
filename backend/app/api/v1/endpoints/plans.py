from fastapi import APIRouter, Depends, HTTPException, status, Request
from pydantic import ValidationError
from typing import Dict, Any
from uuid import UUID
from app.services.ai_plan_generator import FullPlan, get_ai_plan
from app.schemas.user import User
from app.api.v1.deps import get_current_user
from app.core.exceptions import SupabaseDatabaseError
from postgrest.exceptions import APIError
from app.schemas.meal import MealLogRequest, MealLogResponse
from app.schemas.workout import WorkoutLogRequest, WorkoutLogResponse
from app.crud.meal import CRUDMealLog, get_crud_meal_log
from app.crud.workout import CRUDWorkoutLog, get_crud_workout_log

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
async def log_meal( # Make function async
    meal_log_data: MealLogRequest,
    current_user: User = Depends(get_current_user),
    crud_meal_log_instance: CRUDMealLog = Depends(get_crud_meal_log) # Inject CRUDMealLog instance
) -> MealLogResponse: # Changed return type to MealLogResponse
    """
    Logs a meal as 'Eaten' or 'Skipped' for the authenticated user.
    """
    if not current_user or not current_user.id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate user ID.",
        )

    # Log incoming /log/meal payload for debugging 500
    print(f"\n[DEBUG] Incoming /log/meal payload: {meal_log_data.model_dump_json()}")
    
    try:
        created_log = await crud_meal_log_instance.create_meal_log(user_id=UUID(current_user.id), meal_log=meal_log_data) # Await the async function
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

@router.post("/log/workout", status_code=status.HTTP_201_CREATED)
async def log_workout(
    request: Request, # Add request to access raw body
    current_user: User = Depends(get_current_user),
    crud_workout_log_instance: CRUDWorkoutLog = Depends(get_crud_workout_log)
) -> WorkoutLogResponse:
    """
    Logs a workout as 'Completed' or 'Skipped' for the authenticated user.
    """
    if not current_user or not current_user.id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate user ID.",
        )

    # --- Temporary Debugging ---
    raw_body = await request.json()
    print(f"\n[DEBUG] Raw /log/workout payload: {raw_body}")
    
    try:
        workout_log_data = WorkoutLogRequest.model_validate(raw_body)
        print(f"[DEBUG] Validated /log/workout payload: {workout_log_data.model_dump_json()}")
    except ValidationError as e:
        print(f"[DEBUG] Validation Error for /log/workout: {e.errors()}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=e.errors()
        )
    # --- End Temporary Debugging ---

    try:
        created_log = await crud_workout_log_instance.create_workout_log(user_id=UUID(current_user.id), workout_log=workout_log_data)
        return created_log
    except SupabaseDatabaseError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to log workout: {e.detail}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred while logging workout: {str(e)}"
        )
