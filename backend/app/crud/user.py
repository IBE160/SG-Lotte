from app.core.supabase import supabase
from app.schemas.user import UserProfileUpdate
from app.core.exceptions import SupabaseDatabaseError
from postgrest.exceptions import APIError

def update_user_profile(user_id: str, profile_data: UserProfileUpdate):
    """
    Creates or updates the user profile in Supabase.
    """
    update_data = profile_data.model_dump(exclude_unset=True)

    if not update_data:
        return {"message": "No data provided for update."}
    
    # Add the user_id to the data to be upserted, as it's the primary key
    update_data['id'] = user_id

    try:
        response = supabase.table("user_profiles").upsert(update_data).execute()
        
        if not response.data:
            raise SupabaseDatabaseError(detail="Failed to upsert user profile: No data returned from Supabase.")
        return response.data[0]
            
    except APIError as e:
        raise SupabaseDatabaseError(detail=e.message)
    except Exception as e:
        raise SupabaseDatabaseError(detail=str(e))

def get_user_profile_by_id(user_id: str):
    """
    Fetches the user profile from Supabase by user ID.
    """
    try:
        response = supabase.table("user_profiles").select("*").eq("id", user_id).single().execute()
        
        if not response.data:
            return None # Profile not found
        
        # Supabase returns data as a dict, we can validate it against the Pydantic model
        return UserProfileUpdate(**response.data)
            
    except APIError as e:
        if "PGRSTCTL_NOT_FOUND" in e.message: # Supabase specific "not found" error
            return None
        raise SupabaseDatabaseError(detail=e.message)
    except Exception as e:
        raise SupabaseDatabaseError(detail=str(e))

