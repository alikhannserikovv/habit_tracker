from typing import Optional
from datetime import date
from pydantic import BaseModel

class HabitRequest(BaseModel):
    title: str
    description: Optional[str] = None

class HabitLogBase(BaseModel):
    date: date

class HabitLogRequest(HabitLogBase):
    pass

class HabitLogOut(HabitLogBase):
    id: int
    habit_id: int