import { useState, useEffect } from 'react';
import { Habit, HabitLog } from '../types';
import { habitApi } from '../api/api';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';

const Statistics = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<Record<number, HabitLog[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all habits and their logs
  const fetchData = async () => {
    try {
      setLoading(true);
      const habitsData = await habitApi.getAllHabits();
      setHabits(habitsData);

      const logsData: Record<number, HabitLog[]> = {};
      for (const habit of habitsData) {
        const logs = await habitApi.getHabitLogs(habit.id);
        logsData[habit.id] = logs;
      }
      setHabitLogs(logsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate most consistent habit
  const getMostConsistentHabit = (): { habit: Habit | null; percentage: number } => {
    if (habits.length === 0) return { habit: null, percentage: 0 };

    let maxPercentage = 0;
    let mostConsistentHabit: Habit | null = null;

    habits.forEach(habit => {
      const logs = habitLogs[habit.id] || [];
      const percentage = logs.length > 0 ? (logs.length / 30) * 100 : 0;

      if (percentage > maxPercentage) {
        maxPercentage = percentage;
        mostConsistentHabit = habit;
      }
    });

    return {
      habit: mostConsistentHabit,
      percentage: Math.round(maxPercentage)
    };
  };

  // Calculate weekly progress
  const getWeeklyProgressData = () => {
    const now = new Date();
    const start = startOfWeek(now, { weekStartsOn: 0 });
    const end = endOfWeek(now, { weekStartsOn: 0 });
    const days = eachDayOfInterval({ start, end });

    return days.map(day => {
      const dayName = format(day, 'EEE');
      const formatted = format(day, 'yyyy-MM-dd');

      let completedCount = 0;
      habits.forEach(habit => {
        const logs = habitLogs[habit.id] || [];
        const isCompleted = logs.some(log =>
          isSameDay(new Date(log.date), day)
        );
        if (isCompleted) completedCount++;
      });

      const percentage = habits.length > 0
        ? Math.round((completedCount / habits.length) * 100)
        : 0;

      return {
        day: dayName,
        date: formatted,
        completed: completedCount,
        total: habits.length,
        percentage
      };
    });
  };

  const weeklyData = getWeeklyProgressData();
  const { habit: mostConsistentHabit, percentage: consistencyPercentage } = getMostConsistentHabit();

  if (loading) {
    return <div className="max-w-6xl mx-auto px-4 py-8">Loading statistics...</div>;
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-red-50 p-4 rounded-md">
          <h2 className="text-lg font-medium text-red-800">Error</h2>
          <p className="mt-1 text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Habit Statistics</h1>

      {habits.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium text-gray-900">No habits tracked yet</h3>
          <p className="mt-1 text-gray-500">
            Add some habits and start tracking to see your statistics!
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Most Consistent Habit */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Most Consistent Habit</h2>
              {mostConsistentHabit ? (
                <div>
                  <h3 className="text-lg font-medium text-gray-800">
                    {mostConsistentHabit.title}
                  </h3>
                  <div className="mt-2 h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${consistencyPercentage}%` }}
                    />
                  </div>
                  <p className="mt-1 text-gray-600">
                    {consistencyPercentage}% completion rate
                  </p>
                </div>
              ) : (
                <p>No habits have been tracked yet</p>
              )}
            </div>

            {/* Summary Stats */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Summary</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600">Total Habits</p>
                  <p className="text-2xl font-bold">{habits.length}</p>
                </div>
                <div>
                  <p className="text-gray-600">Total Tracked Days</p>
                  <p className="text-2xl font-bold">
                    {Object.values(habitLogs).reduce((sum, logs) => sum + logs.length, 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Progress */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">This Week's Progress</h2>
            <div className="grid grid-cols-7 gap-2">
              {weeklyData.map(day => (
                <div key={day.date} className="text-center">
                  <p className="font-medium">{day.day}</p>
                  <div className="my-2 flex justify-center">
                    <div
                      className={`h-16 w-16 rounded-full flex items-center justify-center ${
                        day.percentage >= 80 ? 'bg-green-100 text-green-800' :
                        day.percentage >= 50 ? 'bg-yellow-100 text-yellow-800' :
                        day.percentage > 0 ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <span className="text-lg font-medium">{day.percentage}%</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {day.completed}/{day.total}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Statistics;