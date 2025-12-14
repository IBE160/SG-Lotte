from pydantic import BaseModel, Field
from typing import Literal
from uuid import UUID
from datetime import datetime

class MealLogRequest(BaseModel):
    meal_plan_id: int = Field(..., description="ID of the meal plan the logged meal belongs to.")
    meal_name: str = Field(..., max_length=255, description="Name of the meal being logged.")
    status: Literal["Eaten", "Skipped"] = Field(..., description="Status of the meal: 'Eaten' or 'Skipped'.")

class MealLogResponse(BaseModel):
    id: int = Field(..., description="Unique ID of the meal log entry.")
    user_id: UUID = Field(..., description="ID of the user who logged the meal.")
    meal_plan_id: int = Field(..., description="ID of the meal plan the logged meal belongs to.")
    meal_name: str = Field(..., max_length=255, description="Name of the meal being logged.")
    status: Literal["Eaten", "Skipped"] = Field(..., description="Status of the meal: 'Eaten' or 'Skipped'.")
    logged_at: datetime = Field(..., description="Timestamp when the meal was logged.")

    class Config:
        from_attributes = True # Allow ORM mode
