from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
from pydantic import ValidationError
from typing import Dict, Any, Optional
from uuid import UUID
from datetime import datetime, timedelta, timezone

from app.services.ai_plan_generator import FullPlan, adapt_ai_plan, WorkoutPlan, MealPlan, FALLBACK_FULL_PLAN
from app.schemas.user import User
from app.api.v1.deps import get_current_user
from app.core.exceptions import SupabaseDatabaseError
from postgrest.exceptions import APIError
from app.schemas.meal import MealLogRequest, MealLogResponse
from app.schemas.workout import WorkoutLogRequest, WorkoutLogResponse
from app.crud.meal import CRUDMealLog, get_crud_meal_log
from app.crud.workout import CRUDWorkoutLog, get_crud_workout_log
from app.crud.plan import get_latest_workout_plan, get_latest_meal_plan, create_workout_plan, create_meal_plan


router = APIRouter()

@router.post("/generate", response_model=FullPlan)
async def generate_initial_plan(
    response: Response,
    current_user: User = Depends(get_current_user)
) -> FullPlan:
    """
    Fetches the user's most recent plan. If no plan from the last 7 days is found,
    it generates a new one. Handles missing GEMINI_API_KEY gracefully.
    """
    if not current_user or not current_user.id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate user ID.",
        )

    # 1. Fetch first
    user_id_str = str(current_user.id)
    seven_days_ago = datetime.now(timezone.utc) - timedelta(days=7)
    
    try:
        workout_plan_data = await get_latest_workout_plan(user_id_str)
        meal_plan_data = await get_latest_meal_plan(user_id_str)

        if workout_plan_data and meal_plan_data:
            plan_created_at = datetime.fromisoformat(workout_plan_data['created_at'].replace('Z', '+00:00'))
            if plan_created_at > seven_days_ago:
                # If a recent plan exists, return it with 200 OK.
                validated_workout_plan = WorkoutPlan.model_validate(workout_plan_data['plan'])
                validated_meal_plan = MealPlan.model_validate(meal_plan_data['plan'])
                
                response.status_code = status.HTTP_200_OK
                return FullPlan(
                    workout_plan=validated_workout_plan,
                    meal_plan=validated_meal_plan
                )
    except (SupabaseDatabaseError, APIError) as e:
        print(f"Error fetching existing plan, proceeding to generation: {e}")

    # 2. If no recent plan, generate second
    user_preferences: Dict[str, Any] = {
        "fitness_goal": "lose weight",
        "dietary_preferences": "vegetarian, high protein",
        "fitness_persona": "beginner, prefers home workouts"
    }

    try:
        full_plan = await adapt_ai_plan(user_id_str, user_preferences, [], [])
        response.status_code = status.HTTP_201_CREATED
        return full_plan
    except ValueError as e:
        print(f"Plan generation failed (likely missing API key): {e}. Using fallback plan.")
        # Use fallback plan and persist it
        full_plan = FALLBACK_FULL_PLAN
        try:
            create_workout_plan(user_id_str, full_plan.workout_plan.model_dump())
            create_meal_plan(user_id_str, full_plan.meal_plan.model_dump())
            response.status_code = status.HTTP_200_OK # Fallback is a successful return
            return full_plan
        except (SupabaseDatabaseError, APIError) as db_e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to save fallback plan to database: {getattr(db_e, 'message', str(db_e))}"
            )
    except (SupabaseDatabaseError, APIError) as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error during plan generation: {getattr(e, 'message', str(e))}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred during plan generation: {str(e)}"
        )

@router.post("/adapt", response_model=FullPlan, status_code=status.HTTP_200_OK)
async def adapt_plan(
    current_user: User = Depends(get_current_user),
    crud_meal_log: CRUDMealLog = Depends(get_crud_meal_log),
    crud_workout_log: CRUDWorkoutLog = Depends(get_crud_workout_log)
) -> FullPlan:
    """
    Adapts the user's plan based on the last 7 days of activity.
    """
    if not current_user or not current_user.id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate user ID.",
        )

    user_preferences: Dict[str, Any] = {
        "fitness_goal": "lose weight",
        "dietary_preferences": "vegetarian, high protein",
        "fitness_persona": "beginner, prefers home workouts"
    }

    try:
        meal_logs = await crud_meal_log.get_meal_logs_last_7_days(user_id=UUID(current_user.id))
        workout_logs = await crud_workout_log.get_workout_logs_last_7_days(user_id=UUID(current_user.id))

        full_plan = await adapt_ai_plan(str(current_user.id), user_preferences, meal_logs, workout_logs)
        return full_plan
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except SupabaseDatabaseError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to adapt plan: {e.detail}"
        )
    except APIError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Supabase API Error during plan adaptation: {e.message}"
        )
    except Exception as e:
        error_detail = str(e)
        if hasattr(e, 'message'):
            error_detail = e.message
        elif hasattr(e, 'detail'):
            error_detail = e.detail
            
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred during plan adaptation: {error_detail}"
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
