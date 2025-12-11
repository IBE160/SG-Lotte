import pytest
from httpx import AsyncClient
from unittest.mock import AsyncMock, patch
from app.main import app
from app.schemas.user import UserProfileUpdate

# Mock Supabase client
@pytest.fixture
def mock_supabase_client():
    with patch("app.crud.user.supabase") as mock_supabase:
        yield mock_supabase

# Mock the get_current_user dependency
@pytest.fixture
def mock_get_current_user():
    with patch("app.api.v1.deps.get_current_user") as mock_dep:
        # Default mock user for authenticated requests
        mock_dep.return_value = AsyncMock(id="test-user-id")
        yield mock_dep

@pytest.mark.asyncio
async def test_update_profile_unauthenticated():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.put(
            "/api/v1/users/profile/",
            json={"fitness_goal": "lose-weight"}
        )
    assert response.status_code == 401
    assert "Invalid authentication token" in response.json()["detail"]

@pytest.mark.asyncio
async def test_update_profile_invalid_payload(mock_get_current_user):
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.put(
            "/api/v1/users/profile/",
            headers={"Authorization": "Bearer fake-jwt"},
            json={"invalid_field": "some_value"} # Invalid field
        )
    assert response.status_code == 422 # Unprocessable Entity for Pydantic validation error
    assert "field required" in response.json()["detail"][0]["msg"]

@pytest.mark.asyncio
async def test_update_profile_success(mock_supabase_client, mock_get_current_user):
    user_id = "test-user-id"
    profile_data = {
        "fitness_goal": "build-muscle",
        "dietary_preference": "vegan",
        "fitness_persona": "athlete"
    }
    
    # Mock the update call to Supabase
    mock_supabase_client.table.return_value.update.return_value.eq.return_value.execute.return_value = AsyncMock(
        data=[{"id": user_id, **profile_data}],
        count=1,
        error=None
    )

    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.put(
            "/api/v1/users/profile/",
            headers={"Authorization": "Bearer valid-jwt"},
            json=profile_data
        )

    assert response.status_code == 200
    assert response.json() == profile_data
    mock_supabase_client.table.return_value.update.assert_called_once_with(
        profile_data
    )
    mock_supabase_client.table.return_value.update.return_value.eq.assert_called_once_with(
        "id", user_id
    )

@pytest.mark.asyncio
async def test_update_profile_no_data_provided(mock_supabase_client, mock_get_current_user):
    user_id = "test-user-id"
    # No data provided for update in the payload
    profile_data = {}

    # Mock the update call to Supabase to return "no data provided" message from crud function
    # The crud function returns {"message": "No data provided for update."} if update_data is empty
    mock_supabase_client.table.return_value.update.return_value.eq.return_value.execute.return_value = AsyncMock(
        data=[], # Assuming an empty data list from Supabase if no update occurred or target not found
        count=0,
        error=None
    )
    # The endpoint now expects the crud function to raise HTTPException if no data provided
    # or if the profile is not found. Let's adjust the test to check for the proper FastAPI behavior.
    
    # When no data is provided, the pydantic model should still pass Optional[str] = None for all fields
    # and the crud function `update_user_profile` handles `exclude_unset=True`.
    # If a valid user is provided but an empty JSON is sent, Pydantic passes it as all Nones.
    # The `update_user_profile` function will then receive an empty `update_data` after `exclude_unset=True`.
    # Currently, `update_user_profile` returns `{"message": "No data provided for update."}` if `update_data` is empty.
    # The endpoint needs to handle this specific return value from crud layer.

    # Re-evaluate: the current crud returns a message if no data. The endpoint converts None to 404.
    # Let's verify what happens when `profile_data.dict(exclude_unset=True)` is empty.
    # The `update_user_profile` function will return `{"message": "No data provided for update."}`
    # The endpoint will then return the original `profile_data` if `updated_profile` is not None.
    # If the `update_user_profile` returns the message, `updated_profile` will be a dict, not None.
    # This means the current implementation will return an empty dict as 200 OK.
    # It might be better for crud to raise an exception or for the endpoint to explicitly check for this.
    
    # For now, let's assume valid empty data means no change, and it should return 200 with empty payload.
    # However, the current endpoint expects profile_data as response_model, which means if nothing is passed, it returns all Nones.
    # If an empty dict is passed as JSON, `profile_data` will be `UserProfileUpdate()`, i.e., all fields are None.
    # `update_user_profile` `profile_data.dict(exclude_unset=True)` will be empty.
    # `update_user_profile` returns `{"message": "No data provided for update."}`
    # `updated_profile` is not `None`.
    # Endpoint returns `profile_data` (which is `UserProfileUpdate(fitness_goal=None, ...)`)
    # The test needs to check for this behavior.

    # Let's simulate the scenario where client sends an empty JSON, which results in all Optional fields being None.
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.put(
            "/api/v1/users/profile/",
            headers={"Authorization": "Bearer valid-jwt"},
            json={} # Empty JSON body -> Pydantic model with all None
        )
    
    # Expectation: the crud function will return {"message": "No data provided for update."}
    # The endpoint currently returns profile_data.dict() if successful.
    # If profile_data is UserProfileUpdate(), it means it's {fitness_goal: None, dietary_preference: None, ...}
    
    # The actual behavior for an empty JSON body (all Nones) should be a successful 200 with all Nones.
    assert response.status_code == 200
    assert response.json() == {"fitness_goal": None, "dietary_preference": None, "fitness_persona": None}
    
    # Ensure update_user_profile was called with the correct user_id and an empty dict for profile_data (after exclude_unset)
    mock_supabase_client.table.return_value.update.assert_called_once_with({})
    mock_supabase_client.table.return_value.update.return_value.eq.assert_called_once_with(
        "id", user_id
    )

