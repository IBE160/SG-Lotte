from uuid import UUID
from postgrest.base_request_builder import BaseRequestBuilder
from supabase import Client
from app.schemas.meal import MealLogRequest, MealLogResponse
from app.core.exceptions import SupabaseDatabaseError

class CRUDMealLog:
    def __init__(self, client: Client):
        self.client = client

    async def create_meal_log(self, user_id: UUID, meal_log: MealLogRequest) -> MealLogResponse:
        try:
            # Prepare data for insertion
            insert_data = {
                "user_id": str(user_id),  # Supabase often expects UUID as string
                "meal_plan_id": meal_log.meal_plan_id,
                "meal_name": meal_log.meal_name,
                "status": meal_log.status,
            }
            
            # Insert into meal_logs table and return the created row
            # Use execute() for more control if needed, but select() works for returning data
            response = self.client.from_("meal_logs").insert(insert_data).execute()

            # Check for errors in the response
            if response.data is None or not response.data:
                raise SupabaseDatabaseError(f"Failed to create meal log. Supabase response: {response}")

            # Supabase insert returns a list of inserted objects
            created_log_data = response.data[0]
            
            # Validate and return using the response schema
            return MealLogResponse.model_validate(created_log_data)

        except Exception as e:
            raise SupabaseDatabaseError(f"Error creating meal log: {e}")

# Instantiate CRUDMealLog for convenience
crud_meal_log = CRUDMealLog(client=None) # Client will be set via dependency injection
