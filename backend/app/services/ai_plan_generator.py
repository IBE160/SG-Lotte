import json
import os
import asyncio
import google.generativeai as genai
from pydantic import BaseModel, Field, ValidationError
from typing import List, Optional, Dict, Any
from app.core.exceptions import SupabaseDatabaseError # Import SupabaseDatabaseError
from postgrest.exceptions import APIError # Import APIError

# Import CRUD operations for plans
from app.crud.plan import create_workout_plan, create_meal_plan

# Pydantic models for the AI-generated workout and meal plans

class WorkoutExercise(BaseModel):
    name: str
    description: Optional[str] = None
    sets: Optional[int] = None
    reps: Optional[str] = None # Can be '8-12', 'until failure', etc.
    duration_minutes: Optional[int] = None
    equipment: Optional[List[str]] = None

class DailyWorkout(BaseModel):
    day: str
    focus: str # E.g., "Legs & Shoulders", "Full Body", "Rest"
    exercises: List[WorkoutExercise] = []
    notes: Optional[str] = None

class MealItem(BaseModel):
    name: str
    description: Optional[str] = None
    calories: Optional[int] = None
    protein_g: Optional[int] = None
    carbs_g: Optional[int] = None
    fat_g: Optional[int] = None

class DailyMeal(BaseModel):
    day: str
    meal_type: str # E.g., "Breakfast", "Lunch", "Dinner", "Snack"
    items: List[MealItem] = []
    total_calories: Optional[int] = None
    notes: Optional[str] = None

class WorkoutPlan(BaseModel):
    plan: List[DailyWorkout]

class MealPlan(BaseModel):
    plan: List[DailyMeal]

class FullPlan(BaseModel):
    workout_plan: WorkoutPlan
    meal_plan: MealPlan

# Configure Gemini API
# Load API key from environment variable
# GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
# if not GEMINI_API_KEY:
#     raise ValueError("GEMINI_API_KEY environment variable not set. Please set it to your Gemini API key.")

# genai.configure(api_key=GEMINI_API_KEY)

# Use the 'gemini-1.5-flash' model as specified in the epic
# model = genai.GenerativeModel('models/gemini-2.0-flash-001')

# async def generate_ai_response(prompt: str) -> str:
#     """
#     Calls the Gemini 1.5 Flash API with the given prompt and returns the structured JSON response.
#     Includes retry mechanism with exponential backoff.
#     """
#     max_retries = 3
#     base_delay = 1.0 # seconds

#     for attempt in range(max_retries):
#         try:
#             response = model.generate_content(prompt)
#             if response.parts:
#                 full_response_text = "".join([part.text for part in response.parts if hasattr(part, 'text')])
#                 return full_response_text
#             return response.text
#         except Exception as e:
#             print(f"Attempt {attempt + 1} failed with error: {e}")
#             if attempt < max_retries - 1:
#                 delay = base_delay * (2 ** attempt)
#                 print(f"Retrying in {delay:.2f} seconds...")
#                 await asyncio.sleep(delay)
#             else:
#                 raise # Re-raise after max retries

def get_ai_plan(user_id: str, user_preferences: Dict[str, Any]) -> FullPlan:
    """
    Generates a 7-day workout and meal plan based on user preferences using an AI,
    validates it, and stores it in the Supabase database.
    (Temporarily bypassed actual AI call due to quota limits for manual verification.)
    """
    fitness_goal = user_preferences.get("fitness_goal", "general fitness")
    dietary_preferences = user_preferences.get("dietary_preferences", "no specific preferences")
    fitness_persona = user_preferences.get("fitness_persona", "someone looking for a balanced approach")

    # --- TEMPORARY DUMMY PLAN FOR MANUAL VERIFICATION ---
    dummy_workout_plan = WorkoutPlan(
        plan=[
            DailyWorkout(
                day="Monday",
                focus="Full Body Beginner",
                exercises=[
                    WorkoutExercise(name="Bodyweight Squats", sets=3, reps="10-12"),
                    WorkoutExercise(name="Push-ups (on knees)", sets=3, reps="8-10"),
                    WorkoutExercise(name="Plank", reps="30 seconds", notes="Hold for 30 seconds")
                ],
                notes=f"Based on your goal: {fitness_goal} and persona: {fitness_persona}"
            ),
            DailyWorkout(day="Tuesday", focus="Rest Day", exercises=[]),
            DailyWorkout(day="Wednesday", focus="Lower Body & Core", exercises=[
                WorkoutExercise(name="Lunges", sets=3, reps="10 per leg"),
                WorkoutExercise(name="Crunches", sets=3, reps="15-20")
            ]),
            DailyWorkout(day="Thursday", focus="Rest Day", exercises=[]),
            DailyWorkout(day="Friday", focus="Upper Body & Cardio", exercises=[
                WorkoutExercise(name="Incline Push-ups", sets=3, reps="8-10"),
                WorkoutExercise(name="Jumping Jacks", duration_minutes=5)
            ]),
            DailyWorkout(day="Saturday", focus="Active Recovery", exercises=[], notes="Light walk or stretching."),
            DailyWorkout(day="Sunday", focus="Rest Day", exercises=[])
        ]
    )
    
    # Create a temporary dictionary to group meals by day,
    # then flatten to ensure 7-day grouping conceptually without changing schema
    meals_by_day: Dict[str, List[DailyMeal]] = {
        day.lower(): [] for day in ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    }

    # Populate meals_by_day dictionary with dummy data
    meals_by_day["monday"].extend([
        DailyMeal(
                day="monday",
                meal_type="Breakfast",
                items=[MealItem(name="Oatmeal with Berries", calories=350, protein_g=15, carbs_g=50, fat_g=10)],
                notes=f"Considering your preferences: {dietary_preferences}"
            ),
        DailyMeal(
                day="monday",
                meal_type="Lunch",
                items=[MealItem(name="Chicken Salad", calories=450, protein_g=30, carbs_g=20, fat_g=25)],
            ),
        DailyMeal(
                day="monday",
                meal_type="Dinner",
                items=[MealItem(name="Baked Salmon with Veggies", calories=500, protein_g=40, carbs_g=30, fat_g=25)],
            ),
    ])

    meals_by_day["tuesday"].extend([
        DailyMeal(
                day="tuesday", # Keep current structure for frontend compatibility
                meal_type="Breakfast",
                items=[MealItem(name="Scrambled Eggs with Toast", calories=400, protein_g=20, carbs_g=30, fat_g=20)],
            ),
        DailyMeal(
                day="tuesday",
                meal_type="Lunch",
                items=[MealItem(name="Lentil Soup", calories=380, protein_g=18, carbs_g=45, fat_g=15)],
            ),
        DailyMeal(
                day="tuesday", # Keep current structure for frontend compatibility
                meal_type="Dinner",
                items=[MealItem(name="Turkey Stir-fry", calories=480, protein_g=35, carbs_g=35, fat_g=20)],
            ),
    ])

    meals_by_day["wednesday"].extend([ # Adding actual meals for Wednesday
            DailyMeal(day="wednesday", meal_type="Breakfast", items=[MealItem(name="Yogurt with Granola")]),
            DailyMeal(day="wednesday", meal_type="Lunch", items=[MealItem(name="Vegetable Soup")]),
            DailyMeal(day="wednesday", meal_type="Dinner", items=[MealItem(name="Pasta Primavera")]),
    ])

    meals_by_day["thursday"].extend([ # Adding actual meals for Thursday
            DailyMeal(day="thursday", meal_type="Breakfast", items=[MealItem(name="Smoothie")]),
            DailyMeal(day="thursday", meal_type="Lunch", items=[MealItem(name="Leftover Pasta")]),
            DailyMeal(day="thursday", meal_type="Dinner", items=[MealItem(name="Fish Tacos")]),
    ])

    meals_by_day["friday"].extend([ # Adding actual meals for Friday
            DailyMeal(day="friday", meal_type="Breakfast", items=[MealItem(name="Pancakes")]),
            DailyMeal(day="friday", meal_type="Lunch", items=[MealItem(name="Sandwich")]),
            DailyMeal(day="friday", meal_type="Dinner", items=[MealItem(name="Pizza (homemade)")]),
    ])

    meals_by_day["saturday"].extend([ # Adding actual meals for Saturday
        DailyMeal(
                day="saturday", # Keep current structure for frontend compatibility
                meal_type="Breakfast",
                items=[MealItem(name="Big Weekend Breakfast")],
                notes="Enjoy your weekend!"
            ),
        DailyMeal(
                day="saturday", # Keep current structure for frontend compatibility
                meal_type="Lunch",
                items=[MealItem(name="Casual Lunch Out")],
                notes="Optional"
            ),
        DailyMeal(
                day="saturday", # Keep current structure for frontend compatibility
                meal_type="Dinner",
                items=[MealItem(name="Dinner with Friends")],
                notes="Optional"
            ),
    ])

    meals_by_day["sunday"].extend([ # Adding actual meals for Sunday
            DailyMeal(day="sunday", meal_type="Breakfast", items=[MealItem(name="Brunch")]),
            DailyMeal(day="sunday", meal_type="Lunch", items=[MealItem(name="Light Lunch")]),
            DailyMeal(day="sunday", meal_type="Dinner", items=[MealItem(name="Family Dinner")]),
    ])

    # Flatten the dictionary back into a list in desired order
    ordered_days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    dummy_meal_plan_list = []
    for day_name in ordered_days:
        dummy_meal_plan_list.extend(meals_by_day[day_name.lower()])

    dummy_meal_plan = MealPlan(plan=dummy_meal_plan_list)
    full_plan = FullPlan(workout_plan=dummy_workout_plan, meal_plan=dummy_meal_plan)

    # Add this print statement for debugging the generated meal plan structure
    print(f"\n[DEBUG] Generated Meal Plan structure:\n{full_plan.meal_plan.model_dump_json(indent=2)}\n")
    # --- END TEMPORARY DUMMY PLAN ---

    try:
        # Store the generated plans in the database
        create_workout_plan(user_id, full_plan.workout_plan.model_dump())
        create_meal_plan(user_id, full_plan.meal_plan.model_dump())
    except (SupabaseDatabaseError, APIError) as e:
        # Re-raise the specific database error
        raise e
    except Exception as e:
        # Catch any other unexpected errors during storage
        raise SupabaseDatabaseError(detail=f"Unexpected error during plan storage: {str(e)}")

    return full_plan
