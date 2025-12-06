# backend/app/models/user_profile.py
from sqlalchemy import Column, String, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid

from app.core.db import Base

class UserProfileModel(Base):
    __tablename__ = "user_profiles"

    user_id = Column(UUID(as_uuid=True), primary_key=True) # Matches Supabase auth.users.id
    fitness_goal = Column(String, nullable=True)
    dietary_preferences = Column(JSON, nullable=True) # Stores list of strings
    fitness_persona = Column(String, nullable=True)

    # Relationships
    workout_plans = relationship("WorkoutPlanModel", back_populates="user_profile")
    meal_plans = relationship("MealPlanModel", back_populates="user_profile")
    workout_logs = relationship("WorkoutLogModel", back_populates="user_profile")

