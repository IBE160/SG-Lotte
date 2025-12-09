import pytest
from httpx import AsyncClient
from backend.src.main import app
from unittest.mock import patch, MagicMock
from uuid import UUID, uuid4
from datetime import date, timedelta
import json

# Fixture for a dummy user ID
@pytest.fixture
def dummy_user_id():
    return uuid4()

# Fixture to mock the get_current_user_id dependency
@pytest.fixture(autouse=True)
def mock_get_current_user_id(dummy_user_id):
    with patch('backend.src.app.api.v1.endpoints.plans.get_current_user_id', return_value=dummy_user_id):
        yield

# Fixture to mock the AIPlanGenerator
@pytest.fixture(autouse=True)
def mock_ai_plan_generator():
    with patch('backend.src.app.api.v1.endpoints.plans.AIPlanGenerator') as MockGenerator:
        instance = MockGenerator.return_value
        instance.generate_plan.return_value = {
            "workout_plan": {
                "days": [{"day": "Monday", "focus": "Cardio", "exercises": []}]
            },
            "meal_plan": {
                "days": [{"day": "Monday", "meals": []}]
            }
        }
        yield instance

# Fixture to mock the PlanCRUD operations
@pytest.fixture(autouse=True)
def mock_plan_crud():
    with patch('backend.src.app.api.v1.endpoints.plans.PlanCRUD') as MockCRUD:
        instance = MockCRUD.return_value
        instance.create_workout_plan.return_value = {"id": str(uuid4()), "user_id": str(uuid4()), "plan_data": "{}"}
        instance.create_meal_plan.return_value = {"id": str(uuid4()), "user_id": str(uuid4()), "plan_data": "{}"}
        instance.get_current_workout_plan.return_value = None
        instance.get_current_meal_plan.return_value = None
        yield instance

@pytest.mark.asyncio
async def test_generate_plan_success(mock_ai_plan_generator, mock_plan_crud, dummy_user_id):
    """
    Test successful plan generation via POST /api/v1/plans/generate.
    """
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/api/v1/plans/generate")

    assert response.status_code == 201
    assert "message" in response.json()
    assert "workout_plan_id" in response.json()
    assert "meal_plan_id" in response.json()
    
    mock_ai_plan_generator.generate_plan.assert_called_once()
    mock_plan_crud.create_workout_plan.assert_called_once()
    mock_plan_crud.create_meal_plan.assert_called_once()


@pytest.mark.asyncio
async def test_generate_plan_ai_error(mock_ai_plan_generator, mock_plan_crud):
    """
    Test plan generation when AIPlanGenerator raises an exception.
    """
    mock_ai_plan_generator.generate_plan.side_effect = Exception("AI failure")

    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/api/v1/plans/generate")

    assert response.status_code == 500
    assert "detail" in response.json()
    assert "Failed to generate plan" in response.json()["detail"]
    mock_ai_plan_generator.generate_plan.assert_called_once()
    mock_plan_crud.create_workout_plan.assert_not_called()
    mock_plan_crud.create_meal_plan.assert_not_called()

@pytest.mark.asyncio
async def test_generate_plan_db_error(mock_ai_plan_generator, mock_plan_crud):
    """
    Test plan generation when PlanCRUD.create_workout_plan raises an exception.
    """
    mock_plan_crud.create_workout_plan.side_effect = Exception("DB write error")

    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/api/v1/plans/generate")

    assert response.status_code == 500
    assert "detail" in response.json()
    assert "Failed to store plan in database" in response.json()["detail"]
    mock_ai_plan_generator.generate_plan.assert_called_once()
    mock_plan_crud.create_workout_plan.assert_called_once()
    mock_plan_crud.create_meal_plan.assert_not_called() # Should not be called if workout plan creation fails

@pytest.mark.asyncio
async def test_get_current_plan_no_plan(mock_plan_crud, dummy_user_id):
    """
    Test retrieving current plan when no plan is found for the user.
    """
    mock_plan_crud.get_current_workout_plan.return_value = None
    mock_plan_crud.get_current_meal_plan.return_value = None

    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/api/v1/plans/current")

    assert response.status_code == 404
    assert "detail" in response.json()
    assert "No current plan found for the user." in response.json()["detail"]
    mock_plan_crud.get_current_workout_plan.assert_called_once()
    mock_plan_crud.get_current_meal_plan.assert_called_once()

@pytest.mark.asyncio
async def test_get_current_plan_success(mock_plan_crud, dummy_user_id):
    """
    Test successful retrieval of current workout and meal plans.
    """
    workout_plan_data = {
        "id": str(uuid4()),
        "user_id": str(dummy_user_id),
        "plan_start_date": (date.today() - timedelta(days=1)).isoformat(),
        "plan_end_date": (date.today() + timedelta(days=5)).isoformat(),
        "plan_data": json.dumps({"days": [{"day": "Tuesday", "focus": "Strength", "exercises": []}]})
    }
    meal_plan_data = {
        "id": str(uuid4()),
        "user_id": str(dummy_user_id),
        "plan_start_date": (date.today() - timedelta(days=1)).isoformat(),
        "plan_end_date": (date.today() + timedelta(days=5)).isoformat(),
        "plan_data": json.dumps({"days": [{"day": "Tuesday", "meals": []}]})
    }
    
    mock_plan_crud.get_current_workout_plan.return_value = workout_plan_data
    mock_plan_crud.get_current_meal_plan.return_value = meal_plan_data

    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/api/v1/plans/current")

    assert response.status_code == 200
    assert "workout_plan" in response.json()
    assert "meal_plan" in response.json()
    assert response.json()["workout_plan"]["days"][0]["day"] == "Tuesday"
    assert response.json()["meal_plan"]["days"][0]["day"] == "Tuesday"
    mock_plan_crud.get_current_workout_plan.assert_called_once()
    mock_plan_crud.get_current_meal_plan.assert_called_once()
