from sqlalchemy import Column, String, Integer, Date, ForeignKey, JSON
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid

Base = declarative_base()

class WorkoutPlanModel(Base):
    __tablename__ = "workout_plans"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    plan_start_date = Column(Date, nullable=False)
    plan_end_date = Column(Date, nullable=False)
    plan_data = Column(JSON, nullable=False) # Stores the JSON structure from AI

    user = relationship("UserModel", back_populates="workout_plans")

class MealPlanModel(Base):
    __tablename__ = "meal_plans"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    plan_start_date = Column(Date, nullable=False)
    plan_end_date = Column(Date, nullable=False)
    plan_data = Column(JSON, nullable=False) # Stores the JSON structure from AI

    user = relationship("UserModel", back_populates="meal_plans")

# Assuming a UserModel already exists or will be created for 'users.id' foreign key
# For simplicity, if not existing, a basic placeholder:
class UserModel(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True)
    # Add other user fields as needed for the application
    workout_plans = relationship("WorkoutPlanModel", back_populates="user")
    meal_plans = relationship("MealPlanModel", back_populates="user")
