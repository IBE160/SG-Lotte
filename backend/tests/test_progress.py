import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from fastapi import status
from app.main import app
from app.api.v1.deps import get_current_user, get_supabase_client
from app.schemas.user import User
from datetime import date

@pytest.fixture
def client():
    yield TestClient(app)

@pytest.fixture
def authorized_user():
    return User(id="test_user_id", email="test@example.com", aud="authenticated")

@pytest.fixture
def mock_supabase_client():
    with patch('app.api.v1.deps.get_supabase_client') as mock_get_client:
        mock_client = MagicMock()
        mock_get_client.return_value = mock_client
        yield mock_client

@pytest.fixture
def mock_progress_data_service():
    with patch('app.api.v1.endpoints.progress.ProgressDataService') as mock_service_class:
        mock_instance = MagicMock()
        mock_service_class.return_value = mock_instance
        yield mock_instance

def test_get_progress_unauthenticated(client):
    """
    Test that an unauthenticated request to get progress returns 401.
    """
    app.dependency_overrides[get_current_user] = lambda: None
    response = client.get("/api/v1/progress")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json()["detail"] == "Could not validate credentials"
    app.dependency_overrides = {}

def test_get_progress_success(client, authorized_user, mock_progress_data_service, mock_supabase_client):
    """
    Test successful retrieval of progress data for an authenticated user.
    """
    app.dependency_overrides[get_current_user] = lambda: authorized_user
    app.dependency_overrides[get_supabase_client] = lambda: mock_supabase_client

    mock_progress_data_service.get_progress_data.return_value = {
        "workout_streak": 5,
        "weight_trend": [
            [date(2025, 11, 1).isoformat(), 70.5],
            [date(2025, 11, 2).isoformat(), 70.2],
        ]
    }

    response = client.get("/api/v1/progress")
    
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {
        "workout_streak": 5,
        "weight_trend": [
            [date(2025, 11, 1).isoformat(), 70.5],
            [date(2025, 11, 2).isoformat(), 70.2],
        ]
    }
    mock_progress_data_service.get_progress_data.assert_called_once_with(authorized_user.id)

    app.dependency_overrides = {}

def test_get_progress_no_data(client, authorized_user, mock_progress_data_service, mock_supabase_client):
    """
    Test retrieval of progress data when no data is available.
    """
    app.dependency_overrides[get_current_user] = lambda: authorized_user
    app.dependency_overrides[get_supabase_client] = lambda: mock_supabase_client

    mock_progress_data_service.get_progress_data.return_value = {
        "workout_streak": 0,
        "weight_trend": []
    }

    response = client.get("/api/v1/progress")
    
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {
        "workout_streak": 0,
        "weight_trend": []
    }
    mock_progress_data_service.get_progress_data.assert_called_once_with(authorized_user.id)

    app.dependency_overrides = {}
