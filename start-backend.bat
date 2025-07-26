@echo off
echo Starting Zero Waste Delhi Backend Server...
echo.

cd backend

echo Checking if MongoDB is running...
echo If MongoDB is not running, please start it first.
echo.

echo Installing dependencies...
call npm install

echo.
echo Starting backend server on port 5000...
echo Press Ctrl+C to stop the server
echo.

call npm run dev