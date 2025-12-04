from sqlalchemy import Column, String, Integer, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.db import Base

class WorkoutLogModel(Base):
    __tablename__ = "workout_logs"

    id = Column(String, primary_key=True, index=True) # UUID for Supabase
    user_id = Column(String, ForeignKey("users.id"), index=True) # Link to Supabase auth.users
    workout_id = Column(String, index=True, nullable=False) # ID of the workout being logged
    status = Column(String, nullable=False) # "Completed" or "Skipped"
    difficulty_rating = Column(Integer, nullable=True) # 1-5 scale, nullable if status is "Skipped"
    logged_at = Column(DateTime, default=func.now(), nullable=False) # Timestamp when the log was created

    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relationship to UserModel
    owner = relationship("UserModel", back_populates="workout_logs")
