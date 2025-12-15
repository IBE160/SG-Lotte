from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from .__init__ import Base
from .weight_log import WeightLog
from .workout_log import WorkoutLog
from .meal_log import MealLog
from .notification import Notification

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    weight_logs = relationship("WeightLog", back_populates="owner")
    workout_logs = relationship("WorkoutLog", back_populates="owner")
    meal_logs = relationship("MealLog", back_populates="owner")
    notifications = relationship("Notification", back_populates="owner")