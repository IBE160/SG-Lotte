import json
import os
import asyncio
import google.generativeai as genai
from pydantic import BaseModel, Field, ValidationError
from typing import List, Optional, Dict, Any

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
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable not set. Please set it to your Gemini API key.")

genai.configure(api_key=GEMINI_API_KEY)

# Use the 'gemini-1.5-flash' model as specified in the epic
model = genai.GenerativeModel('gemini-1.5-flash')

async def generate_ai_response(prompt: str) -> str:
    """
    Calls the Gemini 1.5 Flash API with the given prompt and returns the structured JSON response.
    Includes retry mechanism with exponential backoff.
    """
    max_retries = 3
    base_delay = 1.0 # seconds

    for attempt in range(max_retries):
        try:
            response = model.generate_content(prompt)
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

async def get_ai_plan(user_id: str, user_preferences: Dict[str, Any]) -> FullPlan:
    """
    Generates a 7-day workout and meal plan based on user preferences using an AI,
    validates it, and stores it in the Supabase database.
    """
    fitness_goal = user_preferences.get("fitness_goal", "general fitness")
    dietary_preferences = user_preferences.get("dietary_preferences", "no specific preferences")
    fitness_persona = user_preferences.get("fitness_persona", "someone looking for a balanced approach")

    prompt = f"""
You are an expert fitness and nutrition coach. Your task is to create a personalized 7-day workout and meal plan.

User's Fitness Goal: {fitness_goal}
User's Dietary Preferences: {dietary_preferences}
User's Fitness Persona: {fitness_persona}

Generate a 7-day plan that includes both workout routines and meal suggestions.
The output MUST be a JSON object that strictly adheres to the following Pydantic model structure:
{json.dumps(FullPlan.model_json_schema(), indent=2)}

Ensure that:
- The plan covers 7 days, starting from Monday.
- Workouts specify exercises, sets, reps, and optional equipment.
- Meal plans specify meal types (e.g., Breakfast, Lunch, Dinner, Snack) and detailed items.
- Nutritional information (calories, protein, carbs, fat) is provided for each meal item.
- For rest days, explicitly state "Rest Day" in the workout focus and leave exercises empty.
- Ensure all fields are populated according to the schema requirements (e.g., optional fields can be null or omitted if not applicable).
"""
    print(f"Generated AI Prompt: {prompt[:500]}...") # For debugging purposes

    try:
        ai_response_json_str = await generate_ai_response(prompt)
        ai_response_data = json.loads(ai_response_json_str)
        
        # Validate the response against the Pydantic model
        full_plan = FullPlan.model_validate(ai_response_data)

        # Store the generated plans in the database
        await create_workout_plan(user_id, full_plan.workout_plan.model_dump())
        await create_meal_plan(user_id, full_plan.meal_plan.model_dump())

        return full_plan
    except ValidationError as e:
        print(f"AI response validation error: {e}")
        raise ValueError(f"Invalid AI response: {e}")
    except json.JSONDecodeError as e:
        print(f"AI response is not valid JSON: {e}")
        raise ValueError(f"AI response is not valid JSON: {e}")
    except Exception as e:
        print(f"An unexpected error occurred during AI plan generation or storage: {e}")
        raise
