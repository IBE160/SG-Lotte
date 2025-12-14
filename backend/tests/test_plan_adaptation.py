import pytest
from unittest.mock import patch, AsyncMock
from uuid import uuid4
from fastapi.testclient import TestClient
from app.main import app
from app.services.ai_plan_generator import FullPlan, WorkoutPlan, MealPlan, DailyWorkout, DailyMeal, WorkoutExercise, MealItem

# --- Test Data ---
@pytest.fixture
def user_id():
    return str(uuid4())

@pytest.fixture
def user_preferences():
    return {
        "fitness_goal": "build muscle",
        "dietary_preferences": "high protein",
        "fitness_persona": "intermediate"
    }

@pytest.fixture
def sample_meal_logs():
    return [] # Empty for now, can be expanded

@pytest.fixture
def sample_workout_logs():
    return [] # Empty for now, can be expanded

@pytest.fixture
def sample_full_plan():
    return FullPlan(
        workout_plan=WorkoutPlan(plan=[DailyWorkout(day="Monday", focus="Test", exercises=[WorkoutExercise(name="Test Exercise")])]),
        meal_plan=MealPlan(plan=[DailyMeal(day="Monday", meal_type="Breakfast", items=[MealItem(name="Test Meal")])])
    )

# --- Unit Test for the Service ---
@pytest.mark.asyncio
@patch('app.services.ai_plan_generator.get_latest_workout_plan', new_callable=AsyncMock)
@patch('app.services.ai_plan_generator.get_latest_meal_plan', new_callable=AsyncMock)
@patch('app.services.ai_plan_generator.generate_ai_response', new_callable=AsyncMock)
@patch('app.services.ai_plan_generator.create_workout_plan', new_callable=AsyncMock)
@patch('app.services.ai_plan_generator.create_meal_plan', new_callable=AsyncMock)
async def test_adapt_ai_plan_service(
    mock_create_meal_plan, mock_create_workout_plan, mock_generate_ai,
    mock_get_meal_plan, mock_get_workout_plan,
    user_id, user_preferences, sample_meal_logs, sample_workout_logs, sample_full_plan
):
    from app.services.ai_plan_generator import adapt_ai_plan
    
    # Arrange
    mock_get_workout_plan.return_value = sample_full_plan.workout_plan
    mock_get_meal_plan.return_value = sample_full_plan.meal_plan
    # The AI response needs to be a JSON string
    mock_generate_ai.return_value = sample_full_plan.model_dump_json()

    # Act
    result = await adapt_ai_plan(user_id, user_preferences, sample_meal_logs, sample_workout_logs)

    # Assert
    mock_generate_ai.assert_called_once()
    mock_create_workout_plan.assert_called_once()
    mock_create_meal_plan.assert_called_once()
    assert isinstance(result, FullPlan)
    assert result.workout_plan.plan[0].focus == "Test"

# --- Integration Test for the Endpoint ---
client = TestClient(app)

@patch('app.api.v1.deps.get_current_user')
@patch('app.api.v1.endpoints.plans.get_crud_meal_log')
@patch('app.api.v1.endpoints.plans.get_crud_workout_log')
@patch('app.api.v1.endpoints.plans.adapt_ai_plan', new_callable=AsyncMock)
def test_adapt_plan_endpoint(
    mock_adapt_ai_plan, mock_get_crud_workout_log, mock_get_crud_meal_log, mock_get_current_user,
    user_id, sample_full_plan
):
    # Arrange
    # Mock the user dependency
    mock_user = type('User', (), {'id': user_id})
    mock_get_current_user.return_value = mock_user

    # Mock the CRUD dependencies to return async mocks
    mock_meal_crud = AsyncMock()
    mock_meal_crud.get_meal_logs_last_7_days.return_value = []
    mock_get_crud_meal_log.return_value = mock_meal_crud

    mock_workout_crud = AsyncMock()
    mock_workout_crud.get_workout_logs_last_7_days.return_value = []
    mock_get_crud_workout_log.return_value = mock_workout_crud
    
    # Mock the service function called by the endpoint
    mock_adapt_ai_plan.return_value = sample_full_plan

    # Act
    response = client.post("/api/v1/plans/adapt")

    # Assert
    assert response.status_code == 200
    assert response.json()["workout_plan"]["plan"][0]["focus"] == "Test"
    mock_adapt_ai_plan.assert_called_once()
