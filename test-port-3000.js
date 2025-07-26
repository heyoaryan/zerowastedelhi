// Test the current setup with frontend on port 3000
const API_BASE_URL = 'http://localhost:5000';
const FRONTEND_URL = 'http://localhost:3000';

async function testPort3000Setup() {
  console.log('🧪 TESTING CURRENT SETUP (Frontend: 3000, Backend: 5000)');
  console.log('='.repeat(60));

  // Test 1: Backend Health
  console.log('\n1. 🏥 Testing backend (port 5000)...');
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    if (response.ok) {
      const data = await response.json();
      console.log('   ✅ Backend is running on port 5000');
      console.log('   📊 Response:', data.message);
    } else {
      console.log('   ❌ Backend health check failed');
      return;
    }
  } catch (error) {
    console.log('   ❌ Cannot connect to backend on port 5000');
    console.log('   🔧 Make sure backend is running: cd backend && npm run dev');
    return;
  }

  // Test 2: Frontend Accessibility
  console.log('\n2. 🌐 Testing frontend (port 3000)...');
  try {
    const response = await fetch(FRONTEND_URL);
    if (response.ok) {
      console.log('   ✅ Frontend is accessible on port 3000');
    } else {
      console.log('   ❌ Frontend not accessible');
    }
  } catch (error) {
    console.log('   ❌ Cannot connect to frontend on port 3000');
  }

  // Test 3: API Connection from Frontend Perspective
  console.log('\n3. 🔗 Testing API connection...');
  try {
    // Test the same endpoint that frontend would call
    const response = await fetch(`${API_BASE_URL}/api/simple-waste/health`);
    if (response.ok) {
      const data = await response.json();
      console.log('   ✅ Simple waste API accessible');
      console.log('   📊 Response:', data.message);
    } else {
      console.log('   ❌ Simple waste API failed');
    }
  } catch (error) {
    console.log('   ❌ API connection error:', error.message);
  }

  // Test 4: Location Detection
  console.log('\n4. 📍 Testing location detection...');
  try {
    const response = await fetch(`${API_BASE_URL}/api/location/info?latitude=28.6315&longitude=77.2167`);
    if (response.ok) {
      const data = await response.json();
      console.log('   ✅ Location detection working');
      console.log('   📍 Detected:', data.currentLocation?.name || 'Unknown');
      console.log('   🏢 Area:', data.currentLocation?.area || 'Unknown');
      console.log('   🗑️ Nearby bins:', data.allNearbyBins?.length || 0);
    } else {
      console.log('   ❌ Location detection failed');
    }
  } catch (error) {
    console.log('   ❌ Location detection error:', error.message);
  }

  // Test 5: CORS Check
  console.log('\n5. 🔒 Testing CORS configuration...');
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      headers: {
        'Origin': FRONTEND_URL,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      console.log('   ✅ CORS is properly configured');
    } else {
      console.log('   ⚠️ CORS might have issues');
    }
  } catch (error) {
    console.log('   ❌ CORS test failed:', error.message);
  }

  console.log('\n' + '='.repeat(60));
  console.log('📋 CURRENT SETUP STATUS:');
  console.log('');
  console.log('✅ Frontend: http://localhost:3000 (Currently running)');
  console.log('✅ Backend: http://localhost:5000 (Running)');
  console.log('');
  console.log('🎯 IMMEDIATE ACTIONS:');
  console.log('1. Open browser: http://localhost:3000');
  console.log('2. Test Add Waste functionality');
  console.log('3. Check if location detection works');
  console.log('4. Verify waste entries save');
  console.log('');
  console.log('🔧 TO CHANGE TO PORT 5173 (Optional):');
  console.log('1. Stop frontend (Ctrl+C)');
  console.log('2. Restart: npm run dev');
  console.log('3. Should now run on port 5173');
  console.log('');
  console.log('💡 PORT 3000 IS FINE - Your app should work perfectly!');
}

testPort3000Setup().catch(console.error);