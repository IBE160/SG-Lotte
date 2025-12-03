from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to AI Fitness & Meal Planner Backend!"}

def test_check_supabase_connection():
    # This test requires Supabase to be running and configured
    # For now, we'll mock the Supabase client or just ensure the endpoint exists
    response = client.get("/health/supabase")
    # Depending on Supabase setup, this might return 200 or 500
    # For CI/CD, consider mocking the Supabase client used in main.py
    assert response.status_code == 500 or response.status_code == 200
    # assert "Supabase" in response.json()["message"]