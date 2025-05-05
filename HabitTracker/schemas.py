from typing import Optional
from datetime import date
from pydantic import BaseModel, EmailStr


class CreateUserRequest(BaseModel):
    username: str
    password: str
    email: EmailStr

class Token(BaseModel):
    access_token: str
    token_type: str

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