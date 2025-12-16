import logging
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from uuid import UUID
from app.schemas.notification import Notification
from app.schemas.user import User
from app.api.v1.deps import get_current_user
from app.crud.notification import CRUDNotification, get_crud_notification

router = APIRouter()
logger = logging.getLogger("app.api.v1.notifications")

@router.get("/", response_model=List[Notification])
def get_notifications(
    current_user: User = Depends(get_current_user),
    crud_notification: CRUDNotification = Depends(get_crud_notification),
):
    if not current_user or not current_user.id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate user ID.",
        )
    return crud_notification.get_notifications_by_user(user_id=UUID(current_user.id))

@router.get("/unread", response_model=List[Notification])
def get_unread_notifications(
    current_user: User = Depends(get_current_user),
    crud_notification: CRUDNotification = Depends(get_crud_notification),
):
    if not current_user or not current_user.id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate user ID.",
        )
    
    user_id = UUID(current_user.id)
    unread_notifications = crud_notification.get_unread_notifications_by_user(user_id=user_id)
    # The CRUD layer now handles logging of the response
    
    return unread_notifications

@router.put("/{notification_id}/read", response_model=Notification)
def mark_as_read(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    crud_notification: CRUDNotification = Depends(get_crud_notification),
):
    if not current_user or not current_user.id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate user ID.",
        )
    
    user_id = UUID(current_user.id)
    # The CRUD layer now handles logging
    
    updated_notification = crud_notification.mark_notification_as_read(
        notification_id=notification_id, user_id=user_id
    )

    if updated_notification is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found or user does not have permission.",
        )
    
    return updated_notification
