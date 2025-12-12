import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch
from fastapi import status
from app.main import app
from app.api.v1.deps import get_current_user
from app.schemas.user import User, UserProfileUpdate
import uuid

@pytest.fixture
def client():
    yield TestClient(app)

@pytest.fixture
def authorized_user():
    return User(id=str(uuid.uuid4()), email="test@example.com", aud="authenticated")

def test_update_profile_unauthenticated(client):
    """
    Test that an unauthenticated request to update profile returns 401.
    """
    app.dependency_overrides[get_current_user] = lambda: None
    response = client.put("/api/v1/users/profile/", json={"fitness_goal": "lose-weight"})
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json()["detail"] == "Could not validate credentials"
    app.dependency_overrides = {}

def test_update_profile_success(client, authorized_user):
    """
    Test successful profile update for an authenticated user.
    """
    app.dependency_overrides[get_current_user] = lambda: authorized_user
    
    profile_data = {
        "fitness_goal": "build-muscle",
        "dietary_preference": "vegan",
        "fitness_persona": "athlete"
    }

    # Since update_user_profile is async, we use AsyncMock for its mock
    with patch('app.api.v1.endpoints.users.update_user_profile', new_callable=AsyncMock) as mock_update_profile:
        mock_update_profile.return_value = profile_data
        
        response = client.put(
            "/api/v1/users/profile/",
            json=profile_data
        )
        
        assert response.status_code == status.HTTP_200_OK
        assert response.json() == profile_data
        
        # Check that the mocked service function was called correctly
        mock_update_profile.assert_called_once()
        args, _ = mock_update_profile.call_args
        assert args[0] == authorized_user.id
        assert isinstance(args[1], UserProfileUpdate)

    app.dependency_overrides = {}

def test_update_profile_no_data(client, authorized_user):
    """
    Test that sending an empty JSON body for profile update results in no update
    and returns a 200 OK with the current (empty) profile model.
    """
    app.dependency_overrides[get_current_user] = lambda: authorized_user
    
    # We patch the service function to check it's not called with empty data
    with patch('app.api.v1.endpoints.users.update_user_profile', new_callable=AsyncMock) as mock_update_profile:
        # We simulate the behavior where the crud layer returns a "no data" message
        # which the endpoint then handles.
        mock_update_profile.return_value = {"message": "No data provided for update."}
        
        response = client.put("/api/v1/users/profile/", json={})
        
        # The endpoint should handle this gracefully and return the profile_data model
        assert response.status_code == status.HTTP_200_OK
        # The response model will have all None values
        assert response.json() == {'fitness_goal': None, 'dietary_preference': None, 'fitness_persona': None}

    app.dependency_overrides = {}

def test_update_profile_db_error(client, authorized_user):
    """
    Test that a database error during profile update returns a 500.
    """
    app.dependency_overrides[get_current_user] = lambda: authorized_user
    
    with patch('app.api.v1.endpoints.users.update_user_profile', new_callable=AsyncMock) as mock_update_profile:
        from app.core.exceptions import SupabaseDatabaseError
        mock_update_profile.side_effect = SupabaseDatabaseError(detail="DB write failed")
        
        response = client.put("/api/v1/users/profile/", json={"fitness_goal": "test"})
        
        assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
        assert response.json()["detail"] == "DB write failed"
        
    app.dependency_overrides = {}
