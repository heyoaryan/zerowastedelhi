@echo off
echo Restarting Zero Waste Delhi Backend...
echo.

echo Stopping any existing backend processes...
taskkill /f /im node.exe 2>nul

echo Waiting 2 seconds...
timeout /t 2 /nobreak >nul

echo Starting backend server...
cd backend
start "Zero Waste Delhi Backend" cmd /k "npm run dev"

echo.
echo Backend restart initiated!
echo Check the new window for backend status.