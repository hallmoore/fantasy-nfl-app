import React from 'react';
import PlayerSelectionPage from './components/PlayerSelectionPage';
import './App.css'; // Or your main stylesheet

function App() {
  // You would pass the actual leagueId and week from your app's state or props
  const leagueId = "some-league-id";
  const week = 5;

  return (
    <div className="App">
      <header>
        <h1>My Fantasy League</h1>
      </header>
      <main>
        <PlayerSelectionPage leagueId={leagueId} week={week} />
      </main>
    </div>
  );
}

export default App;
