@echo off
title Zero Waste Delhi - Simple System Setup
color 0A

echo ========================================
echo   Zero Waste Delhi - Simple System
echo ========================================
echo.
echo This will set up a simple waste entry system
echo that works without complex authentication.
echo.
pause

echo [1/4] Stopping any running backend...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak > nul

echo [2/4] Starting backend with simple system...
cd backend
start "Backend Server" cmd /k "echo Simple Waste System Starting... && npm run dev"
echo Backend starting in new window...
timeout /t 8 /nobreak > nul

echo [3/4] Testing simple waste system...
cd ..
node test-simple-waste.js
echo.

echo [4/4] Starting frontend...
start "Frontend Server" cmd /k "echo Frontend Starting... && npm run dev"
echo Frontend starting in new window...
echo.

echo ========================================
echo   Simple System Ready!
echo ========================================
echo.
echo ✅ Backend: http://localhost:5000
echo ✅ Frontend: http://localhost:5173
echo ✅ Simple Waste API: http://localhost:5000/api/simple-waste
echo.
echo 📋 Features:
echo   - No complex authentication
echo   - Separate waste entry database
echo   - Real-time location detection
echo   - User stats tracking
echo.
echo 🧪 Test the system:
echo   1. Go to Add Waste page
echo   2. Fill in waste details
echo   3. Submit (no login required)
echo   4. Check dashboard for entries
echo.
echo Press any key to close...
pause > nul