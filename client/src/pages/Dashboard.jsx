import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [leagues, setLeagues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserLeagues = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found, please log in.');
        setIsLoading(false);
        return;
      }
      const config = { headers: { 'Authorization': `Bearer ${token}` } };
      try {
        const res = await axios.get('/api/leagues/myleagues', config);
        setLeagues(res.data);
      } catch (err) {
        setError('Failed to fetch leagues.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserLeagues();
  }, []);

  if (isLoading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center text-red-500 mt-8">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">My Leagues</h2>
      {leagues.length === 0 ? (
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <p className="text-gray-600">You haven't joined any leagues yet.</p>
          <Link to="/join-league" className="mt-4 inline-block bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-colors">
            Find a League to Join!
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {leagues.map(league => (
            <div key={league._id} className="p-6 bg-white rounded-lg shadow-md">
              <Link to={`/league/${league._id}`} className="text-xl font-semibold text-blue-600 hover:underline">
                <h3>{league.name}</h3>
              </Link>
              <p className="text-sm text-gray-500 mt-1">Commissioner: {league.commissioner.username}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;