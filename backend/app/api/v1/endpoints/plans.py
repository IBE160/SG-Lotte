from fastapi import APIRouter, Depends, HTTPException, status
from typing import Dict, Any

from app.api.v1.deps import get_current_user
from app.schemas.user import User  # Assuming a User schema exists
from app.services.ai_plan_generator import get_ai_plan, FullPlan

router = APIRouter()

@router.post("/generate-initial", response_model=FullPlan, status_code=status.HTTP_201_CREATED)
async def generate_initial_plan(
    current_user: User = Depends(get_current_user)
) -> FullPlan:
    """
    Generates an initial 7-day AI-driven workout and meal plan for the authenticated user.
    """
    if not current_user or not current_user.id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate user ID.",
        )

    # Placeholder for user preferences, in a real app these would come from
    # the user's profile after onboarding.
    user_preferences: Dict[str, Any] = {
        "fitness_goal": "lose weight",
        "dietary_preferences": "vegetarian, high protein",
        "fitness_persona": "beginner, prefers home workouts"
    }

    try:
        full_plan = await get_ai_plan(str(current_user.id), user_preferences)
        return full_plan
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate plan: {e}"
        )
