from typing import List, Optional
from pydantic import BaseModel

class UserPreferences(BaseModel):
    fitnessGoal: str
    dietaryPreferences: List[str]
    fitnessPersona: str
    workoutFrequency: Optional[str] = None

class UserProfileUpdate(BaseModel):
    # This model can be used for updating the user profile in Supabase
    # It allows for partial updates
    fitnessGoal: Optional[str] = None
    dietaryPreferences: Optional[List[str]] = None
    fitnessPersona: Optional[str] = None
    workoutFrequency: Optional[str] = None
