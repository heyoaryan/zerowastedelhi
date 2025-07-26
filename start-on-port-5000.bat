@echo off
title Zero Waste Delhi - Port 5000 Setup
color 0A

echo ========================================
echo   Zero Waste Delhi - Port 5000 Setup
echo ========================================
echo.

echo [1/5] Killing any processes on port 5000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000') do taskkill /f /pid %%a 2>nul
timeout /t 2 /nobreak > nul

echo [2/5] Killing any processes on port 5173...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173') do taskkill /f /pid %%a 2>nul
timeout /t 2 /nobreak > nul

echo [3/5] Starting backend on port 5000...
cd backend
start "Backend Server - Port 5000" cmd /k "echo Backend starting on port 5000... && set PORT=5000 && npm run dev"
echo Backend starting in new window...
timeout /t 8 /nobreak > nul

echo [4/5] Testing backend connection...
cd ..
node check-ports.js
timeout /t 3 /nobreak > nul

echo [5/5] Starting frontend...
start "Frontend Server" cmd /k "echo Frontend starting... && npm run dev"
echo Frontend starting in new window...
echo.

echo ========================================
echo   Servers Started!
echo ========================================
echo.
echo ✅ Backend: http://localhost:5000
echo ✅ Frontend: http://localhost:5173
echo.
echo 🧪 Test URLs:
echo   Health: http://localhost:5000/api/health
echo   Location: http://localhost:5000/api/location/info?latitude=28.6315^&longitude=77.2167
echo   Simple Waste: http://localhost:5000/api/simple-waste/health
echo.
echo 📋 If location is still wrong:
echo   1. Clear browser cache
echo   2. Try incognito mode
echo   3. Check browser location permissions
echo   4. Disable VPN if using one
echo.
echo Press any key to close...
pause > nul