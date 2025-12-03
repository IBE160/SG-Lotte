from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from typing import Dict, Any

# Assuming a dependency for getting a Supabase client if needed
# For now, we'll just simulate interaction as per story context

router = APIRouter()

class UserCreate(BaseModel):
    email: EmailStr
    password: str

@router.post("/signup")
async def signup_user(user: UserCreate) -> Dict[str, str]:
    # In this story, the frontend directly calls Supabase for signup.
    # This backend endpoint is a placeholder as per story task,
    # or could be used for server-side initiated signups.
    # For now, we simulate a successful processing.

    if user.email == "existing@example.com":
        raise HTTPException(status_code=400, detail="User with this email already exists.")
    
    # Simulate a successful sign-up process (e.g., passing to Supabase internally)
    # In a real scenario, you might call a Supabase Admin client here,
    # or this endpoint would be for a different kind of user creation.
    print(f"Backend received signup request for: {user.email}")

    return {"message": "User signup request received and processed."}
