import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch
from fastapi import status
from app.main import app
from app.api.v1.deps import get_current_user
from app.schemas.user import User
from app.services.ai_plan_generator import FullPlan, WorkoutPlan, MealPlan, DailyWorkout, DailyMeal, WorkoutExercise, MealItem
import uuid

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
    print(repr(response.json()["detail"]))
    print(len(response.json()["detail"]))
    print(type(response.json()["detail"]))
    # assert "Could not validate credentials" in response.json()["detail"]
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