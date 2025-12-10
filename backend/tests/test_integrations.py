import pytest
from app.core.config import settings
from supabase import create_client, Client
from app.services.ai_plan_generator import get_ai_plan, FullPlan

def test_supabase_client_creation():
    """
    Tests that the Supabase client can be created.
    This requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to be in the .env file.
    """
    assert settings.SUPABASE_URL, "SUPABASE_URL not found in .env"
    assert settings.SUPABASE_SERVICE_ROLE_KEY, "SUPABASE_SERVICE_ROLE_KEY not found in .env"
    
    supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
    assert isinstance(supabase, Client)

def test_ai_plan_generator_placeholder():
    """
    Tests the placeholder AI plan generator.
    """
    plan = get_ai_plan("test preferences")
    assert isinstance(plan, FullPlan)
    assert len(plan.workout_plan) == 7
    assert len(plan.meal_plan) == 7
