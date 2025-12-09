from datetime import date
from typing import Dict, Any, Optional
from uuid import UUID

from backend.src.supabase_client import supabase
from backend.src.app.schemas.plan_schemas import WorkoutPlan, MealPlan
from backend.src.app.models.plan_models import WorkoutPlanModel, MealPlanModel # Though we directly interact with Supabase client

class PlanCRUD:
    """
    CRUD operations for workout and meal plans in Supabase.
    """

    def __init__(self):
        self.db = supabase # Direct Supabase client

    async def create_workout_plan(
        self,
        user_id: UUID,
        plan_start_date: date,
        plan_end_date: date,
        plan_data: WorkoutPlan
    ) -> Dict[str, Any]:
        """
        Creates a new workout plan entry in Supabase.
        """
        data = {
            "user_id": str(user_id), # Supabase expects string UUID
            "plan_start_date": plan_start_date.isoformat(),
            "plan_end_date": plan_end_date.isoformat(),
            "plan_data": plan_data.model_dump_json() # Store Pydantic model as JSON string
        }
        response = self.db.table("workout_plans").insert(data).execute()
        response.raise_for_status()
        return response.data[0]

    async def create_meal_plan(
        self,
        user_id: UUID,
        plan_start_date: date,
        plan_end_date: date,
        plan_data: MealPlan
    ) -> Dict[str, Any]:
        """
        Creates a new meal plan entry in Supabase.
        """
        data = {
            "user_id": str(user_id),
            "plan_start_date": plan_start_date.isoformat(),
            "plan_end_date": plan_end_date.isoformat(),
            "plan_data": plan_data.model_dump_json() # Store Pydantic model as JSON string
        }
        response = self.db.table("meal_plans").insert(data).execute()
        response.raise_for_status()
        return response.data[0]

    async def get_current_workout_plan(self, user_id: UUID) -> Optional[Dict[str, Any]]:
        """
        Retrieves the current workout plan for a user.
        "Current" implies the plan whose date range includes today.
        """
        today = date.today().isoformat()
        response = self.db.table("workout_plans").select("*") \
            .eq("user_id", str(user_id)) \
            .lte("plan_start_date", today) \
            .gte("plan_end_date", today) \
            .single() \
            .execute()
        
        if response.data:
            # Parse the JSON string back into a Python object if necessary
            # For now, return as is, it's a dict from Supabase.
            return response.data
        return None

    async def get_current_meal_plan(self, user_id: UUID) -> Optional[Dict[str, Any]]:
        """
        Retrieves the current meal plan for a user.
        "Current" implies the plan whose date range includes today.
        """
        today = date.today().isoformat()
        response = self.db.table("meal_plans").select("*") \
            .eq("user_id", str(user_id)) \
            .lte("plan_start_date", today) \
            .gte("plan_end_date", today) \
            .single() \
            .execute()
        
        if response.data:
            return response.data
        return None
