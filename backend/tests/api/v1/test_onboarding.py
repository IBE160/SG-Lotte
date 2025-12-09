import pytest
import httpx
from httpx import AsyncClient
from uuid import uuid4, UUID
from unittest.mock import AsyncMock

from main import app
from app.api.v1.endpoints.onboarding import get_current_user_id
from app.services.user_profile_service import UserProfileService
from app.schemas.user_preferences import UserPreferences

# --- Mock Dependencies ---

TEST_USER_ID = uuid4()

async def override_get_current_user_id() -> UUID:
    """Override for get_current_user_id that returns a fixed user ID."""
    return TEST_USER_ID

# Create a mock for the UserProfileService
mock_user_profile_service = AsyncMock(spec=UserProfileService)

async def override_user_profile_service() -> AsyncMock:
    """Override for UserProfileService that returns a shared mock instance."""
    return mock_user_profile_service

# Apply the dependency overrides to the app
app.dependency_overrides[get_current_user_id] = override_get_current_user_id
app.dependency_overrides[UserProfileService] = override_user_profile_service


# --- Fixtures ---

@pytest.fixture(autouse=True)
def reset_mocks():
    """Reset mocks before each test."""
    mock_user_profile_service.reset_mock()

@pytest.fixture
async def client():
    """A client to make requests to the app."""
    async with AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as ac:
        yield ac


# --- Tests ---

@pytest.mark.asyncio
async def test_save_onboarding_preferences_success(client: AsyncClient):
    # Arrange
    mock_user_profile_service.update_user_preferences.return_value = {
        "id": str(TEST_USER_ID),
        "fitnessGoal": "lose_weight"
    }
    preferences_data = {
        "fitnessGoal": "lose_weight",
        "dietaryPreferences": ["vegan", "gluten_free"],
        "fitnessPersona": "intermediate"
    }

    # Act
    response = await client.post(
        "/api/v1/onboarding/preferences",
        headers={"Authorization": "Bearer fake-token"},
        json=preferences_data
    )

    # Assert
    assert response.status_code == 200
    response_json = response.json()
    assert response_json["message"] == "Preferences saved successfully"
    assert response_json["user_id"] == str(TEST_USER_ID)
    
    # Check that the service method was called correctly
    mock_user_profile_service.update_user_preferences.assert_called_once()
    call_args = mock_user_profile_service.update_user_preferences.call_args[0]
    assert call_args[0] == TEST_USER_ID
    assert call_args[1].fitnessGoal == preferences_data["fitnessGoal"]


@pytest.mark.asyncio
async def test_save_onboarding_preferences_unauthorized_no_header(client: AsyncClient):
    # Arrange
    # Temporarily remove the override to test the actual dependency
    app.dependency_overrides = {}

    # Act
    response = await client.post(
        "/api/v1/onboarding/preferences",
        json={"fitnessGoal": "lose_weight", "dietaryPreferences": [], "fitnessPersona": "beginner"}
    )

    # Assert
    assert response.status_code == 401
    assert response.json()["detail"] == "Authorization header missing"

    # Restore overrides
    app.dependency_overrides[get_current_user_id] = override_get_current_user_id
    app.dependency_overrides[UserProfileService] = override_user_profile_service


@pytest.mark.asyncio
async def test_save_onboarding_preferences_validation_error(client: AsyncClient):
    # Act
    response = await client.post(
        "/api/v1/onboarding/preferences",
        headers={"Authorization": "Bearer fake-token"},
        json={"fitnessGoal": "lose_weight", "dietaryPreferences": "not-a-list", "fitnessPersona": "beginner"}
    )
    
    # Assert
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_save_onboarding_preferences_database_error(client: AsyncClient):
    # Arrange
    mock_user_profile_service.update_user_preferences.side_effect = Exception("Database connection error")

    # Act
    response = await client.post(
        "/api/v1/onboarding/preferences",
        headers={"Authorization": "Bearer fake-token"},
        json={"fitnessGoal": "lose_weight", "dietaryPreferences": [], "fitnessPersona": "beginner"}
    )

    # Assert
    assert response.status_code == 500
    assert "Database connection error" in response.json()["detail"]
