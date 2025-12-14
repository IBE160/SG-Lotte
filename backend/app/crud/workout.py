from uuid import UUID
from supabase import Client
from fastapi import Depends
from app.api.v1.deps import get_supabase_client
from app.schemas.workout import WorkoutLogRequest, WorkoutLogResponse
from app.core.exceptions import SupabaseDatabaseError

class CRUDWorkoutLog:
    def __init__(self, client: Client):
        self.client = client

    async def create_workout_log(self, user_id: UUID, workout_log: WorkoutLogRequest) -> WorkoutLogResponse:
        try:
            # Prepare data for insertion
            insert_data = {
                "user_id": str(user_id),
                "workout_plan_id": workout_log.workout_plan_id,
                "exercise_name": workout_log.exercise_name,
                "sets_completed": workout_log.sets_completed,
                "reps_completed": workout_log.reps_completed,
                "weight_lifted": workout_log.weight_lifted,
                "difficulty_rating": workout_log.difficulty_rating,
                "status": workout_log.status,
            }
            
            # Filter out None values to avoid Supabase errors if a field is Optional and not provided
            insert_data = {k: v for k, v in insert_data.items() if v is not None}

            response = self.client.from_("workout_logs").insert(insert_data).execute()

            if response.data is None or not response.data:
                raise SupabaseDatabaseError(f"Failed to create workout log. Supabase response: {response}")

            created_log_data = response.data[0]
            
            return WorkoutLogResponse.model_validate(created_log_data)

        except Exception as e:
            raise SupabaseDatabaseError(f"Error creating workout log: {e}")

def get_crud_workout_log(supabase_client: Client = Depends(get_supabase_client)) -> CRUDWorkoutLog:
    """
    Dependency to get a CRUDWorkoutLog instance for the current request.
    """
    return CRUDWorkoutLog(client=supabase_client)
