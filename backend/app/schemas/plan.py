# backend/app/schemas/plan.py
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# Schema for a single exercise within a workout plan
class Exercise(BaseModel):
    name: str = Field(..., example="Push-ups")
    sets: int = Field(..., example=3)
    reps: str = Field(..., example="8-12") # Can be a range or fixed number
    rest_time_seconds: int = Field(..., example=60)
    notes: Optional[str] = Field(None, example="Keep a straight back")

# Schema for a single workout session
class WorkoutSession(BaseModel):
    day_of_week: str = Field(..., example="Monday")
    focus: str = Field(..., example="Chest and Triceps")
    exercises: List[Exercise] = Field(...)

# Schema for a full workout plan (e.g., 7 days)
class WorkoutPlan(BaseModel):
    plan_name: str = Field(..., example="Beginner Strength")
    sessions: List[WorkoutSession] = Field(...)
    duration_days: int = Field(7, example=7)
    notes: Optional[str] = Field(None, example="Focus on form over weight.")

# Schema for a single meal item
class MealItem(BaseModel):
    name: str = Field(..., example="Grilled Chicken Breast")
    quantity: str = Field(..., example="150g")
    unit: Optional[str] = Field(None, example="grams") # e.g., 'grams', 'ml', 'pieces'
    calories: Optional[int] = Field(None, example=300)
    protein: Optional[float] = Field(None, example=45.0)
    carbs: Optional[float] = Field(None, example=5.0)
    fat: Optional[float] = Field(None, example=12.0)

# Schema for a single meal
class Meal(BaseModel):
    name: str = Field(..., example="Breakfast")
    items: List[MealItem] = Field(...)
    total_calories: Optional[int] = Field(None, example=450)

# Schema for a daily meal plan
class DailyMealPlan(BaseModel):
    day_of_week: str = Field(..., example="Monday")
    meals: List[Meal] = Field(...)

# Schema for a full meal plan (e.g., 7 days)
class MealPlan(BaseModel):
    plan_name: str = Field(..., example="Low Carb Diet")
    daily_plans: List[DailyMealPlan] = Field(...)
    duration_days: int = Field(7, example=7)
    notes: Optional[str] = Field(None, example="Stay hydrated.")

# Combined schema for AI plan generation response
class AIPlanResponse(BaseModel):
    workout_plan: WorkoutPlan
    meal_plan: MealPlan
    user_id: str = Field(..., example="a1b2c3d4-e5f6-7890-1234-567890abcdef")
    generated_at: str = Field(..., example="2025-12-04T10:30:00Z") # ISO 8601 format
