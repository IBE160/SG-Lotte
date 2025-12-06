# backend/app/models/plan.py
from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import relationship
from app.core.db import Base

# Import UserProfileModel for relationships
from app.models.user_profile import UserProfileModel

class WorkoutPlanModel(Base):
    __tablename__ = "workout_plans"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True) # UUID for Supabase
    user_id = Column(UUID(as_uuid=True), ForeignKey("user_profiles.user_id"), index=True) # Link to user_profiles table
    plan_data = Column(JSONB, nullable=False) # Store the flexible plan data as JSONB
    generated_at = Column(String, nullable=False) # ISO 8601 string

    # Relationship to UserProfileModel
    user_profile = relationship("UserProfileModel", back_populates="workout_plans")
    workout_logs = relationship("WorkoutLogModel", back_populates="workout_plan") # Added back_populates

class MealPlanModel(Base):
    __tablename__ = "meal_plans"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True) # UUID for Supabase
    user_id = Column(UUID(as_uuid=True), ForeignKey("user_profiles.user_id"), index=True) # Link to user_profiles table
    plan_data = Column(JSONB, nullable=False) # Store the flexible plan data as JSONB
    generated_at = Column(String, nullable=False) # ISO 8601 string

    # Relationship to UserProfileModel
    user_profile = relationship("UserProfileModel", back_populates="meal_plans")

# This model represents the Supabase auth.users table,
# which stores basic authentication information.
class AuthUserModel(Base):
    __tablename__ = "users" # Refers to Supabase auth.users table

    id = Column(UUID(as_uuid=True), primary_key=True, index=True) # Supabase user UUID
    email = Column(String, unique=True, index=True)