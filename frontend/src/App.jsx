import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import AddHabit from './pages/AddHabit';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Защищённые маршруты */}
        <Route path="/" element={<PrivateRoute element={Home} />} />
        <Route path="/add" element={<PrivateRoute element={AddHabit} />} />
      </Routes>
    </Router>
  );
};

export default App;
