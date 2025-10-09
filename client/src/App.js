import React from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';

// Import the new Navbar component
import Navbar from './components/Navbar'; 

// Import Page Components
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateLeague from './pages/CreateLeague';
import JoinLeague from './pages/JoinLeague';
import PlayerSelectionPage from './pages/PlayerSelectionPage';

// Placeholder for a specific league page
const LeaguePage = () => {
    const { leagueId } = useParams();
    return <h2>League Page for ID: {leagueId}</h2>;
};

// Simple Home Page Component
const HomePage = () => <h2>Welcome to the Fantasy Football App!</h2>;

function App() {
  return (
    <Router>
      <div className="App" style={{ padding: '2rem' }}>

        {/* The Navbar will now appear on every page */}
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
