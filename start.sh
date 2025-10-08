#!/bin/bash

# Start backend server in background
cd /home/runner/workspace/server && node server.js &

# Start React frontend (this will be on port 5000)
cd /home/runner/workspace/client && PORT=5000 HOST=0.0.0.0 DANGEROUSLY_DISABLE_HOST_CHECK=true npm start
