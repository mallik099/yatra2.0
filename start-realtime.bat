@echo off
echo Starting Yatra Real-time Bus Tracking...
echo.

echo Starting Backend Server...
start "Backend" cmd /k "cd backend && npm run dev"

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo Starting Frontend...
start "Frontend" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this window...
pause > nul