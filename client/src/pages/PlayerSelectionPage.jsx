import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import PlayerFilters from '../components/PlayerFilters';
import PlayerList from '../components/PlayerList';
import RosterView from '../components/RosterView';
import { calculatePlayerScore, SCORING_RULES } from '../utils/scoring';

const ROSTER_STRUCTURE = { QB: 1, RB: 2, WR: 2, TE: 1, FLEX: 1 };

const PlayerSelectionPage = () => {
  const { leagueId, week } = useParams();
  const navigate = useNavigate();

  const [allPlayers, setAllPlayers] = useState({});
  const [schedule, setSchedule] = useState({});
  const [weeklyStats, setWeeklyStats] = useState({});
  const [weeklyProjections, setWeeklyProjections] = useState({});
  const [currentNflWeek, setCurrentNflWeek] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('ALL');
  const [roster, setRoster] = useState({ QB: [], RB: [], WR: [], TE: [], FLEX: [] });
  
  const weekNumber = parseInt(week, 10);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError('');
      try {
        const year = new Date().getFullYear();
        const [playersRes, scheduleRes, statsRes, stateRes, projectionsRes] = await Promise.all([
          axios.get('/api/players'),
          axios.get(`/api/schedule/${week}`),
          axios.get(`/api/stats/${year}/${week}`),
          axios.get('/api/state/nfl'),
          axios.get(`/api/projections/${year}/${week}`)
        ]);
        setAllPlayers(playersRes.data);
        setSchedule(scheduleRes.data);
        setWeeklyStats(statsRes.data);
        setCurrentNflWeek(stateRes.data.week);
        setWeeklyProjections(projectionsRes.data);
      } catch (err) {
        setError('Failed to load page data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [week]);

  useEffect(() => {
    setRoster({ QB: [], RB: [], WR: [], TE: [], FLEX: [] });
  }, [week]);

  const filteredPlayers = useMemo(() => {
    if (!allPlayers || Object.keys(allPlayers).length === 0) return [];
    if (weekNumber >= currentNflWeek){
      return Object.values(allPlayers)
      .filter(p => p.active && ['QB', 'RB', 'WR', 'TE'].includes(p.position))
      .filter(p => positionFilter === 'ALL' || p.position === positionFilter)
      .filter(p => p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()))
      .map(player => {
        const actualStats = weeklyStats[player.player_id];
        const projectedStats = weeklyProjections[player.player_id];
        return {
          ...player,
          actualScore: calculatePlayerScore(actualStats, SCORING_RULES),
          projectedScore: calculatePlayerScore(projectedStats, SCORING_RULES),
        };
      })
      .sort((a, b) => b.projectedScore - a.projectedScore);
    } 
    else{
    return Object.values(allPlayers)
      .filter(p => p.active && ['QB', 'RB', 'WR', 'TE'].includes(p.position))
      .filter(p => positionFilter === 'ALL' || p.position === positionFilter)
      .filter(p => p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()))
      .map(player => {
        const actualStats = weeklyStats[player.player_id];
        const projectedStats = weeklyProjections[player.player_id];
        return {
          ...player,
          actualScore: calculatePlayerScore(actualStats, SCORING_RULES),
          projectedScore: calculatePlayerScore(projectedStats, SCORING_RULES),
        };
      })
      .sort((a, b) => b.actualScore - a.actualScore);
    }
    }, [allPlayers, searchTerm, positionFilter, weeklyStats, weeklyProjections]);
  
  const handleAddPlayer = (player) => {
    const { position, player_id } = player;
    const isAlreadyOnRoster = Object.values(roster).flat().some(p => p.player_id === player_id);
    if (isAlreadyOnRoster) return alert("Player is already on your roster.");

    if (roster[position] && roster[position].length < ROSTER_STRUCTURE[position]) {
      setRoster(prev => ({ ...prev, [position]: [...prev[position], player] }));
      return;
    }
    if (['RB', 'WR', 'TE'].includes(position) && roster.FLEX.length < ROSTER_STRUCTURE.FLEX) {
      setRoster(prev => ({ ...prev, FLEX: [...prev.FLEX, player] }));
      return;
    }
    alert(`No open slots for position: ${position}`);
  };

  const handleRemovePlayer = (player, slot) => {
    setRoster(prev => ({
      ...prev,
      [slot]: prev[slot].filter(p => p.player_id !== player.player_id)
    }));
  };

  const handleSubmitRoster = async () => {
    const token = localStorage.getItem('token');
    if (!token) return setError('You must be logged in to submit picks.');

    const config = { headers: { 'Authorization': `Bearer ${token}` } };
    const playerIds = Object.values(roster).flat().map(p => p.player_id);

    if (playerIds.length !== 7) {
        return setError('Your roster is not full.');
    }

    try {
      await axios.post('/api/picks', { leagueId, week, players: playerIds }, config);
      alert('Picks submitted successfully!');
      navigate(`/league/${leagueId}`);
    } catch (err) {
      setError(err.response.data.message || 'Failed to submit picks.');
    }
  };

  const goToPreviousWeek = () => {
    if (weekNumber > 1) {
      navigate(`/league/${leagueId}/week/${weekNumber - 1}/picks`);
    }
  };

  const goToNextWeek = () => {
    navigate(`/league/${leagueId}/week/${weekNumber + 1}/picks`);
  };

  const goToCurrentWeek = () => {
    if (currentNflWeek) {
      navigate(`/league/${leagueId}/week/${currentNflWeek}/picks`);
    }
  };

  if (isLoading) return <div className="text-center mt-8">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 bg-blue-100">
      <div className="flex items-center justify-center mb-2 pt-2 flex-wrap">
        <button onClick={goToPreviousWeek} disabled={weekNumber <= 1} className="bg-blue-500 text-white font-bold py-3 px-4 hover:bg-blue-600 transition duration-200 rounded-l disabled:opacity-50 disabled:cursor-not-allowed">
          &lt; Prev
        </button>
        
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 px-6 py-2 bg-white border-t border-b border-l border-r border-gray-300 rounded">
          Week {weekNumber}
        </h2>
        <button onClick={goToNextWeek} disabled={weekNumber >= 18}  className="bg-blue-500 text-white font-bold py-3 px-4 hover:bg-blue-600 transition duration-200 rounded-r disabled:opacity-50 disabled:cursor-not-allowed">
          Next &gt;
        </button>
      </div>
      <div className="flex items-center justify-center mb-2 flex-wrap">
        {currentNflWeek && weekNumber !== currentNflWeek && (
          <button onClick={goToCurrentWeek} className="text-xs bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-1 border-l border-r border-blue-700 rounded mb-4">
            Jump to Current Week
          </button>
        )}
      </div>  
      {error && <p className="text-center bg-red-100 text-red-700 p-3 rounded-lg mb-2">{error}</p>}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <RosterView roster={roster} onRemovePlayer={handleRemovePlayer} />
          <button disabled={Object.values(roster).flat().length < 7 }  
            onClick={handleSubmitRoster} className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200 text-lg disabled:opacity-50 disabled:cursor-not-allowed">
            Submit Roster
          </button>
        </div>
        <div className="lg:col-span-2 bg-white p-3 rounded-lg border mb-2">
          <PlayerFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            positionFilter={positionFilter}
            setPositionFilter={setPositionFilter}
          />
          <PlayerList
            players={filteredPlayers}
            onAddPlayer={handleAddPlayer}
            schedule={schedule}
          />
        </div>
      </div>
    
    
    </div>
  );
};

export default PlayerSelectionPage;
