from fastapi import APIRouter, Depends, HTTPException, status
from supabase import Client
from app.api.v1.deps import get_current_user, get_supabase_client
from app.schemas.progress import ProgressResponse
from app.services.progress_data_service import ProgressDataService
from app.schemas.user import User 

router = APIRouter()

@router.get("/progress", response_model=ProgressResponse)
async def get_user_progress(
    current_user: User = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client)
):
    """
    Retrieve the authenticated user's progress data, including workout streak and weight trend.
    """
    if not current_user or not current_user.id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )
    
    progress_service = ProgressDataService(supabase)
    progress_data = progress_service.get_progress_data(current_user.id)
    
    return ProgressResponse(**progress_data)
