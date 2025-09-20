@echo off
echo Testing Yatra Live Tracking...
echo.
echo Starting frontend server...
start "Yatra Frontend" cmd /k "cd /d %~dp0 && npm run dev"
echo.
echo Frontend will be available at: http://localhost:8080
echo Navigate to: http://localhost:8080/live
echo.
echo Press any key to exit...
pause > nul