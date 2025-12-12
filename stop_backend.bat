@echo off
for /f "tokens=*" %%a in ('powershell -Command "Get-WmiObject Win32_Process -Filter \"CommandLine LIKE \'%uvicorn%\backend.app.main:app%\'%\"" | Select-Object -ExpandProperty ProcessId"') do (
    taskkill /PID %%a /F
)
echo Backend process(es) stopped.
