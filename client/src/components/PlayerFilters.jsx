import React from 'react';

const POSITIONS = ['ALL', 'QB', 'RB', 'WR', 'TE'];

const PlayerFilters = ({ searchTerm, setSearchTerm, positionFilter, setPositionFilter }) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search player name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
      />
      <div className="flex space-x-2">
        {POSITIONS.map(position => (
          <button
            key={position}
            onClick={() => setPositionFilter(position)}
            className={`px-4 py-1 text-sm font-semibold rounded-full transition-colors ${
              positionFilter === position 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {position}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PlayerFilters;
