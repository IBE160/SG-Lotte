# backend/tests/test_plans.py
import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, MagicMock, patch
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
import json

from app.main import app
from app.core.dependencies import get_current_user, get_db_session
from app.services.ai_plan_generator import AIPlanGeneratorService
from app.models.plan import WorkoutPlanModel, MealPlanModel # For mocking query results
from app.models.workout_log import WorkoutLogModel # Import for assertion and mocking
from app.schemas.workout_log import LogWorkoutRequest # Import for test data validation


# Create a test client for the FastAPI application
client = TestClient(app)

# Mock get_current_user dependency
mock_authenticated_user = {"id": "test_user_id", "email": "test@example.com"}

def override_get_current_user():
    return mock_authenticated_user

# Mock get_db_session dependency
mock_db_session = MagicMock(spec=Session)

def override_get_db_session():
    yield mock_db_session

# Mock AIPlanGeneratorService
mock_ai_plan_generator_service = MagicMock(spec=AIPlanGeneratorService)


# --- Fixture to set up and tear down dependencies for each test ---
@pytest.fixture(autouse=True)
def setup_test_environment():
    # Store original dependencies
    original_get_current_user = app.dependency_overrides.get(get_current_user)
    original_get_db_session = app.dependency_overrides.get(get_db_session)

    # Set test overrides
    app.dependency_overrides[get_current_user] = override_get_current_user
    app.dependency_overrides[get_db_session] = override_get_db_session

    # Configure the chained mocks for Supabase client interactions that AIPlanGeneratorService uses
    # Default: no existing plans
    mock_db_session.query.return_value.filter_by.return_value.first.return_value = None 
    mock_ai_plan_generator_service.reset_mock() # Reset AI service mock too

    yield # Run the test

    # Restore original dependencies after the test
    if original_get_current_user:
        app.dependency_overrides[get_current_user] = original_get_current_user
    else:
        app.dependency_overrides.pop(get_current_user, None)
    
    if original_get_db_session:
        app.dependency_overrides[get_db_session] = original_get_db_session
    else:
        app.dependency_overrides.pop(get_db_session, None)
    
    # Clear all mocks after test
    mock_db_session.reset_mock()
    mock_ai_plan_generator_service.reset_mock()



# Sample data for successful plan generation
mock_ai_plan_response = {
    "workout_plan": {
        "plan_name": "Generated Workout",
        "sessions": [],
        "duration_days": 7
    },
    "meal_plan": {
        "plan_name": "Generated Meal",
        "daily_plans": [],
        "duration_days": 7
    },
    "user_id": "test_user_id",
    "generated_at": "2025-12-04T12:00:00Z"
}

@pytest.mark.asyncio
async def test_generate_plan_success(setup_test_environment):
    # Mock the AIPlanGeneratorService within the test function's scope
    with patch('app.api.v1.endpoints.plans.AIPlanGeneratorService') as MockServiceClass:
        MockServiceClass.return_value = mock_ai_plan_generator_service
        mock_ai_plan_generator_service.generate_and_store_plan.return_value = AsyncMock(return_value=mock_ai_plan_response)
        
        response = client.post("/api/v1/plans/generate")

        assert response.status_code == status.HTTP_201_CREATED
        assert response.json() == {"message": "AI plans generated and stored successfully."}
        mock_ai_plan_generator_service.generate_and_store_plan.assert_called_once()
        mock_db_session.commit.assert_called_once()


@pytest.mark.asyncio
async def test_generate_plan_conflict_existing_plans(setup_test_environment):
    with patch('app.api.v1.endpoints.plans.AIPlanGeneratorService') as MockServiceClass:
        MockServiceClass.return_value = mock_ai_plan_generator_service

        # Mock existing plans in the database
        mock_db_session.query.return_value.filter_by.return_value.first.side_effect = [
            WorkoutPlanModel(), # Simulate existing workout plan
            MealPlanModel() # Simulate existing meal plan
        ]

        response = client.post("/api/v1/plans/generate")

        assert response.status_code == status.HTTP_409_CONFLICT
        assert "User already has generated plans" in response.json()["detail"]
        mock_ai_plan_generator_service.generate_and_store_plan.assert_not_called()
        mock_db_session.rollback.assert_called_once()


def test_generate_plan_unauthorized(setup_test_environment):
    # Override get_current_user to raise HTTPException for unauthorized access
    def override_get_current_user_unauthorized():
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    # Save original to restore later
    original_get_current_user = app.dependency_overrides.get(get_current_user)
    app.dependency_overrides[get_current_user] = override_get_current_user_unauthorized

    response = client.post("/api/v1/plans/generate")

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert "Not authenticated" in response.json()["detail"]

    # Restore the original dependency (handled by the fixture teardown)
    app.dependency_overrides[get_current_user] = original_get_current_user


@pytest.mark.asyncio
async def test_generate_plan_ai_generation_error(setup_test_environment):
    with patch('app.api.v1.endpoints.plans.AIPlanGeneratorService') as MockServiceClass:
        MockServiceClass.return_value = mock_ai_plan_generator_service
        mock_ai_plan_generator_service.generate_and_store_plan.side_effect = ValueError("AI failed to generate plan")
        
        response = client.post("/api/v1/plans/generate")

        assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
        # Corrected assertion: check for exact string equality
        assert response.json()["detail"] == "Internal Server Error"
        mock_db_session.rollback.assert_called_once()


@pytest.mark.asyncio
async def test_generate_plan_db_storage_error(setup_test_environment):
    with patch('app.api.v1.endpoints.plans.AIPlanGeneratorService') as MockServiceClass:
        MockServiceClass.return_value = mock_ai_plan_generator_service
        mock_ai_plan_generator_service.generate_and_store_plan.return_value = AsyncMock(return_value=mock_ai_plan_response)
        
        # Simulate a database error during commit
        mock_db_session.commit.side_effect = Exception("Database write error")

        response = client.post("/api/v1/plans/generate")

        assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
        # Corrected assertion: check for exact string equality
        assert response.json()["detail"] == "Internal Server Error"
        mock_db_session.rollback.assert_called_once()


# --- Tests for /plans/log-workout endpoint ---

@pytest.mark.asyncio
async def test_log_workout_success_completed(setup_test_environment):
    workout_data = {
        "workout_plan_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        "day_of_week": 1,
        "status": "Completed",
        "difficulty_rating": 4
    }
    response = client.post("/api/v1/plans/log-workout", json=workout_data)

    assert response.status_code == status.HTTP_201_CREATED
    assert response.json() == {"message": "Workout logged successfully."}
    mock_db_session.add.assert_called_once()
    mock_db_session.commit.assert_called_once()
    mock_db_session.refresh.assert_called_once() # Ensure refresh is called for logged_at

@pytest.mark.asyncio
async def test_log_workout_success_skipped(setup_test_environment):
    workout_data = {
        "workout_plan_id": "b1c2d3e4-f5a6-7890-1234-567890abcdef",
        "day_of_week": 2,
        "status": "Skipped",
        "difficulty_rating": None
    }
    response = client.post("/api/v1/plans/log-workout", json=workout_data)

    assert response.status_code == status.HTTP_201_CREATED
    assert response.json() == {"message": "Workout logged successfully."}
    mock_db_session.add.assert_called_once()
    mock_db_session.commit.assert_called_once()
    mock_db_session.refresh.assert_called_once()

@pytest.mark.asyncio
async def test_log_workout_invalid_completed_no_difficulty(setup_test_environment):
    workout_data = {
        "workout_plan_id": "c1d2e3f4-a5b6-7890-1234-567890abcdef",
        "day_of_week": 3,
        "status": "Completed",
        "difficulty_rating": None # Invalid: completed workout needs difficulty
    }
    response = client.post("/api/v1/plans/log-workout", json=workout_data)

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "Difficulty rating is required for completed workouts." in response.json()["detail"]
    mock_db_session.rollback.assert_called_once()

@pytest.mark.asyncio
async def test_log_workout_invalid_skipped_with_difficulty(setup_test_environment):
    workout_data = {
        "workout_plan_id": "d1e2f3a4-b5c6-7890-1234-567890abcdef",
        "day_of_week": 4,
        "status": "Skipped",
        "difficulty_rating": 3 # Invalid: skipped workout should not have difficulty
    }
    response = client.post("/api/v1/plans/log-workout", json=workout_data)

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "Difficulty rating should not be provided for skipped workouts." in response.json()["detail"]
    mock_db_session.rollback.assert_called_once()

@pytest.mark.asyncio
async def test_log_workout_invalid_uuid(setup_test_environment):
    workout_data = {
        "workout_plan_id": "not-a-valid-uuid", # Invalid UUID
        "day_of_week": 5,
        "status": "Completed",
        "difficulty_rating": 5
    }
    response = client.post("/api/v1/plans/log-workout", json=workout_data)

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    assert "value is not a valid uuid" in response.json()["detail"][0]["msg"]
    mock_db_session.rollback.assert_not_called() # Pydantic validation happens before endpoint logic, so no rollback

@pytest.mark.asyncio
async def test_log_workout_invalid_day_of_week(setup_test_environment):
    workout_data = {
        "workout_plan_id": "e1f2a3b4-c5d6-7890-1234-567890abcdef",
        "day_of_week": 0, # Invalid: day_of_week must be 1-7
        "status": "Completed",
        "difficulty_rating": 2
    }
    response = client.post("/api/v1/plans/log-workout", json=workout_data)

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    assert "ensure this value is greater than or equal to 1" in response.json()["detail"][0]["msg"]
    mock_db_session.rollback.assert_not_called()

@pytest.mark.asyncio
async def test_log_workout_db_error(setup_test_environment):
    workout_data = {
        "workout_plan_id": "f1a2b3c4-d5e6-7890-1234-567890abcdef",
        "day_of_week": 6,
        "status": "Completed",
        "difficulty_rating": 3
    }
    mock_db_session.commit.side_effect = Exception("Database write error during log")

    response = client.post("/api/v1/plans/log-workout", json=workout_data)

    assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
    assert response.json()["detail"] == "Internal Server Error"
    mock_db_session.rollback.assert_called_once()