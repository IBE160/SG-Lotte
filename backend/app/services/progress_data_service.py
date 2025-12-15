from supabase import Client
from datetime import datetime, timedelta, date
from typing import List, Tuple
from postgrest.exceptions import APIError # Import APIError

class ProgressDataService:
    def __init__(self, supabase: Client):
        self.supabase = supabase

    def get_workout_streak(self, user_id: str) -> int:
        # Fetch workout logs using Supabase client
        response = self.supabase.from_('workout_logs').select('logged_at').eq('user_id', user_id).order('logged_at', desc=True).execute()
        workout_logs = response.data

        if not workout_logs:
            return 0

        # Extract dates and convert to date objects
        logged_dates = sorted(list(set(datetime.fromisoformat(log['logged_at']).date() for log in workout_logs)), reverse=True)

        if not logged_dates:
            return 0

        streak = 0
        expected_date = date.today()

        # Check for today's workout
        if logged_dates[0] == expected_date:
            streak += 1
            expected_date -= timedelta(days=1)
            # Iterate through the rest of the logged dates
            for i in range(1, len(logged_dates)):
                if logged_dates[i] == expected_date:
                    streak += 1
                    expected_date -= timedelta(days=1)
                else:
                    break
        elif logged_dates[0] == expected_date - timedelta(days=1): # Most recent workout was yesterday
             expected_date -= timedelta(days=1)
             for logged_date in logged_dates:
                 if logged_date == expected_date:
                     streak += 1
                     expected_date -= timedelta(days=1)
                 else:
                     break
        else:
            return 0 # The most recent workout is neither today nor yesterday, so streak is 0.

        return streak


    def get_weight_trend(self, user_id: str) -> List[Tuple[date, float]]:
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        try:
            # Fetch weight logs using Supabase client
            response = self.supabase.from_('weight_logs').select('timestamp, weight').eq('user_id', user_id).gte('timestamp', thirty_days_ago.isoformat()).order('timestamp', desc=False).execute()
            weight_logs = response.data
            return [(date.fromisoformat(log['timestamp'].split('T')[0]), log['weight']) for log in weight_logs]
        except APIError as e:
            # Log the error for debugging purposes, but return empty list as per requirement
            print(f"Supabase APIError in get_weight_trend: {e}")
            return []
        except Exception as e:
            # Catch any other unexpected exceptions and return empty list
            print(f"Unexpected error in get_weight_trend: {e}")
            return []

    def get_progress_data(self, user_id: str):
        workout_streak = self.get_workout_streak(user_id)
        weight_trend = self.get_weight_trend(user_id)
        return {"workout_streak": workout_streak, "weight_trend": weight_trend}