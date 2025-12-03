import os
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException
from supabase import create_client, Client

# Load environment variables from .env file
load_dotenv()

# Supabase configuration
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Supabase URL and Key must be set in environment variables")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI()

def get_supabase_client():
    return supabase

@app.get("/")
def read_root():
    return {"message": "Welcome to AI Fitness & Meal Planner Backend!"}

@app.get("/health/supabase")
async def check_supabase_connection(db: Client = Depends(get_supabase_client)):
    try:
        # Attempt a simple query to verify connection
        response = await db.from_('users').select('id').limit(1).execute()
        # If no exception, connection is successful. Check for errors in response.
        if response.data is not None:
            return {"message": "Supabase connection successful!"}
        else:
            raise HTTPException(status_code=500, detail=f"Supabase query failed: {response.error.message}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not connect to Supabase: {e}")