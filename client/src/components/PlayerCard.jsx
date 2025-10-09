import React from 'react';

const PlayerCard = ({ player, onAddPlayer, schedule }) => {
    const imageUrl = `https://sleepercdn.com/content/nfl/players/${player.player_id}.jpg`;
  
  const fallbackImageUrl = 'https://sleepercdn.com/images/v2/icons/player_default.webp';

  const opponentAbbr = schedule[player.team];
  const matchup = opponentAbbr ? `@ ${opponentAbbr}` : '(BYE)';
  
  // Destructure scores from the player object
  const { actualScore = 0, projectedScore = 0 } = player;

  // Determine the color for the projected score
  let projectedColor = 'text-gray-500';
  if (actualScore > projectedScore) {
    projectedColor = 'text-green-500';
  } else if (actualScore < projectedScore && actualScore!=0) {
    projectedColor = 'text-red-500';
  }

  const handleImageError = (e) => { e.target.src = fallbackImageUrl; };

  return (
    <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
      <div className="flex items-center">
        <img src={imageUrl} onError={handleImageError} alt={player.full_name} className="w-12 h-12 rounded-full mr-4 object-cover bg-gray-200" />
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">{player.full_name}</span>
          <div className="flex justify-center items-center text-sm text-gray-500">
            <span>{player.position} - {player.team}</span>
            <span className="ml-3 font-medium text-blue-600">{matchup}</span>
          </div>
          <div className="">
            <span className={`font-bold text-lg ${projectedColor}`}>{actualScore.toFixed(2)}</span>
            <span className="text-gray-400 ml-3 text-lg">({projectedScore.toFixed(2)})</span>
          </div>
        </div>
      </div>
      <div className="flex items-center">

        <button onClick={() => onAddPlayer(player)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded-full text-sm transition-colors">
          + Add
        </button>
      </div>
    </div>
  );
};

export default PlayerCard;
