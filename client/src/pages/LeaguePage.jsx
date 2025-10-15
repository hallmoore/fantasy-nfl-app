import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const LeaguePage = () => {
  const { leagueId } = useParams();
  const [league, setLeague] = useState(null);
  const [currentNflWeek, setCurrentNflWeek] = useState(null);
  const [viewingWeek, setViewingWeek] = useState(null);
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState([]);
  const [seasonLeaderboard, setSeasonLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isWeeklyLoading, setIsWeeklyLoading] = useState(false);
  const [error, setError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchWeeklyLeaderboard = async (week) => {
    if (!week) return;
    setIsWeeklyLoading(true);
    const token = localStorage.getItem('token');
    const config = { headers: { 'Authorization': `Bearer ${token}` } };
    try {
      const res = await axios.get(`/api/picks/league/${leagueId}/week/${week}`, config);
      setWeeklyLeaderboard(res.data);
    } catch (err) {
      setWeeklyLeaderboard([]);
    } finally {
      setIsWeeklyLoading(false);
    }
  };

  useEffect(() => {
    const fetchPageData = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to view this page.');
        setIsLoading(false);
        return;
      }
      const config = { headers: { 'Authorization': `Bearer ${token}` } };
      try {
        const [leagueRes, stateRes, seasonScoresRes] = await Promise.all([
          axios.get(`/api/leagues/${leagueId}`, config),
          axios.get('/api/state/nfl'),
          axios.get(`/api/leagues/${leagueId}/season-scores`, config)
        ]);

        setLeague(leagueRes.data);
        const week = stateRes.data.week;
        setCurrentNflWeek(week);
        setViewingWeek(week);
        setSeasonLeaderboard(seasonScoresRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch page data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPageData();
  }, [leagueId]);

  useEffect(() => {
    fetchWeeklyLeaderboard(viewingWeek);
  }, [viewingWeek, leagueId]);

  const handleScoreUpdate = async () => {
    setIsUpdating(true);
    const token = localStorage.getItem('token');
    const config = { headers: { 'Authorization': `Bearer ${token}` } };
    try {
      await axios.post('/api/scores/update', { week: viewingWeek }, config);
      alert(`Score update started for week ${viewingWeek}! Leaderboard will refresh in a moment.`);
      setTimeout(() => {
        fetchWeeklyLeaderboard(viewingWeek);
        setIsUpdating(false);
      }, 5000);
    } catch (err) {
      alert('Failed to start score update.');
      setIsUpdating(false);
    }
  };

  const goToPreviousWeek = () => setViewingWeek(prev => (prev > 1 ? prev - 1 : 1));
  const goToNextWeek = () => setViewingWeek(prev => (prev < 18 ? prev + 1 : 18));
  const goToCurrentWeek = () => setViewingWeek(currentNflWeek);

  if (isLoading) return <div className="text-center mt-8">Loading league...</div>;
  if (error) return <div className="text-center text-red-500 mt-8">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{league?.name}</h2>
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Season Leaderboard</h3>
        <ol className="space-y-3">
          {seasonLeaderboard.map((player, index) => (
            <li key={player.userId} className="flex justify-between items-center text-sm">
              <div className="flex items-center">
                <span className="font-bold text-gray-500 w-6">{index + 1}.</span>
                <span className="font-semibold text-gray-800">{player.username}</span>
              </div>
              <span className="font-bold text-gray-600">{player.seasonTotal.toFixed(2)}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="md:col-span-2">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-center mb-6 space-x-2">
            <button 
              onClick={goToPreviousWeek} 
              disabled={viewingWeek <= 1} 
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <div className="text-center font-bold text-gray-800 px-6 py-1 bg-white border border-gray-300 rounded">
              <span className="text-xl">Week {viewingWeek}</span>
              <Link to={`/league/${leagueId}/week/${viewingWeek}/picks`} className="block text-sm text-green-600 hover:underline mt-1">
                View/Edit Roster
              </Link>
              {currentNflWeek && viewingWeek !== currentNflWeek && (
                <button onClick={goToCurrentWeek} className="block text-xs text-blue-500 hover:underline mx-auto mt-1">
                  Jump to Current Week
                </button>
              )}
            </div>
            <button 
              onClick={goToNextWeek} 
              disabled={viewingWeek >= 18}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Leaderboard</h3>
             <button 
              onClick={handleScoreUpdate} 
              disabled={isUpdating}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-3 text-xs rounded disabled:opacity-50"
            >
              {isUpdating ? '...' : 'Refresh'}
            </button>
          </div>

          {isWeeklyLoading ? (
            <p className="text-center text-gray-500">Loading scores...</p>
          ) : weeklyLeaderboard.length > 0 ? (
            <ol className="space-y-3">
              {weeklyLeaderboard.map((pick, index) => (
                <li key={pick._id} className="flex justify-between items-center p-3 rounded-md bg-gray-50">
                  <div className="flex items-center">
                    <span className="text-lg font-bold text-gray-500 w-8">{index + 1}.</span>
                    <span className="font-semibold text-gray-800">{pick.user.username}</span>
                  </div>
                  <span className="font-bold text-lg text-blue-600">{pick.totalScore.toFixed(2)}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-gray-500 text-center">No scores submitted for this week yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaguePage;