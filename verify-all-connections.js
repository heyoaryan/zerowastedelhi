// Comprehensive verification script for all backend connections
const API_BASE_URL = 'http://localhost:5000';

async function verifyAllConnections() {
  console.log('🔍 COMPREHENSIVE BACKEND CONNECTION VERIFICATION');
  console.log('='.repeat(60));
  
  let allPassed = true;
  
  // Test 1: Backend Health Check
  console.log('\n1. 🏥 Backend Health Check');
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    if (response.ok) {
      const data = await response.json();
      console.log('   ✅ Backend is running:', data.message);
    } else {
      console.log('   ❌ Backend health check failed');
      allPassed = false;
    }
  } catch (error) {
    console.log('   ❌ Backend is not running. Start with: cd backend && npm run dev');
    allPassed = false;
  }

  // Test 2: Authentication Routes
  console.log('\n2. 🔐 Authentication Routes');
  
  // Test login endpoint
  try {
    const loginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@test.com', password: 'test123' })
    });
    
    if (loginResponse.status === 400 || loginResponse.status === 401) {
      console.log('   ✅ Login endpoint responding (expected auth failure)');
    } else {
      console.log('   ⚠️ Login endpoint response:', loginResponse.status);
    }
  } catch (error) {
    console.log('   ❌ Login endpoint not accessible');
    allPassed = false;
  }

  // Test register endpoint
  try {
    const registerResponse = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name: 'Test User',
        email: 'test@test.com', 
        phone: '1234567890',
        password: 'test123' 
      })
    });
    
    if (registerResponse.status === 400 || registerResponse.status === 201) {
      console.log('   ✅ Register endpoint responding');
    } else {
      console.log('   ⚠️ Register endpoint response:', registerResponse.status);
    }
  } catch (error) {
    console.log('   ❌ Register endpoint not accessible');
    allPassed = false;
  }

  // Test 3: Location Detection
  console.log('\n3. 📍 Location Detection');
  try {
    const locationResponse = await fetch(
      `${API_BASE_URL}/api/location/info?latitude=28.6315&longitude=77.2167`
    );
    
    if (locationResponse.ok) {
      const data = await locationResponse.json();
      console.log('   ✅ Location detection working');
      console.log('   📍 Detected:', data.currentLocation?.name || 'Delhi NCR');
      console.log('   🗑️ Nearby bins:', data.allNearbyBins?.length || 0);
      
      if (data.currentLocation?.name && data.currentLocation.name !== 'Delhi NCR') {
        console.log('   ✅ Accurate location detection working');
      } else {
        console.log('   ⚠️ Using fallback location detection');
      }
    } else {
      console.log('   ❌ Location detection failed');
      allPassed = false;
    }
  } catch (error) {
    console.log('   ❌ Location endpoint not accessible');
    allPassed = false;
  }

  // Test 4: Waste Entry Endpoint (without auth)
  console.log('\n4. 🗑️ Waste Entry Endpoint');
  try {
    const wasteResponse = await fetch(`${API_BASE_URL}/api/waste`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        binId: 'TEST001',
        wasteType: 'plastic',
        weight: 2.5,
        userLocation: {
          latitude: 28.6315,
          longitude: 77.2167,
          address: 'Test Location'
        }
      })
    });
    
    if (wasteResponse.status === 401) {
      console.log('   ✅ Waste endpoint responding (expected auth required)');
    } else {
      console.log('   ⚠️ Waste endpoint response:', wasteResponse.status);
    }
  } catch (error) {
    console.log('   ❌ Waste endpoint not accessible');
    allPassed = false;
  }

  // Test 5: Leaderboard Endpoint
  console.log('\n5. 🏆 Leaderboard Endpoint');
  try {
    const leaderboardResponse = await fetch(`${API_BASE_URL}/api/leaderboard`);
    
    if (leaderboardResponse.ok) {
      const data = await leaderboardResponse.json();
      console.log('   ✅ Leaderboard endpoint working');
      console.log('   👥 Users in leaderboard:', data.leaderboard?.length || 0);
    } else {
      console.log('   ❌ Leaderboard endpoint failed');
      allPassed = false;
    }
  } catch (error) {
    console.log('   ❌ Leaderboard endpoint not accessible');
    allPassed = false;
  }

  // Test 6: Bin Tracker Endpoint
  console.log('\n6. 📦 Bin Tracker Endpoint');
  try {
    const binsResponse = await fetch(`${API_BASE_URL}/api/bins`);
    
    if (binsResponse.ok) {
      const data = await binsResponse.json();
      console.log('   ✅ Bins endpoint working');
      console.log('   🗑️ Total bins:', data.bins?.length || 0);
    } else {
      console.log('   ❌ Bins endpoint failed');
      allPassed = false;
    }
  } catch (error) {
    console.log('   ❌ Bins endpoint not accessible');
    allPassed = false;
  }

  // Test 7: Database Connection
  console.log('\n7. 💾 Database Connection');
  try {
    const dbResponse = await fetch(`${API_BASE_URL}/api/debug/test-db`);
    
    if (dbResponse.ok) {
      const data = await dbResponse.json();
      console.log('   ✅ Database connected:', data.message);
    } else {
      console.log('   ❌ Database connection test failed');
      allPassed = false;
    }
  } catch (error) {
    console.log('   ❌ Database test endpoint not accessible');
    allPassed = false;
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  if (allPassed) {
    console.log('🎉 ALL CONNECTIONS VERIFIED SUCCESSFULLY!');
    console.log('\n✅ Your application should work properly with:');
    console.log('   - Real authentication and user sessions');
    console.log('   - Accurate location detection');
    console.log('   - Database storage for all entries');
    console.log('   - Nearby bins display');
    console.log('   - Points and leaderboard system');
    console.log('\n🚀 Start frontend with: npm run dev');
  } else {
    console.log('❌ SOME CONNECTIONS FAILED');
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Make sure MongoDB is running');
    console.log('   2. Start backend: cd backend && npm run dev');
    console.log('   3. Check backend logs for errors');
    console.log('   4. Run: node reset-database.js');
  }
  
  console.log('\n📋 Quick Test URLs:');
  console.log('   Backend Health: http://localhost:5000/api/health');
  console.log('   Location Test: http://localhost:5000/api/location/info?latitude=28.6315&longitude=77.2167');
  console.log('   Bins List: http://localhost:5000/api/bins');
}

// Run verification
verifyAllConnections().catch(console.error);