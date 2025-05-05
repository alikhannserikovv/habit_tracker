from fastapi import APIRouter, HTTPException, Path
from fastapi.params import Depends
from sqlalchemy.orm import Session
from typing import Annotated
from starlette import status
from ..database import SessionLocal
from ..schemas import HabitRequest
from ..models import Habits

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

@router.post('/create', status_code=status.HTTP_201_CREATED)
async def create_habit(db: db_dependency, habit_request: HabitRequest):
    habit_model = Habits(
        title = habit_request.title,
        description = habit_request.description
    )
    db.add(habit_model)
    db.commit()

@router.get('', status_code=status.HTTP_200_OK)
async def read_habits(db: db_dependency):
    return db.query(Habits).all()

@router.put('/{habit_id}', status_code=status.HTTP_204_NO_CONTENT)
async def update_habit(db: db_dependency, habit_request: HabitRequest,
                         habit_id: int = Path(gt=0)):
    habit_model = db.query(Habits).filter(Habits.id == habit_id).first()
    if habit_model is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Habit is not found")
    habit_model.title = habit_request.title
    habit_model.description = habit_request.description
    db.add(habit_model)
    db.commit()

@router.delete('/{habit_id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_habit(db: db_dependency, habit_id: int = Path(gt=0)):
    habit_model = db.query(Habits).filter(Habits.id == habit_id).first()
    if habit_model is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Habit is not found")
    db.delete(habit_model)
    db.commit()