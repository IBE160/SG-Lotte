from typing import Optional
from pydantic import BaseModel, Field, ConfigDict
import uuid

class User(BaseModel):
    id: uuid.UUID
    email: str
    aud: str

class UserProfileUpdate(BaseModel):
    fitness_goal: Optional[str] = Field(None, alias='fitnessGoal')
    dietary_preference: Optional[str] = Field(None, alias='dietaryPreference')
    fitness_persona: Optional[str] = Field(None, alias='fitnessPersona')

    model_config = ConfigDict(populate_by_name=True)
