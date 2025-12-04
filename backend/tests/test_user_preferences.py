import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, AsyncMock
import pytest
from fastapi import Depends

from app.main import app
from app.core.dependencies import get_db, get_current_user
from supabase import Client

# Create a TestClient for your FastAPI application
client = TestClient(app)

# Mock Supabase client for testing
@pytest.fixture
def mock_supabase_client():
    return MagicMock(spec=Client)

# Override the dependency for testing
@pytest.fixture
def override_get_db_dependency(mock_supabase_client):
    mock_from = MagicMock()
    mock_supabase_client.from_.return_value = mock_from

    mock_update = MagicMock()
    mock_from.update.return_value = mock_update

    mock_eq = MagicMock()
    mock_update.eq.return_value = mock_eq

    # This is the object that will be awaited
    mock_execute = AsyncMock()
    mock_eq.execute = mock_execute

    yield mock_supabase_client # Yield the fully configured mock client

# Override the get_current_user dependency for testing
@pytest.fixture
def override_get_current_user_dependency():
    return {"id": "mock_user_id_from_jwt", "email": "test@example.com"}

@pytest.fixture(autouse=True)
def override_dependencies(override_get_db_dependency, override_get_current_user_dependency):
    app.dependency_overrides[get_db] = lambda: override_get_db_dependency
    app.dependency_overrides[get_current_user] = lambda: override_get_current_user_dependency
    yield
    app.dependency_overrides = {} # Clear overrides after test

def test_update_user_preferences_success(mock_supabase_client):
    preferences_payload = {
        "fitness_goal": "Lose Weight",
        "dietary_preferences": ["Vegetarian"],
        "fitness_persona": "Beginner"
    }

    # Configure the mock chain for this specific test
    mock_response_success = MagicMock(data=[{"id": "mock_user_id_from_jwt", "fitness_goal": "Lose Weight"}], error=None)
    mock_supabase_client.from_.return_value.update.return_value.eq.return_value.execute = AsyncMock(return_value=mock_response_success)
    
    response = client.put("/api/v1/users/preferences", json=preferences_payload)

    assert response.status_code == 200
    assert response.json() == {"message": "User preferences updated successfully."}
    
    mock_supabase_client.from_.assert_called_once_with('user_profiles')
    mock_supabase_client.from_().update.assert_called_once_with(preferences_payload)
    mock_supabase_client.from_().update().eq.assert_called_once_with('user_id', 'mock_user_id_from_jwt')
    mock_supabase_client.from_().update().eq().execute.assert_called_once()

def test_update_user_preferences_invalid_input():
    # Missing required field or invalid type for pydantic validation
    invalid_payload = {
        "fitness_goal": 123, # Should be string
        "dietary_preferences": "not a list", # Should be list
    }
    response = client.put("/api/v1/users/preferences", json=invalid_payload)
    assert response.status_code == 422 # Unprocessable Entity for validation errors
    assert "detail" in response.json()

def test_update_user_preferences_no_data_found(mock_supabase_client):
    # Simulate Supabase returning no data (e.g., user_id not found)
    mock_response_empty = MagicMock(data=[], error=None)
    mock_supabase_client.from_.return_value.update.return_value.eq.return_value.execute = AsyncMock(return_value=mock_response_empty)
    
    preferences_payload = {
        "fitness_goal": "Lose Weight",
    }
    response = client.put("/api/v1/users/preferences", json=preferences_payload)
    
    assert response.status_code == 404
    assert response.json() == {"detail": "User profile not found or no changes made."}

@pytest.mark.asyncio
async def test_update_user_preferences_supabase_error(mock_supabase_client):
    # Simulate a Supabase error during update
    mock_supabase_client.from_.return_value.update.return_value.eq.return_value.execute = AsyncMock(side_effect=Exception("Supabase connection error"))
    
    preferences_payload = {
        "fitness_goal": "Lose Weight",
    }
    response = client.put("/api/v1/users/preferences", json=preferences_payload)
    
    assert response.status_code == 500
    assert "Failed to update user preferences" in response.json()["detail"]
