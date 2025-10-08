import React from 'react';

export default function PlayerCard({ player, onAddPlayer }) {
    const opponent = player.opponent ? `@ ${player.opponent}` : '';

    return (
        <div className="player-card-item" style={{ display: 'flex', justifyContent: 'space-between', border: '1px solid #ccc', padding: '10px', marginBottom: '5px' }}>
            <div className="player-card-info">
                <span style={{ fontWeight: 'bold' }}>{player.full_name}</span>
                <span style={{ marginLeft: '10px', color: '#555' }}>{player.position} - {player.team}</span>
            </div>
            <div className="player-card-matchup" style={{ color: '#777' }}>
                <span>{opponent}</span>
            </div>
            <button
                className="add-player-btn"
                onClick={() => onAddPlayer(player)}
            >
                + Add
            </button>
        </div>
    );
}
