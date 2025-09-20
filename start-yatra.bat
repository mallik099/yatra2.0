@echo off
echo.
echo ========================================
echo    🚍 YATRA - Bus Tracking App
echo ========================================
echo.
echo Checking app status...
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo ❌ Dependencies not found. Installing...
    npm install
    if errorlevel 1 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
    echo ✅ Dependencies installed successfully
)

REM Build the app to check for errors
echo.
echo 🔨 Building app...
npm run build
if errorlevel 1 (
    echo ❌ Build failed. Please check the errors above.
    pause
    exit /b 1
)

echo ✅ Build successful!
echo.
echo 🚀 Starting development server...
echo.
echo The app will open at: http://localhost:8080
echo Press Ctrl+C to stop the server
echo.

REM Start the development server
npm run dev