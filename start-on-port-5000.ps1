# Zero Waste Delhi - Port 5000 Setup (PowerShell)
Write-Host "========================================" -ForegroundColor Green
Write-Host "   Zero Waste Delhi - Port 5000 Setup" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "[1/5] Killing any processes on port 5000..." -ForegroundColor Yellow
try {
    $processes5000 = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
    if ($processes5000) {
        $processes5000 | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }
        Write-Host "   ✅ Killed processes on port 5000" -ForegroundColor Green
    } else {
        Write-Host "   ℹ️ No processes found on port 5000" -ForegroundColor Cyan
    }
} catch {
    Write-Host "   ⚠️ Could not check port 5000" -ForegroundColor Yellow
}

Start-Sleep -Seconds 2

Write-Host "[2/5] Killing any processes on port 5173..." -ForegroundColor Yellow
try {
    $processes5173 = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
    if ($processes5173) {
        $processes5173 | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }
        Write-Host "   ✅ Killed processes on port 5173" -ForegroundColor Green
    } else {
        Write-Host "   ℹ️ No processes found on port 5173" -ForegroundColor Cyan
    }
} catch {
    Write-Host "   ⚠️ Could not check port 5173" -ForegroundColor Yellow
}

Start-Sleep -Seconds 2

Write-Host "[3/5] Starting backend on port 5000..." -ForegroundColor Yellow
Set-Location backend
$env:PORT = "5000"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Backend starting on port 5000...' -ForegroundColor Green; npm run dev" -WindowStyle Normal
Write-Host "   ✅ Backend starting in new window..." -ForegroundColor Green
Set-Location ..

Start-Sleep -Seconds 8

Write-Host "[4/5] Testing backend connection..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -TimeoutSec 5 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Backend is running on port 5000" -ForegroundColor Green
    }
} catch {
    Write-Host "   ❌ Backend not responding on port 5000" -ForegroundColor Red
    Write-Host "   🔧 Check the backend window for errors" -ForegroundColor Yellow
}

Write-Host "[5/5] Starting frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Frontend starting...' -ForegroundColor Green; npm run dev" -WindowStyle Normal
Write-Host "   ✅ Frontend starting in new window..." -ForegroundColor Green

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   Servers Started!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "✅ Backend: http://localhost:5000" -ForegroundColor Green
Write-Host "✅ Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host ""
Write-Host "🧪 Test URLs:" -ForegroundColor Cyan
Write-Host "   Health: http://localhost:5000/api/health" -ForegroundColor White
Write-Host "   Location: http://localhost:5000/api/location/info?latitude=28.6315&longitude=77.2167" -ForegroundColor White
Write-Host "   Simple Waste: http://localhost:5000/api/simple-waste/health" -ForegroundColor White
Write-Host ""
Write-Host "📋 If location is still wrong:" -ForegroundColor Yellow
Write-Host "   1. Clear browser cache" -ForegroundColor White
Write-Host "   2. Try incognito mode" -ForegroundColor White
Write-Host "   3. Check browser location permissions" -ForegroundColor White
Write-Host "   4. Disable VPN if using one" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")