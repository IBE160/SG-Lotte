from typing import List
from uuid import UUID
from supabase import Client
from fastapi import Depends
from app.schemas.notification import NotificationCreate, Notification
from app.core.exceptions import SupabaseDatabaseError
from app.core.supabase import get_supabase_client
import logging

logger = logging.getLogger(__name__)

class CRUDNotification:
    def __init__(self, client: Client):
        self.client = client

    def create_notification(self, user_id: UUID, notification: NotificationCreate) -> Notification:
        try:
            insert_data = {
                "user_id": str(user_id),
                "title": notification.title,
                "message": notification.message,
                "link": notification.link,
                "is_read": False,
            }
            logger.info(f"Inserting notification: {insert_data}")
            response = self.client.from_("notifications").insert(insert_data).execute()

            if response.data is None or not response.data:
                logger.error(f"Failed to create notification. Supabase response: {response}")
                raise SupabaseDatabaseError(f"Failed to create notification. Supabase response: {response}")

            created_notification_data = response.data[0]
            logger.info(f"Successfully inserted notification, returned data: {created_notification_data}")
            return Notification.model_validate(created_notification_data)
        except Exception as e:
            logger.error(f"Error creating notification: {e}", exc_info=True)
            raise SupabaseDatabaseError(f"Error creating notification: {e}")

    def get_notifications_by_user(self, user_id: UUID) -> List[Notification]:
        try:
            response = self.client.from_("notifications").select("*").eq("user_id", str(user_id)).execute()

            if response.data is None:
                raise SupabaseDatabaseError(f"Failed to fetch notifications. Supabase response: {response}")

            return [Notification.model_validate(notification) for notification in response.data]
        except Exception as e:
            raise SupabaseDatabaseError(f"Error fetching notifications: {e}")

    def get_unread_notifications_by_user(self, user_id: UUID) -> List[Notification]:
        try:
            response = self.client.from_("notifications").select("*").eq("user_id", str(user_id)).eq("is_read", False).execute()

            if response.data is None:
                raise SupabaseDatabaseError(f"Failed to fetch unread notifications. Supabase response: {response}")

            return [Notification.model_validate(notification) for notification in response.data]
        except Exception as e:
            raise SupabaseDatabaseError(f"Error fetching unread notifications: {e}")

    def mark_notification_as_read(self, notification_id: int, user_id: UUID) -> Notification | None:
        try:
            logger.info(f"Marking notification as read: notification_id={notification_id}, user_id={user_id}")
            response = self.client.from_("notifications").update({"is_read": True}).eq("id", notification_id).eq("user_id", str(user_id)).execute()

            if response.data is None or not response.data:
                logger.warning(f"No notification found to mark as read for id: {notification_id} and user_id: {user_id}")
                return None

            updated_notification_data = response.data[0]
            logger.info(f"Successfully marked notification as read. Affected rows: {updated_notification_data}")
            return Notification.model_validate(updated_notification_data)
        except Exception as e:
            logger.error(f"Error marking notification as read: {e}", exc_info=True)
            raise SupabaseDatabaseError(f"Error marking notification as read: {e}")

def get_crud_notification(supabase: Client = Depends(get_supabase_client)) -> CRUDNotification:
    return CRUDNotification(client=supabase)