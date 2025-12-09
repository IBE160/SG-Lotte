import pytest
from unittest.mock import AsyncMock, patch
from backend.src.app.services.ai_plan_generator import AIPlanGenerator

@pytest.fixture
def mock_gemini_model():
    """Fixture to mock the Gemini model."""
    with patch('google.generativeai.GenerativeModel') as mock_model_class:
        mock_model_instance = AsyncMock()
        mock_model_class.return_value = mock_model_instance
        yield mock_model_instance

@pytest.mark.asyncio
async def test_generate_plan_success(mock_gemini_model):
    """
    Test successful plan generation with a valid response from Gemini.
    """
    # Mock Gemini's generate_content method to return a predefined response
    mock_gemini_model.generate_content.return_value.text = """
    ```json
    {
        "workout_plan": {
            "days": [
                {
                    "day": "Monday",
                    "focus": "Upper Body",
                    "exercises": [
                        {"name": "Push-ups", "sets": 3, "reps": "8-12", "notes": "Warm-up"}
                    ]
                }
            ]
        },
        "meal_plan": {
            "days": [
                {
                    "day": "Monday",
                    "meals": [
                        {"type": "Breakfast", "description": "Oatmeal", "calories": 300}
                    ]
                }
            ]
        }
    }
    ```
    """

    generator = AIPlanGenerator()
    user_preferences = {
        "fitness_goal": "build muscle",
        "dietary_preferences": "high protein",
        "fitness_persona": "advanced"
    }

    plan = await generator.generate_plan(user_preferences)

    assert "workout_plan" in plan
    assert "meal_plan" in plan
    assert len(plan["workout_plan"]["days"]) == 1 # Based on mock
    assert plan["workout_plan"]["days"][0]["day"] == "Monday"
    mock_gemini_model.generate_content.assert_called_once()


@pytest.mark.asyncio
async def test_generate_plan_api_error(mock_gemini_model):
    """
    Test plan generation when Gemini API returns an error or invalid response.
    """
    # Mock Gemini to raise an exception
    mock_gemini_model.generate_content.side_effect = Exception("Gemini API error")

    generator = AIPlanGenerator()
    user_preferences = {
        "fitness_goal": "lose weight",
        "dietary_preferences": "low carb",
        "fitness_persona": "beginner"
    }

    with pytest.raises(ValueError, match="Failed to generate AI plan after multiple retries."):
        await generator.generate_plan(user_preferences)
    
    # Verify that retries were attempted (3 attempts total in the implementation)
    assert mock_gemini_model.generate_content.call_count == 3

@pytest.mark.asyncio
async def test_generate_plan_invalid_json_response(mock_gemini_model):
    """
    Test plan generation when Gemini returns malformed JSON.
    """
    mock_gemini_model.generate_content.return_value.text = "This is not JSON"

    generator = AIPlanGenerator()
    user_preferences = {
        "fitness_goal": "maintain",
        "dietary_preferences": "vegan",
        "fitness_persona": "intermediate"
    }

    with pytest.raises(ValueError, match="Failed to parse AI response after multiple retries."):
        await generator.generate_plan(user_preferences)
    
    # Verify that retries were attempted
    assert mock_gemini_model.generate_content.call_count == 3
