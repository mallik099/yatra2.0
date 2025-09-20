@echo off
echo ========================================
echo Testing iOS-Style Live Bus Tracking
echo ========================================
echo.

echo Starting Yatra with new iOS design...
start "Yatra iOS Design" cmd /k "cd /d %~dp0 && npm run dev"

timeout /t 3 /nobreak > nul

echo.
echo ========================================
echo iOS Design Features to Test:
echo ========================================
echo.
echo [Header]
echo ✓ Glassmorphism header with blur effect
echo ✓ Live data indicator with green pulse
echo ✓ Real-time clock display
echo.
echo [Map Widget]
echo ✓ Rounded card with glassmorphism
echo ✓ Live position indicator
echo ✓ Smooth hover effects
echo.
echo [Bus List Widget]
echo ✓ iPhone-style cards with gradients
echo ✓ Pill-shaped bus number badges
echo ✓ Animated ETA with gradient text
echo ✓ Status tags with colors
echo ✓ Hover animations (scale + shadow)
echo.
echo [Sidebar Widget]
echo ✓ Bus details in gradient cards
echo ✓ Modern icon design
echo ✓ Empty state with illustration
echo.
echo [Animations]
echo ✓ Pulse effects on live indicators
echo ✓ Smooth transitions on hover
echo ✓ Gradient text animations
echo ✓ Card lift effects
echo.
echo Navigate to: http://localhost:8080/live
echo.
echo Press any key to exit...
pause > nul