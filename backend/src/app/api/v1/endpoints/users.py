from fastapi import APIRouter

router = APIRouter()

# Placeholder for future user-related endpoints
@router.get("/")
async def read_users_root():
    return {"message": "Users endpoint"}
