import os
import google.generativeai as genai
from typing import List, Dict, Any
import json
import asyncio

class AIPlanGenerator:
    """
    Service to interact with Google Gemini AI to generate
    personalized workout and meal plans.
    """

    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY environment variable not set.")
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-pro') # Using gemini-pro as per tech spec

    async def generate_plan(self, user_preferences: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generates a 7-day personalized workout and meal plan based on user preferences.

        Args:
            user_preferences (Dict[str, Any]): A dictionary containing user preferences
                                               (goals, dietary, persona).

        Returns:
            Dict[str, Any]: A structured JSON response containing the generated
                            workout and meal plans.
        """
        # 1. Define input parameters based on user preferences
        goals = user_preferences.get("fitness_goal", "general fitness")
        dietary = user_preferences.get("dietary_preferences", "no specific restrictions")
        persona = user_preferences.get("fitness_persona", "beginner")

        # 2. Formulate prompts for Gemini 2.5
        prompt = f"""
        Generate a 7-day personalized workout and meal plan.
        The user's fitness goal is: {goals}.
        The user's dietary preferences are: {dietary}.
        The user's fitness level/persona is: {persona}.

        The output should be a JSON object with two main keys: "workout_plan" and "meal_plan".
        Each plan should be an array of 7 daily entries.

        For "workout_plan", each daily entry should have:
        - "day": (e.g., "Monday")
        - "focus": (e.g., "Upper Body", "Cardio", "Rest")
        - "exercises": (an array of exercise objects)
            - "name": (e.g., "Push-ups")
            - "sets": (e.g., 3)
            - "reps": (e.g., "8-12")
            - "notes": (optional, e.g., "Keep elbows tucked")

        For "meal_plan", each daily entry should have:
        - "day": (e.g., "Monday")
        - "meals": (an array of meal objects)
            - "type": (e.g., "Breakfast", "Lunch", "Dinner", "Snack")
            - "description": (e.g., "Oatmeal with berries and nuts")
            - "calories": (optional, e.g., 400)
            - "protein_g": (optional, e.g., 20)

        Ensure the plans are realistic, safe, and aligned with the user's preferences.
        """

        retries = 3
        for attempt in range(retries):
            try:
                # 3. Call Gemini 2.5 API
                response = await asyncio.to_thread(self.model.generate_content, prompt)
                
                # Extracting JSON from the response text
                # Gemini often returns markdown code blocks, so we need to parse that.
                response_text = response.text.strip()
                if response_text.startswith("```json"):
                    response_text = response_text[len("```json"):].strip()
                if response_text.endswith("```"):
                    response_text = response_text[:-len("```")].strip()

                # 4. Parse structured JSON response from Gemini 2.5
                generated_plan = json.loads(response_text)
                return generated_plan

            except json.JSONDecodeError as e:
                print(f"JSON decoding error on attempt {attempt + 1}: {e}")
                if attempt < retries - 1:
                    await asyncio.sleep(2 ** attempt) # Exponential backoff
                else:
                    raise ValueError("Failed to parse AI response after multiple retries.") from e
            except Exception as e:
                print(f"Error generating plan on attempt {attempt + 1}: {e}")
                if attempt < retries - 1:
                    await asyncio.sleep(2 ** attempt) # Exponential backoff
                else:
                    raise ValueError("Failed to generate AI plan after multiple retries.") from e