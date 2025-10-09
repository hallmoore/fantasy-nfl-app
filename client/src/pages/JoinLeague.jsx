import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const JoinLeague = () => {
  const [leagues, setLeagues] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const res = await axios.get('/api/leagues');
        setLeagues(res.data);
      } catch (err) {
        setError('Could not fetch leagues.');
      }
    };
    fetchLeagues();
  }, []);

  const handleJoin = async (leagueId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to join a league.');
      return;
    }
    const config = { headers: { 'Authorization': `Bearer ${token}` } };
    try {
      const res = await axios.put(`/api/leagues/${leagueId}/join`, null, config);
      alert(res.data.message);
      navigate(`/league/${leagueId}`);
    } catch (err) {
      setError(err.response.data.message || 'Failed to join league.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Join a Public League</h2>
      {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>}
      <div className="space-y-4">
        {leagues.map(league => (
          <div key={league._id} className="p-6 bg-white rounded-lg shadow-md flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{league.name}</h3>
              <p className="text-sm text-gray-500">Commissioner: {league.commissioner.username}</p>
              <p className="text-sm text-gray-500">Members: {league.members.length}</p>
            </div>
            <button onClick={() => handleJoin(league._id)} className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition-colors">
              Join
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JoinLeague;
