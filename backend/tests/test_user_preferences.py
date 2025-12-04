# backend/tests/test_user_preferences.py
import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, MagicMock

from app.main import app # Adjusted import path
from app.core.dependencies import get_db, get_current_user # Adjusted import path
from app.schemas.user_preferences import UserPreferences # Adjusted import path
from fastapi import HTTPException, status # Import HTTPException and status

# Create a test client for the FastAPI application
client = TestClient(app)

# Mock Supabase client
mock_supabase_client = MagicMock()

# Mock the get_db dependency
def override_get_db():
    yield mock_supabase_client

# Mock the get_current_user dependency to simulate an authenticated user
mock_authenticated_user = {"id": "test_user_id", "email": "test@example.com"}

def override_get_current_user():
    return mock_authenticated_user

# Apply the overrides
app.dependency_overrides[get_db] = override_get_db
app.dependency_overrides[get_current_user] = override_get_current_user

@pytest.fixture(autouse=True)
def run_around_tests():
    # Reset mocks before each test
    mock_supabase_client.reset_mock()

    # Configure the chained mocks for Supabase client interactions
    # This mock needs to be a new MagicMock for each test run to prevent call count issues
    mock_execute_method = AsyncMock()
    mock_supabase_client.from_.return_value.update.return_value.eq.return_value.execute = mock_execute_method

    # Store the mock_execute_method in the mock_supabase_client for easier access in tests
    mock_supabase_client._mock_execute_method = mock_execute_method

    yield

    # Ensure overrides are reset after each test to prevent interference
    app.dependency_overrides[get_db] = override_get_db # Restore original mock for get_db
    app.dependency_overrides[get_current_user] = override_get_current_user # Restore original mock for get_current_user


def test_update_user_preferences_success():
    # Configure the mock_execute_method for this specific test
    mock_supabase_client._mock_execute_method.return_value = MagicMock(
        data=[{"message": "User preferences updated successfully."}],
        count=1,
        status_code=200
    )

    preferences_data = {
        "fitness_goal": "gainMuscle",
        "dietary_preferences": ["vegan"],
        "fitness_persona": "athlete"
    }
    response = client.put("/api/v1/users/preferences", json=preferences_data)

    assert response.status_code == 200
    assert response.json() == {"message": "User preferences updated successfully."}
    
    mock_supabase_client.from_.assert_called_with('user_profiles')
    mock_supabase_client.from_.return_value.update.assert_called_with(preferences_data)
    mock_supabase_client.from_.return_value.update.return_value.eq.assert_called_with('user_id', mock_authenticated_user["id"])
    mock_supabase_client._mock_execute_method.assert_called_once()


def test_update_user_preferences_partial_update():
    # Configure the mock_execute_method for this specific test
    mock_supabase_client._mock_execute_method.return_value = MagicMock(
        data=[{"message": "User preferences updated successfully."}],
        count=1,
        status_code=200
    )

    preferences_data = {
        "fitness_goal": "loseWeight"
    }
    response = client.put("/api/v1/users/preferences", json=preferences_data)

    assert response.status_code == 200
    assert response.json() == {"message": "User preferences updated successfully."}
    
    mock_supabase_client.from_.assert_called_with('user_profiles')
    mock_supabase_client.from_.return_value.update.assert_called_with(preferences_data)
    mock_supabase_client.from_.return_value.update.return_value.eq.assert_called_with('user_id', mock_authenticated_user["id"])
    mock_supabase_client._mock_execute_method.assert_called_once()


def test_update_user_preferences_no_profile_found():
    # Configure the mock_execute_method for this specific test
    mock_supabase_client._mock_execute_method.return_value = MagicMock(
        data=[], # Empty data
        count=0,
        status_code=200
    )

    preferences_data = {
        "fitness_goal": "gainMuscle"
    }
    response = client.put("/api/v1/users/preferences", json=preferences_data)

    assert response.status_code == 404
    assert "User profile not found or no changes made" in response.json()["detail"]
    mock_supabase_client._mock_execute_method.assert_called_once()


def test_update_user_preferences_unauthorized():
    # Override get_current_user to raise HTTPException for unauthorized access
    def override_get_current_user_unauthorized():
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    app.dependency_overrides[get_current_user] = override_get_current_user_unauthorized

    response = client.put("/api/v1/users/preferences", json={})

    assert response.status_code == 401
    assert "Not authenticated" in response.json()["detail"]
    
    # Restore original override after the test (handled by fixture teardown)
    # app.dependency_overrides[get_current_user] = override_get_current_user


def test_update_user_preferences_invalid_input():
    # Pydantic handles this, so testing FastAPI's response to invalid schema
    preferences_data = {
        "fitness_goal": 123, # Invalid type
    }
    response = client.put("/api/v1/users/preferences", json=preferences_data)

    assert response.status_code == 422 # Unprocessable Entity for Pydantic validation errors
    assert "input should be a valid string" in response.json()["detail"][0]["msg"].lower() # Corrected assertion

def test_update_user_preferences_internal_server_error():
    # Simulate an unexpected error during Supabase operation
    mock_supabase_client._mock_execute_method.side_effect = Exception("Database connection error")

    preferences_data = {
        "fitness_goal": "loseWeight"
    }
    response = client.put("/api/v1/users/preferences", json=preferences_data)

    assert response.status_code == 500
    assert "Failed to update user preferences: An unexpected error occurred." in response.json()["detail"]
    mock_supabase_client._mock_execute_method.assert_called_once()