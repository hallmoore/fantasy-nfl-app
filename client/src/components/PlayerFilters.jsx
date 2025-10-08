import React from 'react';

const POSITIONS = ['ALL', 'QB', 'RB', 'WR', 'TE'];

export default function PlayerFilters({ searchTerm, setSearchTerm, positionFilter, setPositionFilter }) {
    return (
        <div className="player-filters-container">
            <input
                type="text"
                placeholder="Search player name..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '8px', marginBottom: '1rem' }}
            />
            <div className="position-buttons">
                {POSITIONS.map(position => (
                    <button
                        key={position}
                        className={`position-btn ${positionFilter === position ? 'active' : ''}`}
                        onClick={() => setPositionFilter(position)}
                    >
                        {position}
                    </button>
                ))}
            </div>
        </div>
    );
}
