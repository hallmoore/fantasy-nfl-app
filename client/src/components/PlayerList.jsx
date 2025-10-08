import React from 'react';
import PlayerCard from './PlayerCard';

export default function PlayerList({ players, onAddPlayer }) {
    if (!players || players.length === 0) {
        return <div className="no-players-found">No players match your search.</div>;
    }

    return (
        <div className="player-list" style={{ marginTop: '1rem' }}>
            {players.map(player => (
                <PlayerCard
                    key={player.player_id}
                    player={player}
                    onAddPlayer={onAddPlayer}
                />
            ))}
        </div>
    );
}
