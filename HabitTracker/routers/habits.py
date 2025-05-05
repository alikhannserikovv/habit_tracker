from fastapi import APIRouter, HTTPException, Path
from fastapi.params import Depends
from sqlalchemy.orm import Session
from typing import Annotated
from starlette import status
from ..database import SessionLocal
from ..schemas import HabitRequest
from ..models import Habits
from .user import get_current_user

router = APIRouter(
    prefix='/habits',
    tags=['Habits']
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

@router.post('', status_code=status.HTTP_201_CREATED)
async def create_habit(user: user_dependency, db: db_dependency,
                         habit_request: HabitRequest):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication Failed")
    habit_model = Habits(
        user_id = user.get('id'),
        title = habit_request.title,
        description = habit_request.description
    )
    db.add(habit_model)
    db.commit()

@router.get('/{habit_id}', status_code=status.HTTP_200_OK)
async def read_habit(user: user_dependency, db: db_dependency, habit_id: int = Path(gt=0)):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication Failed")
    habit_model = db.query(Habits).filter(Habits.id == habit_id).first()
    if habit_model is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Habit is not found")
    if habit_model.user_id != user.get('id'):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not your habit. No permission")
    return habit_model

@router.put('/{habit_id}', status_code=status.HTTP_204_NO_CONTENT)
async def update_habit(user: user_dependency, db: db_dependency, habit_request: HabitRequest,
                         habit_id: int = Path(gt=0)):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication Failed")
    habit_model = db.query(Habits).filter(Habits.id == habit_id).first()
    if habit_model is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Habit is not found")
    if habit_model.user_id != user.get('id'):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not your habit. No permission")
    habit_model.title = habit_request.title
    habit_model.description = habit_request.description
    db.add(habit_model)
    db.commit()

@router.delete('/{habit_id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_habit(user: user_dependency, db: db_dependency, habit_id: int = Path(gt=0)):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication Failed")
    habit_model = db.query(Habits).filter(Habits.id == habit_id).first()
    if habit_model is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Habit is not found")
    if habit_model.user_id != user.get('id'):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not your habit. No permission")
    db.delete(habit_model)
    db.commit()