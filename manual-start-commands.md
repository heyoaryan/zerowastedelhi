# Manual Start Commands for Zero Waste Delhi

## Option 1: PowerShell Script
```powershell
.\start-on-port-5000.ps1
```

## Option 2: Manual Commands (PowerShell)

### Start Backend:
```powershell
cd backend
$env:PORT = "5000"
npm run dev
```

### Start Frontend (in new terminal):
```powershell
npm run dev
```

## Option 3: Manual Commands (CMD)

### Start Backend:
```cmd
cd backend
set PORT=5000
npm run dev
```

### Start Frontend (in new terminal):
```cmd
npm run dev
```

## Verification Commands

### Check if ports are in use:
```powershell
Get-NetTCPConnection -LocalPort 5000
Get-NetTCPConnection -LocalPort 5173
```

### Test backend health:
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/health"
```

### Test location detection:
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/location/info?latitude=28.6315&longitude=77.2167"
```

## Quick Debug:
```powershell
node debug-location-port-5000.js
```