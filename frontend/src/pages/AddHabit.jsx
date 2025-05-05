import React, { useState } from 'react';
import axios from 'axios';

const AddHabit = () => {
  const [habitName, setHabitName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (token) {
      axios.post('http://localhost:8000/habits/create',
        { name: habitName },
        {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((response) => {
          console.log('Привычка добавлена:', response.data);
          setHabitName('');
        })
        .catch((error) => {
          console.error('Ошибка при добавлении привычки:', error);
        });
    }
  };

  return (
    <div>
      <h1>Добавить привычку</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={habitName}
          onChange={(e) => setHabitName(e.target.value)}
          placeholder="Введите привычку"
        />
        <button type="submit">Добавить</button>
      </form>
    </div>
  );
};

export default AddHabit;
