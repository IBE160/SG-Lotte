from uuid import UUID
from datetime import datetime, timedelta
from supabase import Client
from fastapi import Depends # Import Depends
from app.schemas.meal import MealLogRequest, MealLogResponse
from app.core.exceptions import SupabaseDatabaseError
from app.core.supabase import get_supabase_client # Import get_supabase_client

class CRUDMealLog:
    def __init__(self, client: Client):
        self.client = client

    async def get_meal_logs_last_7_days(self, user_id: UUID) -> list[MealLogResponse]:
        try:
            # Calculate the timestamp for 7 days ago
            seven_days_ago = datetime.utcnow() - timedelta(days=7)
            
            # Fetch meal logs from the last 7 days for the given user
            response = self.client.from_("meal_logs").select("*").eq("user_id", str(user_id)).gte("created_at", seven_days_ago.isoformat()).execute()

            # Check for errors in the response
            if response.data is None:
                raise SupabaseDatabaseError(f"Failed to fetch meal logs. Supabase response: {response}")

            # Validate and return using the response schema
            return [MealLogResponse.model_validate(log) for log in response.data]

        except Exception as e:
            raise SupabaseDatabaseError(f"Error fetching meal logs: {e}")

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

# Dependency
async def get_crud_meal_log(supabase: Client = Depends(get_supabase_client)) -> CRUDMealLog:
    return CRUDMealLog(client=supabase)

# Instantiate CRUDMealLog for convenience (this line is no longer strictly necessary with dependency injection)
# crud_meal_log = CRUDMealLog(client=None) # Client will be set via dependency injection
