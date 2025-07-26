@echo off
title Zero Waste Delhi - Complete Setup
color 0B

echo ========================================
echo    Zero Waste Delhi - Complete Setup
echo ========================================
echo.

echo This script will:
echo 1. Install all dependencies
echo 2. Reset and seed the database
echo 3. Start all services
echo.
echo Make sure MongoDB is running before continuing!
echo.
pause

echo [1/5] Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed
echo.

echo [2/5] Installing frontend dependencies...
cd ..
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed
echo.

echo [3/5] Resetting and seeding database...
node reset-database.js
if %errorlevel% neq 0 (
    echo ❌ Failed to reset database
    pause
    exit /b 1
)
echo ✅ Database reset and seeded
echo.

echo [4/5] Starting backend server...
cd backend
start "Backend Server" cmd /k "echo Starting backend server... && npm run dev"
echo ✅ Backend server starting...
echo.

echo [5/5] Waiting and starting frontend...
timeout /t 8 /nobreak > nul
cd ..
start "Frontend Server" cmd /k "echo Starting frontend server... && npm run dev"
echo ✅ Frontend server starting...
echo.

echo ========================================
echo    Setup Complete!
echo ========================================
echo.
echo ✅ Backend: http://localhost:5000/api/health
echo ✅ Frontend: http://localhost:5173
echo.
echo The application should now work properly with:
echo - Real location detection
echo - Database storage
echo - Persistent authentication
echo - Nearby bins display
echo.
echo Press any key to close this window...
pause > nul