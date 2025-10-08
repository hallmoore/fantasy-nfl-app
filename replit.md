# Fantasy Football Player Selection App

## Overview
A Fantasy Football application where users can select players for their weekly roster. The app features a React-based frontend with a Node.js/Express backend serving player data and handling roster submissions.

**Project Status**: Fully configured and running in Replit environment  
**Last Updated**: October 8, 2025

## Purpose
This application allows fantasy football users to:
- Browse and search available players by name
- Filter players by position (QB, RB, WR, TE)
- Build a roster with specific position requirements (1 QB, 2 RB, 2 WR, 1 TE, 1 FLEX)
- Submit their roster for a specific league and week

## Recent Changes
- **October 8, 2025**: Initial Replit setup and configuration
  - Created complete React frontend with all components
  - Built Express backend API with mock player data
  - Configured development environment for Replit proxy support
  - Updated server to work in both dev and production modes
  - Server now binds to 0.0.0.0 in production and serves static React build
  - Set up deployment configuration with unified server approach
  - Created workflow to run both frontend and backend
  - Made start.sh script portable with relative paths

## Project Architecture

### Frontend (React)
- **Location**: `/client` directory
- **Framework**: React 18 with Create React App
- **Port**: 5000 (required for Replit)
- **Key Components**:
  - `PlayerSelectionPage`: Main container component
  - `PlayerList`: Displays available players
  - `PlayerCard`: Individual player display
  - `PlayerFilters`: Search and position filter controls
  - `RosterView`: Shows selected roster with validation

### Backend (Express)
- **Location**: `/server` directory
- **Framework**: Express.js
- **Port**: 3001 in development, 5000 in production (always binds to 0.0.0.0)
- **API Endpoints**:
  - `GET /api/players`: Returns list of all players
  - `POST /api/picks`: Accepts roster submission (leagueId, week, playerIds)
- **Production Mode**: Serves React static build and handles all routes

### Roster Rules
- 1 Quarterback (QB)
- 2 Running Backs (RB)
- 2 Wide Receivers (WR)
- 1 Tight End (TE)
- 1 Flex Position (RB/WR/TE)
- Total: 7 players required

## Configuration Details

### Environment Setup
- **Node.js Version**: 20.x
- **Package Manager**: npm
- **Proxy Configuration**: React dev server proxies API calls to backend on port 3001
- **Host Configuration**: Frontend configured with `DANGEROUSLY_DISABLE_HOST_CHECK=true` to work with Replit's iframe proxy

### Development Workflow
The app uses a shell script (`start.sh`) that:
1. Starts the Express backend on port 3001
2. Starts the React frontend on port 5000

### Deployment Configuration
- **Target**: Autoscale (stateless web app)
- **Build**: `npm install && cd client && npm install && npm run build && cd ../server && npm install`
- **Run**: `NODE_ENV=production PORT=5000 node server/server.js`
- **Production Behavior**: Single Node.js server process that:
  - Sets NODE_ENV=production to enable static file serving
  - Serves static React build from `/client/build`
  - Handles API requests on `/api/*` routes
  - Serves index.html for all other routes (SPA support)
  - Listens on 0.0.0.0:5000 for external access

## Project Structure
```
/
├── client/                # React frontend
│   ├── public/           # Static files
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── App.js        # Main app component
│   │   ├── index.js      # Entry point
│   │   ├── App.css       # Styles
│   │   └── index.css     # Global styles
│   └── package.json
├── server/               # Express backend
│   ├── server.js         # API server
│   └── package.json
├── start.sh              # Startup script
└── package.json          # Root package file
```

## Dependencies

### Client
- react, react-dom: ^18.2.0
- react-scripts: 5.0.1
- axios: ^1.6.0

### Server
- express: ^4.18.2
- cors: ^2.8.5

### Dev Tools
- concurrently: ^8.2.2 (for running multiple processes)
- serve: For production static file serving

## Development Notes
- The current implementation uses mock player data in the backend
- In production, the backend would connect to a real fantasy football API
- React proxy is configured to forward `/api/*` requests to the Express server
- All host checks are disabled to work with Replit's iframe-based preview

## User Preferences
(None recorded yet)

## Future Enhancements
- Connect to real fantasy football data API
- Add user authentication
- Implement database for storing rosters
- Add real-time scoring updates
- Support for multiple leagues and teams
