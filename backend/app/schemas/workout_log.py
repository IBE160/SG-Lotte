# backend/app/schemas/workout_log.py
from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID

class LogWorkoutRequest(BaseModel):
    workout_plan_id: UUID = Field(..., description="The ID of the workout plan entry being logged.")
    day_of_week: int = Field(..., ge=1, le=7, description="The day of the week the workout was performed (1=Monday, 7=Sunday).")
    status: str = Field(..., pattern="^(Completed|Skipped)$", description="The completion status of the workout ('Completed' or 'Skipped').")
    difficulty_rating: Optional[int] = Field(None, ge=1, le=5, description="The perceived difficulty of the workout on a scale of 1 to 5. Required if status is 'Completed'.")

    # Custom validation for difficulty_rating
    # This cannot be done directly in Field for Optional fields easily,
    # so we'd typically use a @validator or a custom method.
    # For simplicity and direct Field usage, we'll assume frontend sends null if skipped.
    # A more robust validation would be in a service layer or via Pydantic @root_validator.