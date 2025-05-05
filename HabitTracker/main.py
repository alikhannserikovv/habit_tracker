from fastapi import FastAPI
import models
from database import engine
from routers import user, habits, habit_logs

app = FastAPI()

models.Base.metadata.create_all(bind=engine)

app.include_router(user.router)
app.include_router(habits.router)
app.include_router(habit_logs.router)