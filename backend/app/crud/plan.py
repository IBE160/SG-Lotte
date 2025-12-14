from typing import Dict, Any
from supabase import Client as SupabaseClient
from app.core.supabase import get_supabase_client
from app.core.exceptions import SupabaseDatabaseError
from postgrest.exceptions import APIError

def create_workout_plan(user_id: str, plan_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Saves a generated workout plan to the Supabase database.
    """
    supabase: SupabaseClient = get_supabase_client()
    try:
        response = supabase.table("workout_plans").insert({
            "user_id": user_id,
            "plan": plan_data
        }).execute()
        
        if hasattr(response, 'error') and response.error:
            raise SupabaseDatabaseError(detail=response.error.message) # Assuming error object has message

        if not response.data:
            # If data is empty after execute, it means insertion failed
            raise SupabaseDatabaseError(detail="Failed to create workout plan: No data returned from Supabase.")
        return response.data[0]
    except APIError as e:
        raise SupabaseDatabaseError(detail=e.message)
    except Exception as e:
        # Ensure we capture a meaningful error message without assuming 'message' or 'detail' attributes
        error_message = f"An unexpected error occurred: {type(e).__name__}"
        if hasattr(e, 'message'):
            error_message = e.message
        elif hasattr(e, 'detail'):
            error_message = e.detail
        elif str(e): # Fallback to default string representation if not empty
            error_message = str(e)
        
        print(f"Error saving workout plan to Supabase: {error_message}")
        raise SupabaseDatabaseError(detail=f"Unexpected error during workout plan storage: {error_message}")

def create_meal_plan(user_id: str, plan_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Saves a generated meal plan to the Supabase database.
    """
    supabase: SupabaseClient = get_supabase_client()
    try:
        response = supabase.table("meal_plans").insert({
            "user_id": user_id,
            "plan": plan_data
        }).execute()
        
        if hasattr(response, 'error') and response.error:
            raise SupabaseDatabaseError(detail=response.error.message) # Assuming error object has message

        if not response.data:
            # If data is empty after execute, it means insertion failed
            raise SupabaseDatabaseError(detail="Failed to create meal plan: No data returned from Supabase.")
        return response.data[0]
    except APIError as e:
        raise SupabaseDatabaseError(detail=e.message)
    except Exception as e:
        # Ensure we capture a meaningful error message without assuming 'message' or 'detail' attributes
        error_message = f"An unexpected error occurred: {type(e).__name__}"
        if hasattr(e, 'message'):
            error_message = e.message
        elif hasattr(e, 'detail'):
            error_message = e.detail
        elif str(e): # Fallback to default string representation if not empty
            error_message = str(e)

        print(f"Error saving meal plan to Supabase: {error_message}")
        raise SupabaseDatabaseError(detail=f"Unexpected error during meal plan storage: {error_message}")

async def get_latest_workout_plan(user_id: str) -> Dict[str, Any]:
    """
    Retrieves the latest workout plan for a user from the Supabase database.
    """
    supabase: SupabaseClient = get_supabase_client()
    try:
        response = supabase.table("workout_plans").select("*").eq("user_id", user_id).order("created_at", desc=True).limit(1).execute()
        if hasattr(response, 'error') and response.error:
            raise SupabaseDatabaseError(detail=response.error.message)
        if not response.data:
            return None
        return response.data[0]
    except APIError as e:
        raise SupabaseDatabaseError(detail=e.message)
    except Exception as e:
        error_message = f"An unexpected error occurred: {type(e).__name__}"
        if hasattr(e, 'message'):
            error_message = e.message
        elif hasattr(e, 'detail'):
            error_message = e.detail
        elif str(e):
            error_message = str(e)
        
        print(f"Error retrieving workout plan from Supabase: {error_message}")
        raise SupabaseDatabaseError(detail=f"Unexpected error during workout plan retrieval: {error_message}")

async def get_latest_meal_plan(user_id: str) -> Dict[str, Any]:
    """
    Retrieves the latest meal plan for a user from the Supabase database.
    """
    supabase: SupabaseClient = get_supabase_client()
    try:
        response = supabase.table("meal_plans").select("*").eq("user_id", user_id).order("created_at", desc=True).limit(1).execute()
        if hasattr(response, 'error') and response.error:
            raise SupabaseDatabaseError(detail=response.error.message)
        if not response.data:
            return None
        return response.data[0]
    except APIError as e:
        raise SupabaseDatabaseError(detail=e.message)
    except Exception as e:
        error_message = f"An unexpected error occurred: {type(e).__name__}"
        if hasattr(e, 'message'):
            error_message = e.message
        elif hasattr(e, 'detail'):
            error_message = e.detail
        elif str(e):
            error_message = str(e)
        
        print(f"Error retrieving meal plan from Supabase: {error_message}")
        raise SupabaseDatabaseError(detail=f"Unexpected error during meal plan retrieval: {error_message}")

