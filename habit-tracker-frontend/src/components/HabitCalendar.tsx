import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameDay, addMonths, subMonths } from 'date-fns';
import { HabitLog } from '../types/index';
import { habitApi } from '../api/api';

interface HabitCalendarProps {
  habitId: number;
  logs: HabitLog[];
  onTrack: (date: string) => Promise<void>;
  onUntrack: (date: string) => Promise<void>;
}

const HabitCalendar = ({ habitId, logs, onTrack, onUntrack }: HabitCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  const startDate = startOfMonth(currentMonth);
  const endDate = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const isDateTracked = (date: Date): boolean => {
    return logs.some(log => isSameDay(new Date(log.date), date));
  };

  const toggleTracking = async (date: Date) => {
    try {
      setIsLoading(true);
      const formattedDate = format(date, 'yyyy-MM-dd');

      if (isDateTracked(date)) {
        await onUntrack(formattedDate);
      } else {
        await onTrack(formattedDate);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="btn btn-outline"
          disabled={isLoading}
        >
          Previous
        </button>
        <h3 className="text-lg font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <button
          onClick={nextMonth}
          className="btn btn-outline"
          disabled={isLoading}
        >
          Next
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="font-medium text-gray-600 py-2">
            {day}
          </div>
        ))}

        {daysInMonth.map(day => {
          const tracked = isDateTracked(day);
          return (
            <button
              key={day.toString()}
              onClick={() => toggleTracking(day)}
              disabled={isLoading}
              className={`
                p-2 rounded-md border border-gray-200 flex items-center justify-center h-12
                ${tracked ? 'bg-green-100 border-green-300' : ''}
                ${isToday(day) ? 'font-bold border-primary' : ''}
              `}
            >
              <span>{format(day, 'd')}</span>
              {tracked && (
                <span className="ml-1 text-green-600">✓</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HabitCalendar;