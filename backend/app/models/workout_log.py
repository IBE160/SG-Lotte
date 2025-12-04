import enum
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from app.core.db import Base

class WorkoutLogStatus(enum.Enum):
    completed = "completed"
    skipped = "skipped"

class WorkoutLogModel(Base):
    __tablename__ = "workout_logs"

    id = Column(String, primary_key=True, index=True) # UUID for Supabase
    user_id = Column(String, ForeignKey("users.id"), index=True) # Link to Supabase auth.users
    workout_id = Column(String, index=True, nullable=False) # ID of the workout being logged
    status = Column(Enum(WorkoutLogStatus), nullable=False)
    difficulty_rating = Column(Integer, nullable=True) # 1-5 scale, nullable if status is "Skipped"
    logged_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationship to UserModel
    owner = relationship("UserModel", back_populates="workout_logs")
