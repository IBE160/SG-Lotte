import json
import os
import asyncio
import google.generativeai as genai
from pydantic import BaseModel, Field, ValidationError
from typing import List, Optional, Dict, Any
from app.core.exceptions import SupabaseDatabaseError
from postgrest.exceptions import APIError

# Import CRUD operations for plans
from app.crud.plan import create_workout_plan, create_meal_plan, get_latest_workout_plan, get_latest_meal_plan
from app.crud.meal import CRUDMealLog
from app.crud.workout import CRUDWorkoutLog
from app.schemas.meal import MealLogResponse
from app.schemas.workout import WorkoutLogResponse

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
GEMINI_MODEL_ID = os.getenv("GEMINI_MODEL", "models/gemini-2.5-flash") # Default to models/gemini-2.5-flash

async def generate_ai_response(prompt: str) -> str:
    """
    Calls the Gemini API with the given prompt and returns the structured JSON response.
    Includes retry mechanism with exponential backoff.
    """
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY environment variable not set. Please set it to your Gemini API key.")

    try:
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel(GEMINI_MODEL_ID)
    except Exception as e:
        raise ValueError(f"Failed to configure Gemini model '{GEMINI_MODEL_ID}': {e}")

    max_retries = 3
    base_delay = 1.0 # seconds

    for attempt in range(max_retries):
        try:
            response = await model.generate_content_async(prompt)
            if response.parts:
                full_response_text = "".join([part.text for part in response.parts if hasattr(part, 'text')])
                return full_response_text
            return response.text
        except Exception as e:
            print(f"Attempt {attempt + 1} failed with error: {e}")
            if attempt < max_retries - 1:
                delay = base_delay * (2 ** attempt)
                print(f"Retrying in {delay:.2f} seconds...")
                await asyncio.sleep(delay)
            else:
                raise # Re-raise after max retries

async def adapt_ai_plan(user_id: str, user_preferences: Dict[str, Any], meal_logs: list[MealLogResponse], workout_logs: list[WorkoutLogResponse]) -> FullPlan:
    """
    Adapts the user's existing plan based on the last 7 days of logs.
    """
    current_workout_plan_data = await get_latest_workout_plan(user_id)
    current_meal_plan_data = await get_latest_meal_plan(user_id)

    current_workout_plan: Optional[WorkoutPlan] = None
    if current_workout_plan_data:
        current_workout_plan = WorkoutPlan.model_validate(current_workout_plan_data['plan'])

    current_meal_plan: Optional[MealPlan] = None
    if current_meal_plan_data:
        current_meal_plan = MealPlan.model_validate(current_meal_plan_data['plan'])

    prompt = f"""
    Please adapt the following fitness and meal plan based on the user's recent activity and preferences.

    User Preferences:
    - Fitness Goal: {user_preferences.get("fitness_goal", "Not specified")}
    - Dietary Preferences: {user_preferences.get("dietary_preferences", "Not specified")}
    - Fitness Persona: {user_preferences.get("fitness_persona", "Not specified")}

    Current Workout Plan:
    {current_workout_plan.model_dump_json(indent=2) if current_workout_plan else "No current workout plan."}

    Current Meal Plan:
    {current_meal_plan.model_dump_json(indent=2) if current_meal_plan else "No current meal plan."}

    Last 7 Days Meal Logs:
    {json.dumps([log.model_dump() for log in meal_logs], indent=2)}

    Last 7 Days Workout Logs:
    {json.dumps([log.model_dump() for log in workout_logs], indent=2)}

    Based on the logs, please generate a new 7-day workout and meal plan.
    The new plan should be in the same JSON format as the original FullPlan.
    - If the user consistently skipped a workout, consider replacing it or reducing its intensity.
    - If the user logged meals that deviate from the plan, adjust the next week's meal plan to better match their preferences, while still aligning with their goals.
    - If the user marked workouts as 'too easy' or 'too hard', adjust the difficulty accordingly.

    Return a single JSON object containing the new 'workout_plan' and 'meal_plan'.
    """

    ai_response_str = await generate_ai_response(prompt)
    
    try:
        # The AI response might be wrapped in markdown ```json ... ```
        if ai_response_str.strip().startswith("```json"):
            ai_response_str = ai_response_str.strip()[7:-4]

        ai_response_json = json.loads(ai_response_str)
        full_plan = FullPlan.model_validate(ai_response_json)
    except (ValidationError, json.JSONDecodeError) as e:
        raise ValueError(f"Failed to parse AI response into FullPlan: {e}")

    try:
        # Store the generated plans in the database
        await create_workout_plan(user_id, full_plan.workout_plan.model_dump())
        await create_meal_plan(user_id, full_plan.meal_plan.model_dump())
    except (SupabaseDatabaseError, APIError) as e:
        raise e
    except Exception as e:
        raise SupabaseDatabaseError(detail=f"Unexpected error during plan storage: {str(e)}")

    return full_plan
