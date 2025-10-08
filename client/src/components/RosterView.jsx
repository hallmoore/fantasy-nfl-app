import React from 'react';

const ROSTER_SLOTS = [
    { key: 'QB', label: 'Quarterback' }, { key: 'RB', label: 'Running Back' },
    { key: 'RB', label: 'Running Back' }, { key: 'WR', label: 'Wide Receiver' },
    { key: 'WR', label: 'Wide Receiver' }, { key: 'TE', label: 'Tight End' },
    { key: 'FLEX', label: 'Flex (RB/WR/TE)' },
];

export default function RosterView({ roster, onRemovePlayer }) {
    const renderSlot = (slotKey, index) => {
        const player = roster[slotKey] && roster[slotKey][index];
        if (player) {
            return (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span><strong>{player.full_name}</strong> ({player.team})</span>
                    <button onClick={() => onRemovePlayer(player, slotKey)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>
                        X
                    </button>
                </div>
            );
        } else {
            return <div style={{ color: '#aaa' }}>Empty</div>;
        }
    };

    const renderedCounts = { QB: 0, RB: 0, WR: 0, TE: 0, FLEX: 0 };

    return (
        <div className="roster-view">
            <h3>Your Roster</h3>
            <table className="roster-table" style={{ width: '100%' }}>
                <tbody>
                    {ROSTER_SLOTS.map((slot, i) => {
                        const currentCount = renderedCounts[slot.key];
                        renderedCounts[slot.key]++;
                        return (
                            <tr key={i}>
                                <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{slot.label}</td>
                                <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                                    {renderSlot(slot.key, currentCount)}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
