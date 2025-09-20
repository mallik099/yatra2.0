@echo off
echo ========================================
echo Testing Yatra - All Components
echo ========================================
echo.

echo Starting frontend server...
start "Yatra Frontend" cmd /k "cd /d %~dp0 && npm run dev"

timeout /t 3 /nobreak > nul

echo.
echo ========================================
echo Test URLs:
echo ========================================
echo 1. Home Page: http://localhost:8080/
echo 2. Live Tracking: http://localhost:8080/live
echo 3. Route Search: http://localhost:8080/search
echo.
echo ========================================
echo Features to Test:
echo ========================================
echo [Home Page]
echo - Navigation buttons work
echo - Popular routes display
echo - Quick actions functional
echo.
echo [Live Tracking]
echo - Bus markers appear on map
echo - Real-time updates every 10s
echo - Bus selection shows details
echo - User location detection
echo.
echo [Route Search]
echo - Search form works
echo - Autocomplete suggestions
echo - Route results display
echo - Popular routes clickable
echo.
echo Press any key to exit...
pause > nul