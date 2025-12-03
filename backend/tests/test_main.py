import os
import subprocess
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to AI Fitness & Meal Planner Backend!"}

def test_check_supabase_connection():
    # This test will only pass if SUPABASE_URL and SUPABASE_KEY are correctly set
    # and the Supabase database is accessible and has a 'users' table.
    # For CI/CD, consider mocking the Supabase client.
    response = client.get("/health/supabase")
    assert response.status_code == 200
    assert "Supabase connection successful!" in response.json().get("message")

def test_alembic_configuration():
    # Change to backend directory to run alembic commands
    original_cwd = os.getcwd()
    os.chdir('backend')
    try:
        # Run 'alembic current' to check if Alembic is configured and executable
        # This will fail if alembic.ini or env.py are misconfigured
        result = subprocess.run(
            ['python', '-m', 'alembic', 'current'],
            capture_output=True, text=True, check=True
        )
        assert "No migrations found" in result.stdout or "Head is" in result.stdout
        assert result.returncode == 0
    except subprocess.CalledProcessError as e:
        print(f"Alembic command failed: {e}")
        print(f"Stdout: {e.stdout}")
        print(f"Stderr: {e.stderr}")
        assert False, f"Alembic command failed: {e.stderr}"
    finally:
        os.chdir(original_cwd)
