#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Start backend server in background
cd "$SCRIPT_DIR/server" && node server.js &

# Start React frontend (this will be on port 5000)
cd "$SCRIPT_DIR/client" && PORT=5000 HOST=0.0.0.0 DANGEROUSLY_DISABLE_HOST_CHECK=true npm start
