import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import HabitDetail from './pages/HabitDetail';
import Statistics from './pages/Statistics';
import Header from './components/Header';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/habit/:id" element={<HabitDetail />} />
            <Route path="/stats" element={<Statistics />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;