from app.core.supabase import supabase
from app.schemas.user import UserProfileUpdate
from app.core.exceptions import SupabaseDatabaseError

async def update_user_profile(user_id: str, profile_data: UserProfileUpdate):
    """
    Updates the user profile in Supabase.
    """
    # Filter out None values to avoid updating fields that are not provided
    update_data = profile_data.dict(exclude_unset=True)

    if not update_data:
        return {"message": "No data provided for update."}

    response = await supabase.table("user_profiles").update(update_data).eq("id", user_id).execute()

    if response.data:
        return response.data[0]
    elif response.count is not None and response.count == 0:
        # If count is 0, it means no row matched the ID, so the user_profile might not exist.
        # This could be handled as an error or by creating the profile if it's the first update.
        # For now, we'll return None and let the endpoint handle it.
        return None
    else:
        # Handle other potential errors from Supabase
        raise SupabaseDatabaseError(detail=response.error.message)
