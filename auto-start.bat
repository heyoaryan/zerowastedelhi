@echo off
title Zero Waste Delhi - Auto Start
color 0A

echo ========================================
echo    Zero Waste Delhi - Auto Start
echo ========================================
echo.

echo [1/4] Checking MongoDB...
echo Please make sure MongoDB is running!
echo If not, start MongoDB service first.
echo.
pause

echo [2/4] Starting Backend Server...
cd backend
start "Backend Server" cmd /k "npm run dev"
echo Backend server starting in new window...
echo.

echo [3/4] Waiting for backend to initialize...
timeout /t 10 /nobreak > nul

echo [4/4] Starting Frontend...
cd ..
start "Frontend Server" cmd /k "npm run dev"
echo Frontend server starting in new window...
echo.

echo ========================================
echo    All services started!
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this window...
pause > nul