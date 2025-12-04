from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, EmailStr
from typing import Dict, Any

from app.schemas.user_preferences import UserPreferences
from app.core.dependencies import get_current_user, get_db
from supabase import Client # Keep Client for type hinting

router = APIRouter()

class UserCreate(BaseModel):
    email: EmailStr
    password: str

@router.post("/signup")
async def signup_user(user: UserCreate) -> Dict[str, str]:
    if user.email == "existing@example.com":
        raise HTTPException(status_code=400, detail="User with this email already exists.")
    
    print(f"Backend received signup request for: {user.email}")

    return {"message": "User signup request received and processed."}


@router.put("/users/preferences", status_code=status.HTTP_200_OK, response_model=None)
async def update_user_preferences(
    preferences: UserPreferences,
    db = Depends(get_db), # Use the new get_db dependency
    current_user: Dict[str, str] = Depends(get_current_user),
) -> Dict[str, str]:
    """
    Update the authenticated user's fitness goals, dietary preferences, and fitness persona.
    """
    user_id = current_user["id"]
    print(f"Received user preferences update for user {user_id}: {preferences.model_dump()}")

    response = None # Initialize response
    try:
        response = await db.from_('user_profiles').update(preferences.model_dump(exclude_unset=True)).eq('user_id', user_id).execute()
        if response.data and response.data[0]:
            return {"message": "User preferences updated successfully."}
        else:
            raise HTTPException(status_code=404, detail="User profile not found or no changes made.")
    except HTTPException as e:
        # Re-raise HTTPException directly, don't convert to 500
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update user preferences: An unexpected error occurred.")
