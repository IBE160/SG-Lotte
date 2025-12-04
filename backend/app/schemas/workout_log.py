from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum
import uuid

class WorkoutStatus(str, Enum):
    completed = "completed"
    skipped = "skipped"
    partial = "partial"

class WorkoutLogCreate(BaseModel):
    workout_id: Optional[uuid.UUID] = Field(None, description="The UUID of the workout plan associated with this log.")
    status: WorkoutStatus = Field(..., description="The status of the workout (completed, skipped, or partial).")
    difficulty_rating: Optional[int] = Field(None, ge=1, le=5, description="Difficulty rating from 1 to 5, only for completed workouts.")
    duration_minutes: Optional[int] = Field(None, ge=0, description="Duration of the workout in minutes.")
    notes: Optional[str] = Field(None, max_length=500, description="Any additional notes about the workout.")

class WorkoutLogResponse(BaseModel):
    id: uuid.UUID = Field(..., description="The UUID of the created workout log.")
    message: str = Field("Workout logged successfully", description="Confirmation message.")
