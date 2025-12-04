# backend/app/schemas/user_preferences.py
from typing import List, Optional
from pydantic import BaseModel

class UserPreferences(BaseModel):
    fitness_goal: Optional[str] = None
    dietary_preferences: Optional[List[str]] = None
    fitness_persona: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "fitness_goal": "loseWeight",
                "dietary_preferences": ["vegetarian", "glutenFree"],
                "fitness_persona": "dedicated",
            }
        }