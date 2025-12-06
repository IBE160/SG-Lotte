# backend/app/models/workout_log.py
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.core.db import Base
from app.models.user_profile import UserProfileModel # Import UserProfileModel
from app.models.plan import WorkoutPlanModel # Import WorkoutPlanModel

class WorkoutLogModel(Base):
    __tablename__ = "workout_log"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("user_profiles.user_id"), nullable=False) # Link to user_profiles table
    workout_plan_id = Column(UUID(as_uuid=True), ForeignKey("workout_plans.id"), nullable=False) # Link to specific workout plan entry
    day_of_week = Column(Integer, nullable=False) # 1=Monday, 7=Sunday
    status = Column(String, nullable=False) # 'Completed' or 'Skipped'
    difficulty_rating = Column(Integer, nullable=True) # 1-5, only if status is 'Completed'
    logged_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user_profile = relationship("UserProfileModel", back_populates="workout_logs")
    workout_plan = relationship("WorkoutPlanModel", back_populates="workout_logs")