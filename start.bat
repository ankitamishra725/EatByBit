@echo off
title EatByBit Launcher
color 0A

echo.
echo  ============================================
echo    EatByBit  ^|  Starting all services...
echo  ============================================
echo.

:: Create MongoDB data folder if it doesn't exist
if not exist "C:\data\db" (
    echo  Creating MongoDB data directory C:\data\db ...
    mkdir "C:\data\db"
)

:: ── 1. MongoDB ───────────────────────────────────
echo  [1/3] Starting MongoDB...
net start MongoDB >nul 2>&1
if %errorlevel% neq 0 (
    echo        Service not found. Running mongod directly...
    start "MongoDB" /min cmd /c "mongod --dbpath C:\data\db"
    timeout /t 3 /nobreak >nul
)
echo        OK - MongoDB on port 27017
echo.

:: ── 2. Backend ───────────────────────────────────
echo  [2/3] Starting Backend...
start "EatByBit - Backend" cmd /k "cd /d "%~dp0server" && node server.js"
timeout /t 3 /nobreak >nul
echo        OK - Backend on http://localhost:5000
echo.

:: ── 3. Frontend ──────────────────────────────────
echo  [3/3] Starting Frontend...
start "EatByBit - Frontend" cmd /k "cd /d "%~dp0client" && npm run dev"
timeout /t 5 /nobreak >nul
echo        OK - Frontend on http://localhost:5173
echo.

:: Open browser
start http://localhost:5173

echo  ============================================
echo    All services running!
echo  ============================================
echo.
echo    Frontend  -^>  http://localhost:5173
echo    Backend   -^>  http://localhost:5000
echo    Database  -^>  mongodb://127.0.0.1:27017/eatbybit
echo.
echo    To stop: close the Backend and Frontend windows
echo  ============================================
echo.
pause