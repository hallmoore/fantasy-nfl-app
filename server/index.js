// Import necessary packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const updateAllScores = require('./scripts/updateScores');

require('dotenv').config(); // Loads environment variables from a .env file

// Initialize the Express app
const app = express();

// --- Middleware ---
// Enable Cross-Origin Resource Sharing for our frontend
app.use(cors());
// Allow the app to accept JSON in request bodies
app.use(express.json());

// --- Database Connection ---
// We will uncomment this section in the next step

const MONGO_URI = process.env.MONGO_URI;
// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully.');
    // Run the score update script once on startup
    console.log('Running initial score update on server start...');
    updateAllScores();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// --- Routes ---
// A simple test route to make sure the server is working
app.get('/', (req, res) => {
  res.send('Hello from the Fantasy Football API!');
});


// Import the user routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/leagues', require('./routes/leagueRoutes'));
app.use('/api/picks', require('./routes/pickRoutes')); 
app.use('/api/players', require('./routes/playerRoutes')); 
app.use('/api/schedule', require('./routes/scheduleRoutes')); 
app.use('/api/stats', require('./routes/statsRoutes.js')); 
app.use('/api/state', require('./routes/stateRoutes.js'));
app.use('/api/projections', require('./routes/projectionRoutes.js'));
app.use('/api/scores', require('./routes/scoreRoutes.js')); 

// A simple test route to make sure the server is working
app.get('/', (req, res) => {
  res.send('Hello from the Fantasy Football API!');
});


// --- Start the Server ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

