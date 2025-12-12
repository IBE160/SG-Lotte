import pytest
import uuid
import json
from unittest.mock import AsyncMock, patch
from app.services.ai_plan_generator import get_ai_plan, FullPlan

# Mock response from the AI service
@pytest.fixture
def mock_full_plan_json():
    return """
{
  "workout_plan": {
    "plan": []
  },
  "meal_plan": {
    "plan": []
  }
}
"""

@pytest.mark.asyncio
async def test_get_ai_plan_success(mock_full_plan_json):
    """
    Tests successful AI plan generation, parsing, and storage.
    """
    user_id = str(uuid.uuid4())
    user_preferences = {"fitness_goal": "test"}

    # We patch the dependencies of get_ai_plan, which are generate_ai_response and the create_..._plan functions
    with patch('app.services.ai_plan_generator.generate_ai_response', new_callable=AsyncMock) as mock_generate_response, \
         patch('app.services.ai_plan_generator.create_workout_plan', new_callable=AsyncMock) as mock_create_workout, \
         patch('app.services.ai_plan_generator.create_meal_plan', new_callable=AsyncMock) as mock_create_meal:
        
        mock_generate_response.return_value = mock_full_plan_json
        mock_create_workout.return_value = {}
        mock_create_meal.return_value = {}

        plan = await get_ai_plan(user_id, user_preferences)

        mock_generate_response.assert_called_once()
        prompt_arg = mock_generate_response.call_args[0][0]
        assert user_preferences['fitness_goal'] in prompt_arg
        assert json.dumps(FullPlan.model_json_schema(), indent=2) in prompt_arg
        
        assert isinstance(plan, FullPlan)
        mock_create_workout.assert_called_once_with(user_id, plan.workout_plan.model_dump())
        mock_create_meal.assert_called_once_with(user_id, plan.meal_plan.model_dump())

@pytest.mark.asyncio
async def test_get_ai_plan_invalid_json():
    """
    Tests that get_ai_plan raises a ValueError for invalid JSON.
    """
    user_id = str(uuid.uuid4())
    user_preferences = {}
    
    with patch('app.services.ai_plan_generator.generate_ai_response', new_callable=AsyncMock) as mock_generate_response:
        mock_generate_response.return_value = "invalid json"
        with pytest.raises(ValueError, match="AI response is not valid JSON"):
            await get_ai_plan(user_id, user_preferences)

@pytest.mark.asyncio
async def test_get_ai_plan_validation_error():
    """
    Tests that get_ai_plan raises a ValueError for data that doesn't match the Pydantic model.
    """
    user_id = str(uuid.uuid4())
    user_preferences = {}
    
    with patch('app.services.ai_plan_generator.generate_ai_response', new_callable=AsyncMock) as mock_generate_response:
        mock_generate_response.return_value = '{"workout_plan": "not a plan"}'
        with pytest.raises(ValueError, match="Invalid AI response"):
            await get_ai_plan(user_id, user_preferences)
