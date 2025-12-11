from fastapi import Header, HTTPException, Depends
from supabase import Client
from app.core.supabase import get_supabase_client

async def get_current_user(
    authorization: str = Header(...),
    supabase: Client = Depends(get_supabase_client)
):
    try:
        # Extract JWT from "Bearer <token>"
        token = authorization.split(" ")[1]
        user_response = supabase.auth.get_user(token)
        user = user_response.user
        
        if not user:
            raise HTTPException(status_code=401, detail="Could not validate credentials")
        
        return user
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid authentication token: {e}")
