@echo off
echo Starting Yatra Live Tracking Enhanced Test...
echo.
echo This will start the development server and open the live tracking page
echo Press Ctrl+C to stop the server
echo.
pause

cd /d "%~dp0"
npm run dev