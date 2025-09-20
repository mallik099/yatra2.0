@echo off
echo ========================================
echo   Yatra Real-time Bus Tracking Setup
echo ========================================
echo.

echo Installing dependencies...
echo.

echo [1/4] Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error installing frontend dependencies!
    pause
    exit /b 1
)

echo [2/4] Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Error installing backend dependencies!
    pause
    exit /b 1
)

echo [3/4] Seeding database with TSRTC bus data...
call npm run seed
if %errorlevel% neq 0 (
    echo Warning: Database seeding failed. You may need to check MongoDB connection.
    echo Continuing anyway...
)

cd ..

echo [4/4] Starting servers...
echo.
echo Starting Backend Server (Port 3001)...
start "Yatra Backend" cmd /k "cd backend && npm run dev"

echo Waiting for backend to initialize...
timeout /t 5 /nobreak > nul

echo Starting Frontend Server (Port 8080)...
start "Yatra Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Backend API: http://localhost:3001
echo Frontend App: http://localhost:8080
echo.
echo The app now shows real-time bus data from MongoDB!
echo.
echo Press any key to close this setup window...
pause > nul