import os
from dotenv import load_dotenv
from fastapi import Depends, HTTPException, status
from supabase import create_client, Client
from typing import Dict, Any

# Load environment variables from .env file (for local development)
load_dotenv()

# Supabase configuration
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Supabase URL and Key must be set in environment variables")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_supabase_client() -> Client:
    return supabase

# Placeholder for current user dependency - will be replaced with actual JWT verification
def get_current_user():
    # In a real application, this would parse a JWT and return the user's ID
    # For now, we'll return a static user ID for simulation purposes
    return {"id": "mock_user_id_from_jwt", "email": "user@example.com"}

# Dependency to get the Supabase client for FastAPI endpoints
async def get_db():
    return get_supabase_client()
