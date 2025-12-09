from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status, Header

from app.schemas.user_preferences import UserPreferences, UserProfileUpdate
from app.services.user_profile_service import UserProfileService
from supabase_client import supabase # Assuming this is available and configured

router = APIRouter()

# Dependency to get the current user's ID from the Authorization header
async def get_current_user_id(authorization: Annotated[str | None, Header()] = None) -> UUID:
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing",
        )
    
    # Extract JWT token (Bearer <token>)
    scheme, token = authorization.split()
    if scheme.lower() != 'bearer':
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization scheme must be Bearer",
        )
    
    try:
        # Verify the token with Supabase and get user
        # Note: In a production app, you might use a dedicated auth library or a more
        # robust way to verify tokens without hitting Supabase every time.
        # This example directly verifies with Supabase.
        response = await supabase.auth.get_user(token)
        
        if response.user:
            return UUID(response.user.id)
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token",
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {e}",
        )

@router.post("/preferences", status_code=status.HTTP_200_OK)
async def save_onboarding_preferences(
    preferences: UserPreferences,
    user_id: Annotated[UUID, Depends(get_current_user_id)],
    user_profile_service: UserProfileService = Depends(UserProfileService)
):
    """
    Receives user preferences from the onboarding flow and saves them to the user's profile.
    """
    try:
        # Convert UserPreferences to UserProfileUpdate for the service
        update_data = UserProfileUpdate(
            fitnessGoal=preferences.fitnessGoal,
            dietaryPreferences=preferences.dietaryPreferences,
            fitnessPersona=preferences.fitnessPersona,
            workoutFrequency=preferences.workoutFrequency
        )
        
        updated_profile = await user_profile_service.update_user_preferences(user_id, update_data)
        
        return {"message": "Preferences saved successfully", "user_id": user_id, "updated_profile": updated_profile}
    except HTTPException:
        raise # Re-raise HTTPException directly
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save preferences: {e}",
        )
