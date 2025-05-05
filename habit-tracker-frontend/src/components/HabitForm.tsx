import { useState, FormEvent, useEffect } from 'react';
import { Habit, HabitRequest } from '../types';

interface HabitFormProps {
  initialData?: Habit;
  onSubmit: (data: HabitRequest) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const HabitForm = ({ initialData, onSubmit, onCancel, isSubmitting }: HabitFormProps) => {
  const [formData, setFormData] = useState<HabitRequest>({
    title: initialData?.title || '',
    description: initialData?.description || '',
  });

  const [errors, setErrors] = useState({
    title: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description || '',
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (name === 'title' && value.trim()) {
      setErrors(prev => ({ ...prev, title: '' }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate
    if (!formData.title.trim()) {
      setErrors(prev => ({ ...prev, title: 'Title is required' }));
      return;
    }

    try {
      await onSubmit(formData);
      // Reset form after successful submission if it's a new habit
      if (!initialData) {
        setFormData({ title: '', description: '' });
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Habit Name*
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`input ${errors.title ? 'border-red-500' : ''}`}
          placeholder="E.g., Morning Exercise"
          disabled={isSubmitting}
        />
        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description (Optional)
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          className="input"
          rows={3}
          placeholder="Add details about your habit"
          disabled={isSubmitting}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-outline"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update Habit' : 'Create Habit'}
        </button>
      </div>
    </form>
  );
};

export default HabitForm;