@echo off
title QR Code Generator MERN App - Setup Script

echo.
echo 🚀 Welcome to the QR Code Generator MERN Application
echo -----------------------------------------------
echo.

echo 🔧 Installing front-end dependencies...
cd client
call npm install

echo ✅ Front-end dependencies installed.
cd ..

echo 🔧 Installing back-end dependencies...
cd server
call npm install

echo ✅ Back-end dependencies installed.
cd ..

echo 🟢 Starting front-end (React)...
start cmd /k "cd client && npm run dev"

echo 🟢 Starting back-end (Node/Express)...
start cmd /k "cd server && npm start"

echo.
echo ✅ All services started successfully!
echo Frontend running on: http://localhost:5173
echo Backend running on:  http://localhost:4000
echo.
pause
