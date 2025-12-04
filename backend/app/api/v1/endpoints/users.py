from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, EmailStr
from typing import Dict, Any, List, Optional
import logging # Import logging module

from app.schemas.user_preferences import UserPreferences # Import the new schema
from app.core.dependencies import get_current_user, get_db
from supabase import Client # Keep Client for type hinting

router = APIRouter()

# Configure basic logging if not already configured
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class UserCreate(BaseModel):
    email: EmailStr
    password: str

@router.post("/signup")
async def signup_user(user: UserCreate) -> Dict[str, str]:
    if user.email == "existing@example.com": # Placeholder for actual Supabase signup logic
        raise HTTPException(status_code=400, detail="User with this email already exists.")
    
    logger.info(f"Backend received signup request for: {user.email}") # Replaced print with logger.info

    return {"message": "User signup request received and processed."}

@router.put("/users/preferences", status_code=status.HTTP_200_OK, response_model=Dict[str, str])
async def update_user_preferences(
    preferences: UserPreferences,
    db: Client = Depends(get_db), # Use the new get_db dependency
    current_user: Dict[str, Any] = Depends(get_current_user), # current_user contains id, email etc.
) -> Dict[str, str]:
    """
    Update the authenticated user's fitness goals, dietary preferences, and fitness persona.
    """
    user_id = current_user["id"]
    logger.info(f"Received user preferences update for user {user_id}: {preferences.model_dump(exclude_unset=True)}") # Replaced print with logger.info

    try:
        # Assuming a 'user_profiles' table with a 'user_id' column linked to auth.users.id
        # and columns for fitness_goal, dietary_preferences, fitness_persona
        # The exclude_unset=True ensures only provided fields are updated.
        response = await db.from_('user_profiles').update(preferences.model_dump(exclude_unset=True)).eq('user_id', user_id).execute()
        
        if response.data:
            logger.info(f"User preferences for {user_id} updated successfully.")
            return {"message": "User preferences updated successfully."}
        else:
            # If data is empty, it might mean the user_profile record doesn't exist yet for this user_id
            # Or no fields were actually changed
            # In a full implementation, you might want to upsert (insert or update)
            logger.warning(f"User profile not found or no changes made for user {user_id}.")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="User profile not found or no changes made. Consider creating a profile on user signup."
            )
    except HTTPException as e:
        # Re-raise HTTPException directly
        logger.error(f"HTTP Exception while updating user preferences for {user_id}: {e.detail}")
        raise e
    except Exception as e:
        logger.error(f"Failed to update user preferences for {user_id}: An unexpected error occurred. {str(e)}", exc_info=True) # Replaced print with logger.error
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Failed to update user preferences: An unexpected error occurred. {str(e)}"
        )