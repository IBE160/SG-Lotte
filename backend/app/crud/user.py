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
