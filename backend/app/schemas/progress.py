from pydantic import BaseModel
from typing import List, Tuple
from datetime import date

class ProgressResponse(BaseModel):
    workout_streak: int
    weight_trend: List[Tuple[date, float]]
