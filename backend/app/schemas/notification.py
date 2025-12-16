from pydantic import BaseModel, Field
from typing import Optional
import datetime

class NotificationBase(BaseModel):
    title: str
    message: str
    link: Optional[str] = None

class NotificationCreate(NotificationBase):
    pass

class Notification(NotificationBase):
    id: int
    user_id: str
    created_at: datetime.datetime
    is_read: bool = Field(default=False)

    class Config:
        from_attributes = True
