import os
import logging
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException
from supabase import create_client, Client

from app.api.v1.endpoints import users

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Load environment variables from .env file
load_dotenv()

# Supabase configuration
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Supabase URL and Key must be set in environment variables")

from fastapi.middleware.cors import CORSMiddleware

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",  # Allow your Next.js frontend
    "http://127.0.0.1",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_supabase_client():
    return supabase

app.include_router(users.router, prefix="/api/v1", tags=["users"]) # NEW: Include users router

@app.get("/")
def read_root():
    return {"message": "Welcome to AI Fitness & Meal Planner Backend!"}

@app.get("/health/supabase")
def check_supabase_connection(db: Client = Depends(get_supabase_client)):
    try:
        # Attempt a simple query to verify connection
        response = db.from_('users').select('id').limit(1).execute()
        # If no exception, connection is successful. Check for errors in response.
        if response.data is not None:
            return {"message": "Supabase connection successful!"}
        else:
            raise HTTPException(status_code=500, detail=f"Supabase query failed: {response.error.message if response.error else 'Unknown error'}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not connect to Supabase: {e}")