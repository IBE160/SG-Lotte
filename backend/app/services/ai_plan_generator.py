# backend/app/services/ai_plan_generator.py
import google.generativeai as genai
import os
from dotenv import load_dotenv
import json
from uuid import uuid4
from datetime import datetime

from app.schemas.plan import AIPlanResponse # Import the AIPlanResponse schema
from app.schemas.user_preferences import UserPreferences # Import UserPreferences
from app.models.plan import WorkoutPlanModel, MealPlanModel # Import SQLAlchemy models

# Load environment variables
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

class AIPlanGeneratorService:
    def __init__(self, db_session):
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        self.db_session = db_session

    def _construct_prompt(self, user_preferences: UserPreferences) -> str:
        """
        Constructs a detailed prompt for the AI based on user preferences.
        """
        prompt = (
            f"Generate a 7-day personalized workout plan and a 7-day personalized meal plan "
            f"in JSON format, tailored to the following user preferences:\n\n"
            f"Fitness Goal: {user_preferences.fitness_goal or 'Not specified'}\n"
            f"Dietary Preferences: {', '.join(user_preferences.dietary_preferences) or 'None specified'}\n"
            f"Fitness Persona: {user_preferences.fitness_persona or 'Not specified'}\n\n"
            f"The response MUST be a single JSON object matching the `AIPlanResponse` schema, "
            f"which includes 'workout_plan' and 'meal_plan' objects. "
            f"Each workout plan session should have 'day_of_week', 'focus', and a list of 'exercises'. "
            f"Each exercise should have 'name', 'sets', 'reps', 'rest_time_seconds', and optional 'notes'. "
            f"Each meal plan should have 'daily_plans', where each daily plan has 'day_of_week' and a list of 'meals'. "
            f"Each meal should have 'name' and a list of 'items'. "
            f"Each meal item should have 'name', 'quantity', 'unit', and optional 'calories', 'protein', 'carbs', 'fat'.\n"
            f"Ensure all required fields in the schema are present."
        )
        return prompt

    async def generate_and_store_plan(self, user_id: str, user_preferences: UserPreferences) -> AIPlanResponse:
        """
        Generates an AI plan based on user preferences and stores it in the database.
        """
        prompt = self._construct_prompt(user_preferences)
        
        # Call the Gemini API
        response = await self.model.generate_content_async(prompt)
        
        # Assuming the AI response is text that needs to be parsed as JSON
        try:
            # The API might return text with markdown, extract JSON part
            response_text = response.text.strip()
            if response_text.startswith("```json") and response_text.endswith("```"):
                json_string = response_text[7:-3].strip()
            else:
                json_string = response_text
            
            ai_data = json.loads(json_string)
            plan_response = AIPlanResponse(**ai_data) # Validate with Pydantic schema
        except json.JSONDecodeError as e:
            raise ValueError(f"AI response is not valid JSON: {e}. Response: {response.text}")
        except Exception as e:
            raise ValueError(f"Failed to parse or validate AI response: {e}. Response: {response.text}")

        # Store plans in the database
        workout_plan_id = str(uuid4())
        meal_plan_id = str(uuid4())
        current_time = datetime.now().isoformat() + "Z"

        workout_plan_db = WorkoutPlanModel(
            id=workout_plan_id,
            user_id=user_id,
            plan_data=plan_response.workout_plan.model_dump_json(), # Store as JSONB
            generated_at=current_time
        )
        meal_plan_db = MealPlanModel(
            id=meal_plan_id,
            user_id=user_id,
            plan_data=plan_response.meal_plan.model_dump_json(), # Store as JSONB
            generated_at=current_time
        )

        self.db_session.add(workout_plan_db)
        self.db_session.add(meal_plan_db)
        # self.db_session.commit() # Commit will happen in the API endpoint
        
        return plan_response
