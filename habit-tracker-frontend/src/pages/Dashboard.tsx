import { useState, useEffect } from 'react';
import { Habit, HabitRequest, HabitFilter } from '../types';
import HabitCard from '../components/HabitCard';
import HabitForm from '../components/HabitForm';
import { habitApi } from '../api/api';

const Dashboard = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState<HabitFilter>(HabitFilter.ALL);

  // Get all habits
  const fetchHabits = async () => {
    try {
      setLoading(true);
      const data = await habitApi.getAllHabits();
      setHabits(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching habits:', err);
      setError('Failed to load habits. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  // Create new habit
  const handleCreateHabit = async (habit: HabitRequest) => {
    try {
      setIsSubmitting(true);
      await habitApi.createHabit(habit);
      await fetchHabits(); // Refresh habits
      setShowForm(false);
    } catch (err) {
      console.error('Error creating habit:', err);
      alert('Failed to create habit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update habit
  const handleUpdateHabit = async (habit: HabitRequest) => {
    if (!editingHabit) return;

    try {
      setIsSubmitting(true);
      await habitApi.updateHabit(editingHabit.id, habit);
      await fetchHabits(); // Refresh habits
      setEditingHabit(null);
    } catch (err) {
      console.error('Error updating habit:', err);
      alert('Failed to update habit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete habit
  const handleDeleteHabit = async (id: number) => {
    const updatedHabits = habits.filter(habit => habit.id !== id);
    setHabits(updatedHabits);
  };

  // Start editing a habit
  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setShowForm(false);
  };

  // Cancel form
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingHabit(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Your Habits</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingHabit(null);
          }}
          className="btn btn-primary"
        >
          Add New Habit
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter(HabitFilter.ALL)}
            className={`btn ${filter === HabitFilter.ALL ? 'btn-primary' : 'btn-outline'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter(HabitFilter.ACTIVE)}
            className={`btn ${filter === HabitFilter.ACTIVE ? 'btn-primary' : 'btn-outline'}`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter(HabitFilter.INACTIVE)}
            className={`btn ${filter === HabitFilter.INACTIVE ? 'btn-primary' : 'btn-outline'}`}
          >
            Inactive
          </button>
        </div>
      </div>

      {/* Form for Create/Edit */}
      {(showForm || editingHabit) && (
        <div className="mb-8 p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-semibold mb-4">
            {editingHabit ? 'Edit Habit' : 'Create New Habit'}
          </h2>
          <HabitForm
            initialData={editingHabit || undefined}
            onSubmit={editingHabit ? handleUpdateHabit : handleCreateHabit}
            onCancel={handleCancelForm}
            isSubmitting={isSubmitting}
          />
        </div>
      )}

      {/* Loading State */}
      {loading && <p className="text-gray-600">Loading habits...</p>}

      {/* Error State */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Empty State */}
      {!loading && !error && habits.length === 0 && (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium text-gray-900">No habits yet</h3>
          <p className="mt-1 text-gray-500">
            Get started by adding your first habit to track!
          </p>
        </div>
      )}

      {/* Habits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {habits.map(habit => (
          <HabitCard
            key={habit.id}
            habit={habit}
            onDelete={handleDeleteHabit}
            onEdit={handleEditHabit}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;