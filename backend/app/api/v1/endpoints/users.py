from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.user import UserProfileUpdate
from app.crud.user import update_user_profile
from app.api.v1.deps import get_current_user
from app.schemas.user import User
from app.core.exceptions import SupabaseDatabaseError

router = APIRouter()

@router.put("/profile/", response_model=UserProfileUpdate)
async def update_profile(
    profile_data: UserProfileUpdate,
    current_user: User = Depends(get_current_user)
):
    """
    Update the authenticated user's profile with provided data.
    """
    user_id = current_user.id
    try:
        updated_profile = await update_user_profile(user_id, profile_data)
    except SupabaseDatabaseError as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=e.detail)

    if updated_profile is None:
        # This case might mean the user_profile entry didn't exist,
        # which could be an edge case depending on application logic.
        # For onboarding, we expect it to exist or be created by default.
        # Consider if creating a profile if not found is desired here.
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User profile not found or could not be updated.")
    
    return profile_data
