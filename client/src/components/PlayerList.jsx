import React, { useState, useEffect } from 'react';
import PlayerCard from './PlayerCard';

const PlayerList = ({ players, onAddPlayer, schedule }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const PLAYERS_PER_PAGE = 15;

  useEffect(() => {
    setCurrentPage(1);
  }, [players]);

  const indexOfLastPlayer = currentPage * PLAYERS_PER_PAGE;
  const indexOfFirstPlayer = indexOfLastPlayer - PLAYERS_PER_PAGE;
  const currentPlayers = players.slice(indexOfFirstPlayer, indexOfLastPlayer);
  const totalPages = Math.ceil(players.length / PLAYERS_PER_PAGE);

  const handlePrevPage = () => {
    setCurrentPage(prev => (prev > 1 ? prev - 1 : prev));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev));
  };

  if (!players || players.length === 0) {
    return <div className="text-center text-gray-500 mt-8">No players match your search.</div>;
  }

  return (
    <div className="mt-4">
      <div className="space-y-2">
        {currentPlayers.map(player => (
          <PlayerCard
            key={player.player_id}
            player={player}
            onAddPlayer={onAddPlayer}
            schedule={schedule}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center mb-2 pt-2 flex-wrap">
          <button 
            onClick={handlePrevPage} 
            disabled={currentPage === 1}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-2 border-l border-r border-blue-700 rounded-l disabled:cursor-not-allowed"
          >
            Prev
          </button>
          <span className="font-bold text-gray-800 px-6 py-3 bg-white border-t border-b border-l border-r border-gray-300 rounded">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            onClick={handleNextPage} 
            disabled={currentPage === totalPages}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-2 border-l border-r border-blue-700 rounded-r disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PlayerList;
