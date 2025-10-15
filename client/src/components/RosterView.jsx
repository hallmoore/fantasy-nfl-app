import React from 'react';

const RosterView = ({ roster, onRemovePlayer, schedule, picksSubmitted }) => {
  const ROSTER_SLOTS = [
    { key: 'QB', label: 'QB' }, { key: 'RB', label: 'RB' },
    { key: 'RB', label: 'RB' }, { key: 'WR', label: 'WR' },
    { key: 'WR', label: 'WR' }, { key: 'TE', label: 'TE' },
    { key: 'FLEX', label: 'FLEX' },
  ];

  const renderedCounts = { QB: 0, RB: 0, WR: 0, TE: 0, FLEX: 0 };
  const fallbackImageUrl = 'https://sleepercdn.com/images/v2/icons/player_default.webp';

  const renderSlot = (slotKey, index) => {
    const player = roster[slotKey]?.[index];

    if (player) {
      const imageUrl = `https://sleepercdn.com/content/nfl/players/${player.player_id}.jpg`;
      const opponentAbbr = schedule ? schedule[player.team] : null;
      const matchup = opponentAbbr ? `@ ${opponentAbbr}` : '(BYE)';
      const { actualScore = 0, projectedScore = 0 } = player;

      let projectedColor = 'text-gray-500';
      if (actualScore > 0 && actualScore > projectedScore) projectedColor = 'text-green-500';
      if (actualScore > 0 && actualScore < projectedScore) projectedColor = 'text-red-500';

      const handleImageError = (e) => { e.target.src = fallbackImageUrl; };

      return (
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center">
            <img src={imageUrl} onError={handleImageError} alt={player.full_name} className="w-10 h-10 rounded-full mr-3 object-cover bg-gray-200" />
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-gray-800">{player.full_name}</span>
              <div className="flex items-center text-xs text-gray-500">
                <span>{player.position} - {player.team}</span>
                <span className="ml-2 font-medium text-blue-600">{matchup}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="font-bold text-md text-right mr-3">
              <span>{actualScore.toFixed(2)}</span>
              <span className={`ml-1 text-xs ${projectedColor}`}>({projectedScore.toFixed(2)})</span>
            </div>
            {!picksSubmitted && (
              <button onClick={() => onRemovePlayer(player, slotKey)} className="text-red-500 hover:text-red-700 font-bold">
                &times;
              </button>
            )}
          </div>
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
                {/* --- THIS IS THE FIX ---
                The variable was 'slotKey' but it should have been 'slot.key' */}
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