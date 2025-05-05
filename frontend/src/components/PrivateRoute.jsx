import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Component }) => {
  const token = localStorage.getItem('token');  // Проверка наличия токена

  if (!token) {
    // Если токена нет, редиректим на страницу логина
    return <Navigate to="/login" />;
  }

  // Если токен есть, рендерим компонент
  return <Component />;
};

export default PrivateRoute;
