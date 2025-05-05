import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Habit, HabitLog } from '../types';
import { habitApi } from '../api/api';
import HabitCalendar from '../components/HabitCalendar';

const HabitDetail = () => {
  const { id } = useParams<{ id: string }>();
  const habitId = parseInt(id || '0');

  const [habit, setHabit] = useState<Habit | null>(null);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch habit and logs
  const fetchHabitData = async () => {
    try {
      setLoading(true);
      // Get all habits to find the current one
      const habits = await habitApi.getAllHabits();
      const currentHabit = habits.find(h => h.id === habitId);

      if (!currentHabit) {
        setError('Habit not found');
        return;
      }

      setHabit(currentHabit);

      // Get habit logs
      const habitLogs = await habitApi.getHabitLogs(habitId);
      setLogs(habitLogs);

      setError(null);
    } catch (err) {
      console.error('Error fetching habit data:', err);
      setError('Failed to load habit data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (habitId) {
      fetchHabitData();
    }
  }, [habitId]);

  // Handle tracking a habit
  const handleTrackHabit = async (date: string) => {
    try {
      await habitApi.trackHabit(habitId, { date });
      await fetchHabitData(); // Refresh logs
    } catch (err) {
      console.error('Error tracking habit:', err);
      alert('Failed to track habit for this date');
    }
  };

  // Handle untracking a habit
  const handleUntrackHabit = async (date: string) => {
    try {
      await habitApi.untrackHabit(habitId, date);
      await fetchHabitData(); // Refresh logs
    } catch (err) {
      console.error('Error untracking habit:', err);
      alert('Failed to untrack habit for this date');
    }
  };

  // Calculate streak
  const calculateStreak = () => {
    if (!logs.length) return 0;

    // Sort logs by date (newest first)
    const sortedLogs = [...logs].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Simple streak calculation
    let streak = 1;
    for (let i = 1; i < sortedLogs.length; i++) {
      const currentDate = new Date(sortedLogs[i-1].date);
      const prevDate = new Date(sortedLogs[i].date);

      // Check if dates are consecutive
      const diffTime = Math.abs(currentDate.getTime() - prevDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  if (loading) {
    return <div className="max-w-6xl mx-auto px-4 py-8">Loading habit data...</div>;
  }

  if (error || !habit) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-red-50 p-4 rounded-md">
          <h2 className="text-lg font-medium text-red-800">Error</h2>
          <p className="mt-1 text-sm text-red-700">{error || 'Habit not found'}</p>
          <Link to="/" className="mt-4 inline-block btn btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const currentStreak = calculateStreak();
  const totalDaysTracked = logs.length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-4">
        <Link to="/" className="text-primary hover:underline">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{habit.title}</h1>
        {habit.description && (
          <p className="text-gray-600 mb-4">{habit.description}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <h3 className="text-lg font-medium text-blue-800">Current Streak</h3>
            <p className="text-3xl font-bold text-blue-600">{currentStreak} days</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg text-center">
            <h3 className="text-lg font-medium text-green-800">Total Days Tracked</h3>
            <p className="text-3xl font-bold text-green-600">{totalDaysTracked} days</p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <h3 className="text-lg font-medium text-purple-800">Completion Rate</h3>
            <p className="text-3xl font-bold text-purple-600">
              {totalDaysTracked > 0
                ? `${Math.round((totalDaysTracked / 30) * 100)}%`
                : '0%'}
            </p>
            <p className="text-xs text-purple-600">(Last 30 days)</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Tracking Calendar</h2>
        <p className="text-gray-600 mb-4">
          Click on a date to mark your habit as completed or to unmark it.
        </p>

        <HabitCalendar
          habitId={habitId}
          logs={logs}
          onTrack={handleTrackHabit}
          onUntrack={handleUntrackHabit}
        />
      </div>
    </div>
  );
};