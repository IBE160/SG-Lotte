from pydantic import BaseModel, Field
from typing import List, Optional

class UserPreferences(BaseModel):
    fitness_goal: Optional[str] = Field(None, description="Primary fitness goal (e.g., 'Lose Weight', 'Build Muscle')")
    dietary_preferences: List[str] = Field([], description="List of dietary preferences (e.g., 'Vegetarian', 'Keto')")
    fitness_persona: Optional[str] = Field(None, description="Fitness persona (e.g., 'Beginner', 'Advanced')")

    class Config:
        json_schema_extra = {
            "example": {
                "fitness_goal": "Build Muscle",
                "dietary_preferences": ["Vegetarian"],
                "fitness_persona": "Intermediate"
            }
        }
