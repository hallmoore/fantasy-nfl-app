// Import necessary packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
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
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully.'))
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
// A simple test route to make sure the server is working
app.get('/', (req, res) => {
  res.send('Hello from the Fantasy Football API!');
});



// --- Start the Server ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
