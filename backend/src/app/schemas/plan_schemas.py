from pydantic import BaseModel, Field
from typing import List, Optional

# --- Workout Plan Schemas ---

class Exercise(BaseModel):
    name: str = Field(..., example="Push-ups")
    sets: int = Field(..., example=3)
    reps: str = Field(..., example="8-12")
    notes: Optional[str] = Field(None, example="Keep elbows tucked")

class DailyWorkoutPlan(BaseModel):
    day: str = Field(..., example="Monday")
    focus: str = Field(..., example="Upper Body")
    exercises: List[Exercise]

class WorkoutPlan(BaseModel):
    days: List[DailyWorkoutPlan]

# --- Meal Plan Schemas ---

class MealItem(BaseModel):
    type: str = Field(..., example="Breakfast")
    description: str = Field(..., example="Oatmeal with berries and nuts")
    calories: Optional[int] = Field(None, example=400)
    protein_g: Optional[int] = Field(None, example=20)

class DailyMealPlan(BaseModel):
    day: str = Field(..., example="Monday")
    meals: List[MealItem]

class MealPlan(BaseModel):
    days: List[DailyMealPlan]

# --- Combined Plan Schema for AI Response ---

class AIPlanResponse(BaseModel):
    workout_plan: WorkoutPlan
    meal_plan: MealPlan
