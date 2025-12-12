from typing import Dict, Any
from supabase import Client as SupabaseClient
from app.core.supabase import get_supabase_client

async def create_workout_plan(user_id: str, plan_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Saves a generated workout plan to the Supabase database.
    """
    supabase: SupabaseClient = get_supabase_client()
    try:
        response = await supabase.table("workout_plans").insert({
            "user_id": user_id,
            "plan": plan_data
        }).execute()
        response.raise_for_status()  # Raise an exception for bad status codes
        return response.data[0]
    except Exception as e:
        print(f"Error saving workout plan to Supabase: {e}")
        raise

async def create_meal_plan(user_id: str, plan_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Saves a generated meal plan to the Supabase database.
    """
    supabase: SupabaseClient = get_supabase_client()
    try:
        response = await supabase.table("meal_plans").insert({
            "user_id": user_id,
            "plan": plan_data
        }).execute()
        response.raise_for_status()  # Raise an exception for bad status codes
        return response.data[0]
    except Exception as e:
        print(f"Error saving meal plan to Supabase: {e}")
        raise
