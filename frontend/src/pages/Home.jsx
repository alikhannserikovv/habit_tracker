import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      axios.get('http://localhost:8000/habits', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
        .then((response) => setHabits(response.data))
        .catch((error) => console.error('Ошибка при получении привычек:', error));
    }
  }, []);

  return (
    <div>
      <h1>Мои привычки</h1>
      <ul>
        {habits.map((habit) => (
          <li key={habit.id}>
            {habit.name} - {habit.completed ? '✅' : '❌'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
