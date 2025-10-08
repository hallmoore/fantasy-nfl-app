const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const mockPlayers = [
  { player_id: 1, full_name: "Patrick Mahomes", position: "QB", team: "KC", opponent: "LV" },
  { player_id: 2, full_name: "Josh Allen", position: "QB", team: "BUF", opponent: "MIA" },
  { player_id: 3, full_name: "Jalen Hurts", position: "QB", team: "PHI", opponent: "DAL" },
  { player_id: 4, full_name: "Christian McCaffrey", position: "RB", team: "SF", opponent: "SEA" },
  { player_id: 5, full_name: "Austin Ekeler", position: "RB", team: "LAC", opponent: "DEN" },
  { player_id: 6, full_name: "Derrick Henry", position: "RB", team: "TEN", opponent: "JAX" },
  { player_id: 7, full_name: "Saquon Barkley", position: "RB", team: "NYG", opponent: "WAS" },
  { player_id: 8, full_name: "Tyreek Hill", position: "WR", team: "MIA", opponent: "BUF" },
  { player_id: 9, full_name: "Justin Jefferson", position: "WR", team: "MIN", opponent: "GB" },
  { player_id: 10, full_name: "Stefon Diggs", position: "WR", team: "BUF", opponent: "MIA" },
  { player_id: 11, full_name: "CeeDee Lamb", position: "WR", team: "DAL", opponent: "PHI" },
  { player_id: 12, full_name: "Travis Kelce", position: "TE", team: "KC", opponent: "LV" },
  { player_id: 13, full_name: "Mark Andrews", position: "TE", team: "BAL", opponent: "CIN" },
  { player_id: 14, full_name: "George Kittle", position: "TE", team: "SF", opponent: "SEA" },
  { player_id: 15, full_name: "Joe Burrow", position: "QB", team: "CIN", opponent: "BAL" },
  { player_id: 16, full_name: "Lamar Jackson", position: "QB", team: "BAL", opponent: "CIN" },
  { player_id: 17, full_name: "Davante Adams", position: "WR", team: "LV", opponent: "KC" },
  { player_id: 18, full_name: "Amon-Ra St. Brown", position: "WR", team: "DET", opponent: "CHI" },
  { player_id: 19, full_name: "Nick Chubb", position: "RB", team: "CLE", opponent: "PIT" },
  { player_id: 20, full_name: "Jonathan Taylor", position: "RB", team: "IND", opponent: "HOU" }
];

app.get('/api/players', (req, res) => {
  res.json(mockPlayers);
});

app.post('/api/picks', (req, res) => {
  const { leagueId, week, playerIds } = req.body;
  
  if (!leagueId || !week || !playerIds || !Array.isArray(playerIds)) {
    return res.status(400).json({ message: 'Invalid request. Missing required fields.' });
  }
  
  if (playerIds.length !== 7) {
    return res.status(400).json({ message: 'Roster must have exactly 7 players.' });
  }
  
  console.log(`Roster submitted for league ${leagueId}, week ${week}:`, playerIds);
  res.json({ success: true, message: 'Roster submitted successfully!' });
});

app.listen(PORT, 'localhost', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
