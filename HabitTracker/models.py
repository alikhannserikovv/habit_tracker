from datetime import datetime, timezone
from sqlalchemy.orm import relationship
from .database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text

class Habits(Base):
    __tablename__ = 'habits'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)

    logs = relationship("HabitLogs", back_populates="habit", cascade="all, delete")

class HabitLogs(Base):
    __tablename__ = 'habit_logs'

    id = Column(Integer, primary_key=True, index=True)
    habit_id = Column(Integer, ForeignKey("habits.id", ondelete="CASCADE"), nullable=False)
    date = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    habit = relationship("Habits", back_populates="logs")
