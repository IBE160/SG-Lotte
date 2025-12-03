from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_signup_user_success():
    response = client.post(
        "/api/v1/signup",
        json={"email": "newuser@example.com", "password": "password123"},
    )
    assert response.status_code == 200
    assert response.json() == {"message": "User signup request received and processed."}

def test_signup_user_existing_email():
    response = client.post(
        "/api/v1/signup",
        json={"email": "existing@example.com", "password": "password123"},
    )
    assert response.status_code == 400
    assert response.json() == {"detail": "User with this email already exists."}

def test_signup_user_invalid_email():
    response = client.post(
        "/api/v1/signup",
        json={"email": "invalid-email", "password": "password123"},
    )
    assert response.status_code == 422 # Unprocessable Entity for Pydantic validation error

def test_signup_user_missing_password():
    response = client.post(
        "/api/v1/signup",
        json={"email": "test@example.com"},
    )
    assert response.status_code == 422 # Unprocessable Entity for Pydantic validation error
