from fastapi import FastAPI
from . import models
from .database import engine
from .routers import habits, habit_logs
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

models.Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(habits.router)
app.include_router(habit_logs.router)