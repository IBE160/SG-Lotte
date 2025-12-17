from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.user import UserProfileUpdate, UserProfileGetResponse
from app.crud.user import update_user_profile, get_user_profile_by_id
from app.api.v1.deps import get_current_user
from app.schemas.user import User
from app.core.exceptions import SupabaseDatabaseError
from postgrest.exceptions import APIError # Import APIError

router = APIRouter()

@router.get("/profile/", response_model=UserProfileGetResponse)
def read_profile(
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve the authenticated user's profile.
    """
    if not current_user or not current_user.id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )
    
    try:
        user_profile_data = get_user_profile_by_id(str(current_user.id))
        
        # Default settings
        default_settings = {"dark_mode": False, "notifications_enabled": True}

        if user_profile_data is None:
            # Profile doesn't exist, return a default response
            return UserProfileGetResponse(
                id=current_user.id,
                fitness_goal="",
                dietary_preference="",
                fitness_persona="",
                app_settings=default_settings
            )
        
        # Profile exists, ensure app_settings are present
        # If app_settings is None or missing from the db record, merge with defaults
        if 'app_settings' not in user_profile_data or user_profile_data['app_settings'] is None:
            user_profile_data['app_settings'] = default_settings
        else:
            # If app_settings exists, merge it with defaults to add any missing keys
            user_profile_data['app_settings'] = {**default_settings, **user_profile_data['app_settings']}

        return UserProfileGetResponse(**user_profile_data)
    except SupabaseDatabaseError as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database Error: {e.detail}")
    except Exception as e:
        print(f"UNEXPECTED ERROR in read_profile: {type(e).__name__} - {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected server error occurred: {str(e)}"
        )

@router.put("/profile/", response_model=UserProfileUpdate)
def update_profile(
    profile_data: UserProfileUpdate,
    current_user: User = Depends(get_current_user)
):
    """
    Update the authenticated user's profile with provided data.
    """
    if not current_user or not current_user.id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )
    
    user_id = str(current_user.id) # Define user_id here

    try:
        updated_profile = update_user_profile(user_id, profile_data)
        
        if updated_profile is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="User profile not found or could not be updated."
            )
        
        return updated_profile

    except SupabaseDatabaseError as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database Error: {e.detail}")
    except APIError as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Supabase API Error: {e.message}")
    except Exception as e:
        # This is a catch-all for any other unexpected errors.
        print(f"UNEXPECTED ERROR in update_profile: {type(e).__name__} - {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected server error occurred: {str(e)}"
        )
