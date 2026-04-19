import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import './App.css';

import Header from './components/Header';
import Footer from './components/Footer';
import SettingsMenu from './components/SettingsMenu';

import Menu from './pages/Menu';
import MealManagement from './pages/MealManagement';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Users from './pages/Users';
import WorkSchedule from './pages/WorkSchedule';
import AdminWorkSchedule from './pages/AdminWorkSchedule';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return (
    <Router>
      <div className="app-layout">
        <Header user={user} setUser={setUser} />

        <main className="content">
          <Routes>
            <Route path="/" element={<Menu/>} />
            <Route path="/about" element={<About/>} />
            <Route path="/contact" element={<Contact/>} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/users" element={<Users user={user} />} />
            <Route path="/work-schedule" element={<WorkSchedule user={user} />} />
            <Route path="/admin/work-schedule" element={<AdminWorkSchedule user={user} />} />
            <Route path="/admin/meals" element={<MealManagement user={user} />} />
          </Routes>
        </main>

        <SettingsMenu
          user={user}
          setUser={setUser}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />
        <Footer />
      </div>
    </Router>
  );
}

export default App;