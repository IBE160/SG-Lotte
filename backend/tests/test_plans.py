import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch
from unittest import mock # Import mock
from fastapi import status
from app.main import app
from app.api.v1.deps import get_current_user
from app.schemas.user import User
from app.services.ai_plan_generator import FullPlan, WorkoutPlan, MealPlan, DailyWorkout, DailyMeal, WorkoutExercise, MealItem
import uuid
from app.schemas.meal import MealLogRequest, MealLogResponse # Import meal schemas

@pytest.fixture
def client():
    yield TestClient(app)

@pytest.fixture
def authorized_user():
    return User(id=str(uuid.uuid4()), email="test@example.com", aud="authenticated")

@pytest.fixture
def mock_full_plan_instance():
    return FullPlan(
        workout_plan=WorkoutPlan(plan=[]),
        meal_plan=MealPlan(plan=[])
    )

def test_generate_initial_plan_unauthenticated(client):
    """
    Test that an unauthenticated request returns 401.
    """
    async def override_get_current_user_is_none():
        return None
        
    app.dependency_overrides[get_current_user] = override_get_current_user_is_none
    response = client.post("/api/v1/plans/generate-initial")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json()["detail"] == "Could not validate credentials"
    app.dependency_overrides = {}

def test_generate_initial_plan_success(client, authorized_user, mock_full_plan_instance):
    """
    Test successful plan generation for an authenticated user.
    """
    app.dependency_overrides[get_current_user] = lambda: authorized_user
    
    with patch('app.api.v1.endpoints.plans.get_ai_plan', new_callable=AsyncMock) as mock_get_ai_plan:
        mock_get_ai_plan.return_value = mock_full_plan_instance
        
        response = client.post("/api/v1/plans/generate-initial")
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.json() == mock_full_plan_instance.model_dump()
        mock_get_ai_plan.assert_called_once()
        # Check call arguments inside the test
        args, _ = mock_get_ai_plan.call_args
        assert args[0] == str(authorized_user.id)
        
    app.dependency_overrides = {}

def test_generate_initial_plan_ai_failure(client, authorized_user):
    """
    Test that an AI generation failure returns a 400 bad request.
    """
    app.dependency_overrides[get_current_user] = lambda: authorized_user
    
    with patch('app.api.v1.endpoints.plans.get_ai_plan', new_callable=AsyncMock) as mock_get_ai_plan:
        mock_get_ai_plan.side_effect = ValueError("AI failed")
        
        response = client.post("/api/v1/plans/generate-initial")
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.json()["detail"] == "AI failed"
        
    app.dependency_overrides = {}

def test_generate_initial_plan_db_failure(client, authorized_user):
    """
    Test that a database storage failure returns a 500 internal server error.
    """
    app.dependency_overrides[get_current_user] = lambda: authorized_user
    
    with patch('app.api.v1.endpoints.plans.get_ai_plan', new_callable=AsyncMock) as mock_get_ai_plan:
        mock_get_ai_plan.side_effect = Exception("DB is down")
        
        response = client.post("/api/v1/plans/generate-initial")
        
        assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
        assert "Failed to generate plan: DB is down" in response.json()["detail"]
        
    app.dependency_overrides = {}

def test_log_meal_unauthorized(client):
    """
    Test that an unauthenticated request to log a meal returns 401.
    """
    async def override_get_current_user_is_none():
        return None
        
    app.dependency_overrides[get_current_user] = override_get_current_user_is_none
    
    meal_data = {
        "meal_plan_id": 1,
        "meal_name": "Test Meal",
        "status": "Eaten"
    }
    
    response = client.post("/api/v1/log/meal", json=meal_data)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json()["detail"] == "Could not validate user ID."
    app.dependency_overrides = {}

@mock.patch("app.crud.meal.crud_meal_log.create_meal_log", new_callable=AsyncMock)
def test_log_meal_success(mock_create_meal_log, client, authorized_user):
    """
    Test successful meal logging for an authenticated user.
    """
    app.dependency_overrides[get_current_user] = lambda: authorized_user
    
    meal_data_request = MealLogRequest(
        meal_plan_id=1,
        meal_name="Breakfast Oats",
        status="Eaten"
    )
    
    mock_response = MealLogResponse(
        id=1,
        user_id=uuid.UUID(authorized_user.id), # Convert to UUID type
        meal_plan_id=meal_data_request.meal_plan_id,
        meal_name=meal_data_request.meal_name,
        status=meal_data_request.status,
        logged_at="2025-12-14T10:00:00Z" # Example datetime string
    )
    mock_create_meal_log.return_value = mock_response
    
    response = client.post("/api/v1/log/meal", json=meal_data_request.model_dump())
    
    assert response.status_code == status.HTTP_201_CREATED
    assert response.json()["id"] == mock_response.id
    mock_create_meal_log.assert_called_once_with(user_id=uuid.UUID(authorized_user.id), meal_log=meal_data_request) # Convert to UUID type
    app.dependency_overrides = {}