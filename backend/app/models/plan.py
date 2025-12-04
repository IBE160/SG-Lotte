# backend/app/models/plan.py
from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from app.core.db import Base # Import Base from app.core.db

class WorkoutPlanModel(Base):
    __tablename__ = "workout_plans"

    id = Column(String, primary_key=True, index=True) # UUID for Supabase
    user_id = Column(String, ForeignKey("users.id"), index=True) # Link to Supabase auth.users
    plan_data = Column(JSONB, nullable=False) # Store the flexible plan data as JSONB
    generated_at = Column(String, nullable=False) # ISO 8601 string

    # Relationship to UserModel, assuming UserModel is also defined and Base is shared
    owner = relationship("UserModel", back_populates="workout_plans")

class MealPlanModel(Base):
    __tablename__ = "meal_plans"

    id = Column(String, primary_key=True, index=True) # UUID for Supabase
    user_id = Column(String, ForeignKey("users.id"), index=True) # Link to Supabase auth.users
    plan_data = Column(JSONB, nullable=False) # Store the flexible plan data as JSONB
    generated_at = Column(String, nullable=False) # ISO 8601 string

    # Relationship to UserModel, assuming UserModel is also defined and Base is shared
    owner = relationship("UserModel", back_populates="meal_plans")

# Define a simple UserModel for ForeignKey reference, if not already defined elsewhere
# This ensures that 'users.id' can be referenced.
class UserModel(Base):
    __tablename__ = "users" # Refers to Supabase auth.users table

    id = Column(String, primary_key=True, index=True) # Supabase user UUID
    email = Column(String, unique=True, index=True)

    workout_plans = relationship("WorkoutPlanModel", back_populates="owner")
    meal_plans = relationship("MealPlanModel", back_populates="owner")
    workout_logs = relationship("WorkoutLogModel", back_populates="owner")