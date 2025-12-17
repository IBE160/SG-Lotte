from typing import Optional
from pydantic import BaseModel, Field, ConfigDict
import uuid

class User(BaseModel):
    id: uuid.UUID
    email: str
    aud: str

class UserProfileUpdate(BaseModel):
    fitness_goal: Optional[str] = Field("", alias='fitnessGoal')
    dietary_preference: Optional[str] = Field("", alias='dietaryPreference')
    fitness_persona: Optional[str] = Field("", alias='fitnessPersona')
    app_settings: Optional[dict] = Field(None, alias='appSettings')

    model_config = ConfigDict(populate_by_name=True)

class UserProfileGetResponse(UserProfileUpdate):
    id: uuid.UUID # Add the user ID to the response
    app_settings: dict = Field(default_factory=lambda: {"dark_mode": False, "notifications_enabled": True}, alias='appSettings')

