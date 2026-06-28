@echo off
echo ==============================================
echo 🚀 Starting AI OBE System (Frontend & Backend)
echo ==============================================

:: Start Backend
echo [1/2] Starting FastAPI Backend...
start "OBE Backend" cmd /k "cd backend && .\venv\Scripts\python.exe main.py"

:: Wait for a second
timeout /t 2 /nobreak > nul

:: Start Frontend
echo [2/2] Starting Frontend UI on Port 3000...
start "OBE Frontend" cmd /k "cd frontend && npx serve -l 3000"

echo.
echo ✅ System is booting up!
echo 🌐 Open http://localhost:3000 in your browser.
echo ⚠️  Leave the two black console windows open. Closing them stops the server.
echo ==============================================
