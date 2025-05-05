import { useState } from 'react';
import { Habit } from '../types';
import { Link } from 'react-router-dom';
import { habitApi } from '../api/api';

interface HabitCardProps {
  habit: Habit;
  onDelete: (id: number) => void;
  onEdit: (habit: Habit) => void;
}

const HabitCard = ({ habit, onDelete, onEdit }: HabitCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await habitApi.deleteHabit(habit.id);
      onDelete(habit.id);
    } catch (error) {
      console.error('Error deleting habit:', error);
      alert('Failed to delete habit');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-xl font-bold text-gray-800 mb-2">{habit.title}</h3>
      {habit.description && (
        <p className="text-gray-600 mb-4">{habit.description}</p>
      )}
      <div className="flex justify-between items-center mt-4">
        <Link to={`/habit/${habit.id}`} className="btn btn-primary">
          Track Progress
        </Link>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(habit)}
            className="btn btn-outline"
            aria-label="Edit habit"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="btn btn-danger"
            aria-label="Delete habit"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HabitCard;