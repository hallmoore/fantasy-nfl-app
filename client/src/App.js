import React from 'react';
import { BrowserRouter as Router, Route, Routes, useParams, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar'; 

import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateLeague from './pages/CreateLeague';
import JoinLeague from './pages/JoinLeague';
import PlayerSelectionPage from './pages/PlayerSelectionPage';
import LeaguePage from './pages/LeaguePage';

// --- THIS COMPONENT IS NOW A SMART REDIRECT ---
const HomePage = () => {
  const token = localStorage.getItem('token');
  // If token exists, redirect to dashboard. Otherwise, redirect to login.
  return token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="App" style={{ padding: '2rem' }}>
        <Navbar /> 
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-league" element={<CreateLeague />} />
          <Route path="/join-league" element={<JoinLeague />} />
          <Route path="/league/:leagueId" element={<LeaguePage />} />
          <Route path="/league/:leagueId/week/:week/picks" element={<PlayerSelectionPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;