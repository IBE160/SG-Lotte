from uuid import UUID
from typing import Dict, Any

from supabase import Client
from supabase_client import supabase
from app.schemas.user_preferences import UserProfileUpdate

class UserProfileService:
    def __init__(self):
        self.supabase_client: Client = supabase

    async def update_user_preferences(self, user_id: UUID, preferences: UserProfileUpdate) -> Dict[str, Any]:
        update_data = preferences.model_dump(exclude_unset=True)
        
        # Supabase update example, assuming direct columns in the 'users' table
        # If dietary_preferences is jsonb, Supabase can merge it directly
        response = await self.supabase_client.table('users').update(update_data).eq('id', str(user_id)).execute()
        
        # Check for errors in the Supabase response
        if response.data and isinstance(response.data, list) and len(response.data) > 0:
            return response.data[0]
        else:
            # Handle cases where update might not return data or has errors
            # Supabase client's execute() method typically raises an exception on error
            # so this else branch might only be hit if data is empty for successful updates
            if response.error:
                raise Exception(f"Supabase update error: {response.error.message}")
            elif not response.data:
                raise Exception("Supabase update returned no data, user might not exist or no changes were made.")
            else:
                return {} # Successfully updated, but no data returned (e.g., if upsert: false)
