from datetime import date
from fastapi import APIRouter, HTTPException, Path
from fastapi.params import Depends
from sqlalchemy.orm import Session
from typing import Annotated
from starlette import status
from ..database import SessionLocal
from ..schemas import HabitLogOut, HabitLogRequest
from ..models import HabitLogs, Habits

router = APIRouter(
    prefix='/habits',
    tags=['Habit Logs']
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

@router.post('/{habit_id}/track', status_code=status.HTTP_201_CREATED, response_model=HabitLogOut)
async def track_habit(db: db_dependency, habit_log_request: HabitLogRequest, habit_id: int):
    habit_model = db.query(Habits).filter(Habits.id == habit_id).first()
    if habit_model is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Habit is not found")
    if db.query(HabitLogs).filter(HabitLogs.date == habit_log_request.date).filter(HabitLogs.habit_id == habit_id).first() is not None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Habit has been already tracked for that date")
    habit_log_model = HabitLogs(habit_id=habit_id, date=habit_log_request.date)
    db.add(habit_log_model)
    db.commit()
    db.refresh(habit_log_model)
    return habit_log_model


@router.get('/{habit_id}/log', status_code=status.HTTP_200_OK, response_model=list[HabitLogOut])
async def get_habit_logs(db: db_dependency, habit_id: int = Path(gt=0)):
    habit_model = db.query(Habits).filter(Habits.id == habit_id).first()
    if habit_model is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Habit is not found")
    return db.query(HabitLogs).filter(HabitLogs.habit_id == habit_id).all()

@router.delete('/{habit_id}/track/{habit_log_date}', status_code=status.HTTP_204_NO_CONTENT)
async def untrack_habit(db: db_dependency, habit_log_date: date,
                            habit_id: int = Path(gt=0)):
    habit_model = db.query(Habits).filter(Habits.id == habit_id).first()
    if habit_model is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Habit is not found")
    habit_log_model = db.query(HabitLogs).filter(
        HabitLogs.habit_id == habit_id,
        HabitLogs.date == habit_log_date
    ).first()
    if habit_log_model:
        db.delete(habit_log_model)
        db.commit()