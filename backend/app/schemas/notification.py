from pydantic import BaseModel
import datetime

class NotificationBase(BaseModel):
    title: str
    message: str

class NotificationCreate(NotificationBase):
    pass

class Notification(NotificationBase):
    id: int
    user_id: str
    created_at: datetime.datetime

    class Config:
        orm_mode = True
