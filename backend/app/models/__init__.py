from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

from .user import User
from .weight_log import WeightLog
from .workout_log import WorkoutLog
from .meal_log import MealLog

