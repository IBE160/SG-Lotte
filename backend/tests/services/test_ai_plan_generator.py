# backend/tests/services/test_ai_plan_generator.py
import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from sqlalchemy.orm import Session
import os
import json

from app.services.ai_plan_generator import AIPlanGeneratorService
from app.schemas.user_preferences import UserPreferences
from app.schemas.plan import AIPlanResponse, WorkoutPlan, MealPlan, WorkoutSession, Exercise, DailyMealPlan, Meal, MealItem
from app.models.plan import WorkoutPlanModel, MealPlanModel

# Mock the genai module
# We need to mock it at the global level before AIPlanGeneratorService is imported
# Or we can mock it specifically for the test. Let's patch it in the test function scope.


@pytest.fixture
def mock_db_session():
    return MagicMock(spec=Session)

@pytest.fixture
def ai_plan_generator_service(mock_db_session):
    # Patch genai.GenerativeModel during fixture creation
    with patch('app.services.ai_plan_generator.genai.GenerativeModel') as MockGenerativeModel:
        # Configure the mock to return an AsyncMock for generate_content_async
        MockGenerativeModel.return_value.generate_content_async = AsyncMock()
        service = AIPlanGeneratorService(mock_db_session)
    return service

@pytest.fixture
def mock_gemini_response_data():
    return {
        "workout_plan": {
            "plan_name": "Test Workout",
            "sessions": [
                {
                    "day_of_week": "Monday",
                    "focus": "Upper Body",
                    "exercises": [
                        {"name": "Push-ups", "sets": 3, "reps": "10-12", "rest_time_seconds": 60}
                    ]
                }
            ],
            "duration_days": 7
        },
        "meal_plan": {
            "plan_name": "Test Meal Plan",
            "daily_plans": [
                {
                    "day_of_week": "Monday",
                    "meals": [
                        {"name": "Breakfast", "items": [{"name": "Oatmeal", "quantity": "1", "unit": "cup"}]}
                    ]
                }
            ],
            "duration_days": 7
        },
        "user_id": "test_user_id",
        "generated_at": "2025-12-04T10:30:00Z"
    }

@pytest.fixture
def mock_user_preferences():
    return UserPreferences(
        fitness_goal="loseWeight",
        dietary_preferences=["vegetarian"],
        fitness_persona="casual"
    )

@pytest.mark.asyncio
@patch.dict(os.environ, {"GEMINI_API_KEY": "TEST_KEY"}) # Patch environment variable
async def test_generate_and_store_plan_success(ai_plan_generator_service, mock_gemini_response_data, mock_user_preferences):
    # Get the mock generate_content_async from the service instance
    mock_generate_content_async = ai_plan_generator_service.model.generate_content_async
    
    gemini_response_mock = MagicMock()
    gemini_response_mock.text = json.dumps(mock_gemini_response_data)
    mock_generate_content_async.return_value = gemini_response_mock

    user_id = "test_user_id"
    plan_response = await ai_plan_generator_service.generate_and_store_plan(user_id, mock_user_preferences)

    assert isinstance(plan_response, AIPlanResponse)
    assert plan_response.user_id == user_id
    assert ai_plan_generator_service.db_session.add.call_count == 2
    assert isinstance(ai_plan_generator_service.db_session.add.call_args_list[0].args[0], WorkoutPlanModel)
    assert isinstance(ai_plan_generator_service.db_session.add.call_args_list[1].args[0], MealPlanModel)
    
    # Assert that generate_content_async was called
    mock_generate_content_async.assert_called_once()


@pytest.mark.asyncio
@patch.dict(os.environ, {"GEMINI_API_KEY": "TEST_KEY"}) # Patch environment variable
async def test_generate_and_store_plan_invalid_json_response(ai_plan_generator_service, mock_user_preferences):
    mock_generate_content_async = ai_plan_generator_service.model.generate_content_async

    gemini_response_mock = MagicMock()
    gemini_response_mock.text = "invalid json"
    mock_generate_content_async.return_value = gemini_response_mock

    user_id = "test_user_id"
    with pytest.raises(ValueError, match="AI response is not valid JSON"):
        await ai_plan_generator_service.generate_and_store_plan(user_id, mock_user_preferences)

    ai_plan_generator_service.db_session.add.assert_not_called()
    mock_generate_content_async.assert_called_once()


@pytest.mark.asyncio
@patch.dict(os.environ, {"GEMINI_API_KEY": "TEST_KEY"}) # Patch environment variable
async def test_generate_and_store_plan_validation_error(ai_plan_generator_service, mock_user_preferences):
    mock_generate_content_async = ai_plan_generator_service.model.generate_content_async

    gemini_response_mock = MagicMock()
    # Missing required field 'plan_name' in workout_plan to trigger validation error
    invalid_data = {
        "workout_plan": {
            "sessions": [],
            "duration_days": 7
        },
        "meal_plan": {
            "plan_name": "Test Meal Plan",
            "daily_plans": [],
            "duration_days": 7
        },
        "user_id": "test_user_id",
        "generated_at": "2025-12-04T10:30:00Z"
    }
    gemini_response_mock.text = json.dumps(invalid_data)
    mock_generate_content_async.return_value = gemini_response_mock

    user_id = "test_user_id"
    with pytest.raises(ValueError, match="Failed to parse or validate AI response"):
        await ai_plan_generator_service.generate_and_store_plan(user_id, mock_user_preferences)

    ai_plan_generator_service.db_session.add.assert_not_called()
    mock_generate_content_async.assert_called_once()