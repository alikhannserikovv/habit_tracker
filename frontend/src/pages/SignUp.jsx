import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/users/register', {
        username,
        email,
        password,
      });

      console.log('Пользователь зарегистрирован:', response.data);
      navigate('/login');
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
    }
  };

  return (
    <div>
      <h1>Регистрация</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Имя пользователя"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Электронная почта"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
        />
        <button type="submit">Зарегистрироваться</button>
      </form>
    </div>
  );
};

export default SignUp;
