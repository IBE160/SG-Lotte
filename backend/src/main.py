from fastapi import FastAPI, HTTPException
from supabase_client import supabase # Import the Supabase client
from app.api.v1.endpoints import users, onboarding # Import the new onboarding router

app = FastAPI()

# Include API routers
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(onboarding.router, prefix="/api/v1/onboarding", tags=["onboarding"])


@app.get("/")
async def read_root():
    return {"message": "Welcome to the FastAPI Backend!"}

# Example of how to use the Supabase client (you can expand on this later)
@app.get("/users")
async def get_all_users():
    try:
        response = supabase.table('users').select("*").execute()
        return {"data": response.data}
    except Exception as e:
        return {"error": str(e)}
