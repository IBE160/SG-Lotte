from fastapi import FastAPI
from .supabase_client import supabase # Import the Supabase client

app = FastAPI()

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