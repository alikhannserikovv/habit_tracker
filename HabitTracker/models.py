from datetime import datetime, timezone
from sqlalchemy.orm import relationship
from .database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text


class Users(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False)
    username = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    habit = relationship("Habits", back_populates="user", cascade="all, delete")

class Habits(Base):
    __tablename__ = 'habits'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    user = relationship("Users", back_populates="habit")
    logs = relationship("HabitLogs", back_populates="habit", cascade="all, delete")

class HabitLogs(Base):
    __tablename__ = 'habit_logs'

    id = Column(Integer, primary_key=True, index=True)
    habit_id = Column(Integer, ForeignKey("habits.id", ondelete="CASCADE"), nullable=False)
    date = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    habit = relationship("Habits", back_populates="logs")
