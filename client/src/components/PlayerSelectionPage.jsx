import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import PlayerFilters from './PlayerFilters';
import PlayerList from './PlayerList';
import RosterView from './RosterView';

const ROSTER_STRUCTURE = { QB: 1, RB: 2, WR: 2, TE: 1, FLEX: 1 };

export default function PlayerSelectionPage({ leagueId, week }) {
    const [allPlayers, setAllPlayers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [positionFilter, setPositionFilter] = useState('ALL');
    const [roster, setRoster] = useState({ QB: [], RB: [], WR: [], TE: [], FLEX: [] });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const response = await axios.get('/api/players');
                setAllPlayers(response.data);
                setIsLoading(false);
            } catch (err) {
                setError('Failed to fetch players. Please try again later.');
                setIsLoading(false);
            }
        };
        fetchPlayers();
    }, []);

    const filteredPlayers = useMemo(() => {
        return allPlayers
            .filter(player => (positionFilter === 'ALL' ? true : player.position === positionFilter))
            .filter(player => player.full_name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [allPlayers, searchTerm, positionFilter]);

    const handleAddPlayer = (player) => {
        const { position, player_id } = player;
        const isAlreadyOnRoster = Object.values(roster).flat().some(p => p.player_id === player_id);
        if (isAlreadyOnRoster) {
            alert("Player is already on your roster.");
            return;
        }

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
        setRoster(prev => ({ ...prev, [slot]: prev[slot].filter(p => p.player_id !== player.player_id) }));
    };

    const handleSubmitRoster = async () => {
        setIsSubmitting(true);
        for (const position in ROSTER_STRUCTURE) {
            const requiredCount = ROSTER_STRUCTURE[position];
            const selectedCount = roster[position] ? roster[position].length : 0;
            if (selectedCount !== requiredCount) {
                alert(`Your roster is incomplete. Please select ${requiredCount} player(s) for the ${position} position.`);
                setIsSubmitting(false);
                return;
            }
        }

        const rosterToSubmit = Object.values(roster).flat().map(player => player.player_id);

        try {
            await axios.post('/api/picks', { leagueId, week, playerIds: rosterToSubmit });
            alert('Roster submitted successfully!');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to submit roster.';
            alert(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div>Loading players...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="player-selection-container" style={{ display: 'flex', gap: '2rem' }}>
            <div className="player-list-area" style={{ flex: 2 }}>
                <h2>Select Players</h2>
                <PlayerFilters
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    positionFilter={positionFilter}
                    setPositionFilter={setPositionFilter}
                />
                <PlayerList players={filteredPlayers} onAddPlayer={handleAddPlayer} />
            </div>
            <div className="roster-view-area" style={{ flex: 1 }}>
                <RosterView roster={roster} onRemovePlayer={handleRemovePlayer} />
                <button onClick={handleSubmitRoster} disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Roster'}
                </button>
            </div>
        </div>
    );
}
