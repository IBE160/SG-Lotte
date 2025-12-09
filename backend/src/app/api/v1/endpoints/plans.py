from fastapi import APIRouter, Depends, HTTPException, status
from datetime import date, timedelta
from typing import Dict, Any, Optional
from uuid import UUID

from backend.src.app.services.ai_plan_generator import AIPlanGenerator
from backend.src.app.crud.plan_crud import PlanCRUD
from backend.src.app.schemas.plan_schemas import AIPlanResponse, WorkoutPlan, MealPlan
from backend.src.supabase_client import supabase # Direct access to supabase client
# Assuming a dependency for getting the current user ID.
# For now, a placeholder, in a real app this would be in deps.py or similar.
async def get_current_user_id() -> UUID:
    # In a real application, this would extract user ID from JWT
    # For now, return a dummy UUID for testing/development
    # You would typically have a dependency like:
    # from backend.src.app.api.v1.deps import get_current_user
    # current_user = await get_current_user()
    # return current_user.id
    return UUID("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11") # Dummy UUID

router = APIRouter()
ai_plan_generator = AIPlanGenerator()
plan_crud = PlanCRUD()

@router.post("/generate", response_model=Dict[str, Any], status_code=status.HTTP_201_CREATED)
async def generate_initial_plan(user_id: UUID = Depends(get_current_user_id)):
    """
    Generates a 7-day personalized workout and meal plan for the user
    and stores it in the database.
    """
    # 1. Retrieve user preferences from Supabase (placeholder for now)
    # In a real app, you would fetch user preferences from your 'users' table
    # For now, use dummy preferences
    user_preferences = {
        "fitness_goal": "lose_weight",
        "dietary_preferences": "vegetarian",
        "fitness_persona": "intermediate"
    }

    # 2. Invoke ai_plan_generator.py service
    try:
        generated_plan_raw = await ai_plan_generator.generate_plan(user_preferences)
        generated_plan = AIPlanResponse(**generated_plan_raw) # Validate with Pydantic schema
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate plan: {e}"
        )

    plan_start_date = date.today()
    plan_end_date = plan_start_date + timedelta(days=6)

    # 3. Store generated plans in DB
    try:
        workout_plan_record = await plan_crud.create_workout_plan(
            user_id, plan_start_date, plan_end_date, generated_plan.workout_plan
        )
        meal_plan_record = await plan_crud.create_meal_plan(
            user_id, plan_start_date, plan_end_date, generated_plan.meal_plan
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to store plan in database: {e}"
        )

    return {
        "message": "Plan generation initiated and stored successfully",
        "workout_plan_id": workout_plan_record["id"],
        "meal_plan_id": meal_plan_record["id"]
    }

@router.get("/current", response_model=Dict[str, Any], status_code=status.HTTP_200_OK)
async def get_current_plan(user_id: UUID = Depends(get_current_user_id)):
    """
    Retrieves the current 7-day personalized workout and meal plan for the user.
    """
    workout_plan_data = await plan_crud.get_current_workout_plan(user_id)
    meal_plan_data = await plan_crud.get_current_meal_plan(user_id)

    if not workout_plan_data and not meal_plan_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No current plan found for the user."
        )
    
    # Supabase stores plan_data as JSON string, so we need to parse it back
    workout_plan = json.loads(workout_plan_data["plan_data"]) if workout_plan_data else None
    meal_plan = json.loads(meal_plan_data["plan_data"]) if meal_plan_data else None

    return {
        "workout_plan": workout_plan,
        "meal_plan": meal_plan
    }