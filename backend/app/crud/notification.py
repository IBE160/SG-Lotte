from typing import List
from uuid import UUID
from supabase import Client
from fastapi import Depends
from app.schemas.notification import NotificationCreate, Notification
from app.core.exceptions import SupabaseDatabaseError
from app.core.supabase import get_supabase_client

class CRUDNotification:
    def __init__(self, client: Client):
        self.client = client

    async def create_notification(self, user_id: UUID, notification: NotificationCreate) -> Notification:
        try:
            insert_data = {
                "user_id": str(user_id),
                "message": notification.message,
                "link": notification.link,
            }
            response = self.client.from_("notifications").insert(insert_data).execute()

            if response.data is None or not response.data:
                raise SupabaseDatabaseError(f"Failed to create notification. Supabase response: {response}")

            created_notification_data = response.data[0]
            return Notification.model_validate(created_notification_data)
        except Exception as e:
            raise SupabaseDatabaseError(f"Error creating notification: {e}")

    async def get_notifications_by_user(self, user_id: UUID) -> List[Notification]:
        try:
            response = self.client.from_("notifications").select("*").eq("user_id", str(user_id)).execute()

            if response.data is None:
                raise SupabaseDatabaseError(f"Failed to fetch notifications. Supabase response: {response}")

            return [Notification.model_validate(notification) for notification in response.data]
        except Exception as e:
            raise SupabaseDatabaseError(f"Error fetching notifications: {e}")

    async def get_unread_notifications_by_user(self, user_id: UUID) -> List[Notification]:
        try:
            response = self.client.from_("notifications").select("*").eq("user_id", str(user_id)).eq("read", False).execute()

            if response.data is None:
                raise SupabaseDatabaseError(f"Failed to fetch unread notifications. Supabase response: {response}")

            return [Notification.model_validate(notification) for notification in response.data]
        except Exception as e:
            raise SupabaseDatabaseError(f"Error fetching unread notifications: {e}")

    async def mark_notification_as_read(self, notification_id: int) -> Notification:
        try:
            response = self.client.from_("notifications").update({"read": True}).eq("id", notification_id).execute()

            if response.data is None or not response.data:
                raise SupabaseDatabaseError(f"Failed to mark notification as read. Supabase response: {response}")

            updated_notification_data = response.data[0]
            return Notification.model_validate(updated_notification_data)
        except Exception as e:
            raise SupabaseDatabaseError(f"Error marking notification as read: {e}")

async def get_crud_notification(supabase: Client = Depends(get_supabase_client)) -> CRUDNotification:
    return CRUDNotification(client=supabase)