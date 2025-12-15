from pydantic import BaseModel
import datetime

class NotificationBase(BaseModel):
    message: str
    link: str

class NotificationCreate(NotificationBase):
    pass

class NotificationUpdate(BaseModel):
    read: bool

class Notification(NotificationBase):
    id: int
    user_id: str
    read: bool
    created_at: datetime.datetime

    class Config:
        orm_mode = True
