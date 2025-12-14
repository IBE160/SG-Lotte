from pydantic import BaseModel, Field
from typing import Literal, Optional
from uuid import UUID
from datetime import datetime

class WorkoutLogRequest(BaseModel):
    workout_plan_id: Optional[int] = Field(None, description="ID of the workout plan the logged workout belongs to.")
    exercise_name: str = Field(..., max_length=255, description="Name of the exercise being logged.")
    sets_completed: Optional[int] = Field(None, description="Number of sets completed.")
    reps_completed: Optional[str] = Field(None, max_length=50, description="Repetition range or description (e.g., '8-12', 'until failure').")
    weight_lifted: Optional[float] = Field(None, description="Weight lifted in kg or lbs.")
    difficulty_rating: Optional[int] = Field(None, ge=1, le=5, description="Difficulty rating from 1 (easy) to 5 (very hard) if workout is completed.")
    status: Literal["Completed", "Skipped"] = Field(..., description="Status of the workout: 'Completed' or 'Skipped'.")

class WorkoutLogResponse(BaseModel):
    id: int = Field(..., description="Unique ID of the workout log entry.")
    user_id: UUID = Field(..., description="ID of the user who logged the workout.")
    workout_plan_id: Optional[int] = Field(None, description="ID of the workout plan the logged workout belongs to.")
    exercise_name: str = Field(..., max_length=255, description="Name of the exercise being logged.")
    sets_completed: Optional[int] = Field(None, description="Number of sets completed.")
    reps_completed: Optional[str] = Field(None, max_length=50, description="Repetition range or description.")
    weight_lifted: Optional[float] = Field(None, description="Weight lifted in kg or lbs.")
    difficulty_rating: Optional[int] = Field(None, ge=1, le=5, description="Difficulty rating.")
    status: Literal["Completed", "Skipped"] = Field(..., description="Status of the workout.")
    logged_at: datetime = Field(..., description="Timestamp when the workout was logged.")

    class Config:
        from_attributes = True # Allow ORM mode
