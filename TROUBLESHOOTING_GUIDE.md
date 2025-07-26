# Dashboard Error Troubleshooting Guide

## Error: "Unable to Load Dashboard Data"

This error occurs when the frontend cannot connect to the backend API. Here's how to fix it:

## Step 1: Check Backend Server Status

### Start Backend Server
```bash
cd backend
npm run dev
```

**Expected Output:**
```
🚀 Zero Waste Delhi API Server running on port 5000
📊 Environment: development
🔗 Health check: http://localhost:5000/api/health
MongoDB Connected: localhost:27017
```

### Test Backend Health
Open browser and go to: `http://localhost:5000/api/health`

**Expected Response:**
```json
{
  "success": true,
  "message": "Zero Waste Delhi API is running",
  "timestamp": "2024-01-XX...",
  "environment": "development"
}
```

## Step 2: Check Database Connection

### Ensure MongoDB is Running
```bash
# Windows (if using MongoDB locally)
net start MongoDB

# Or check if MongoDB service is running
services.msc -> look for MongoDB
```

### Seed Database (if empty)
```bash
cd backend
npm run seed
```

**Expected Output:**
```
🌱 Starting database seeding...
✅ Created 5 users
✅ Created 30 waste bins
✅ Created XX waste entries
🎉 Database seeding completed successfully!
```

## Step 3: Check Authentication Token

The error might be due to missing or invalid authentication token.

### Clear Browser Storage
1. Open browser Developer Tools (F12)
2. Go to Application/Storage tab
3. Clear localStorage and sessionStorage
4. Refresh page and login again

### Test Login Process
1. Go to login page
2. Use test credentials: `rahul@example.com` / `password123`
3. Check if login is successful
4. Verify token is stored in localStorage

## Step 4: Check API Endpoints

### Test API Endpoints Manually
Open browser console and run:

```javascript
// Check if token exists
console.log('Token:', localStorage.getItem('token'));

// Test API call
fetch('http://localhost:5000/api/waste/stats', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => console.log('API Response:', data))
.catch(err => console.error('API Error:', err));
```

## Step 5: Check CORS Configuration

If you see CORS errors in browser console, check backend CORS settings in `backend/server.js`:

```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com'] 
    : ['http://localhost:3000', 'http://localhost:5173'], // <- Make sure 5173 is included
  credentials: true
}));
```

## Step 6: Check Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
```

### Backend (backend/.env)
```
MONGODB_URI=mongodb://localhost:27017/zero_waste_delhi_app
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

## Common Solutions

### Solution 1: Restart Everything
```bash
# Stop all servers
# Then restart backend
cd backend
npm run dev

# In new terminal, restart frontend
npm run dev
```

### Solution 2: Clear All Data and Restart
```bash
# Clear browser data (localStorage, cookies)
# Drop database and reseed
cd backend
# If using MongoDB Compass, drop the database
npm run seed
```

### Solution 3: Check Network/Firewall
- Ensure no firewall is blocking port 5000
- Check if antivirus is interfering
- Try accessing `http://localhost:5000/api/health` directly

## Quick Fix Commands

### Complete Reset
```bash
# 1. Stop all servers
# 2. Clear browser storage
# 3. Restart backend
cd backend
npm run seed
npm run dev

# 4. In new terminal, restart frontend
npm run dev

# 5. Login again with: rahul@example.com / password123
```

## Expected Working Flow

1. **Backend Running**: `http://localhost:5000/api/health` returns success
2. **Database Connected**: MongoDB connection successful
3. **Data Seeded**: Sample users and waste data created
4. **Frontend Running**: `http://localhost:5173` loads
5. **Login Successful**: Token stored in localStorage
6. **Dashboard Loads**: Real data displayed without errors

## Debug Information to Check

### Browser Console Errors
Look for:
- Network errors (failed to fetch)
- CORS errors
- 401 Unauthorized errors
- 500 Internal server errors

### Backend Console Logs
Look for:
- Database connection errors
- Authentication errors
- API endpoint errors
- Missing environment variables

### Network Tab (Browser DevTools)
Check:
- API requests are being made to correct URLs
- Response status codes
- Request headers include Authorization token
- Response data structure

## Still Having Issues?

If the problem persists:

1. **Check exact error message** in browser console
2. **Check backend logs** for specific errors
3. **Verify all services are running** (MongoDB, Backend, Frontend)
4. **Test with fresh browser session** (incognito mode)
5. **Ensure all dependencies are installed** (`npm install` in both directories)

The most common cause is either:
- Backend server not running
- MongoDB not connected
- Missing authentication token
- CORS configuration issues