import React from 'react';

const ROSTER_SLOTS = [
  { key: 'QB', label: 'QB' }, { key: 'RB', label: 'RB' },
  { key: 'RB', label: 'RB' }, { key: 'WR', label: 'WR' },
  { key: 'WR', label: 'WR' }, { key: 'TE', label: 'TE' },
  { key: 'FLEX', label: 'FLEX' },
];

const RosterView = ({ roster, onRemovePlayer }) => {
  const renderedCounts = { QB: 0, RB: 0, WR: 0, TE: 0, FLEX: 0 };

  const renderSlot = (slotKey, index) => {
    const player = roster[slotKey]?.[index];
    if (player) {
      return (
        <div className="flex justify-between items-center w-full">
          <div>
            <div className="font-semibold">{player.full_name}</div>
            <div className="text-xs text-gray-500">{player.position} - {player.team}</div>
          </div>
          <button onClick={() => onRemovePlayer(player, slotKey)} className="bg-red-600 hover:bg-red-600 text-white font-bold py-2 px-2 rounded-3xl transition duration-200 font-bold">
            &times; Remove
          </button>
        </div>
      );
    }
    return <div className="text-gray-400">Empty</div>;
  };

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-lg font-bold mb-4 text-center">Your Roster</h3>
      <div className="space-y-2">
        {ROSTER_SLOTS.map((slot, i) => {
          const currentCount = renderedCounts[slot.key];
          renderedCounts[slot.key]++;
          return (
            <div key={i} className="flex items-center p-2 border-b border-gray-100">
              <div className="w-12 font-bold text-gray-600">{slot.label}</div>
              <div className="flex-grow">
                {renderSlot(slot.key, currentCount)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RosterView;
