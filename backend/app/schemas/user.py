from typing import Optional
from pydantic import BaseModel

class UserProfileUpdate(BaseModel):
    fitness_goal: Optional[str] = None
    dietary_preference: Optional[str] = None
    fitness_persona: Optional[str] = None
