@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo Freeing port 3000 if something is stuck...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000.*LISTENING"') do (
  taskkill /F /PID %%a >nul 2>&1
)

echo Starting server... Browser will open in a few seconds.
start "" cmd /c "ping -n 8 127.0.0.1>nul && start http://127.0.0.1:3000/"

call npm run dev
pause
