// Test script to check if backend is running and database is connected
const API_BASE_URL = 'http://localhost:5000';

async function testSystem() {
  console.log('🧪 Testing Zero Waste Delhi System...\n');

  // Test 1: Backend Health Check
  console.log('1. Testing Backend Health...');
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend is running:', data.message);
    } else {
      console.log('❌ Backend health check failed');
    }
  } catch (error) {
    console.log('❌ Backend is not running. Please start it with: cd backend && npm run dev');
  }

  // Test 2: Database Connection
  console.log('\n2. Testing Database Connection...');
  try {
    const response = await fetch(`${API_BASE_URL}/api/debug/test-db`);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Database connected:', data.message);
    } else {
      console.log('❌ Database connection failed');
    }
  } catch (error) {
    console.log('❌ Cannot test database - backend not running');
  }

  // Test 3: Location API
  console.log('\n3. Testing Location Detection...');
  try {
    const response = await fetch(`${API_BASE_URL}/api/location/info?latitude=28.6315&longitude=77.2167`);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Location detection working:', data.message);
      console.log('   Detected location:', data.currentLocation?.name || 'Delhi NCR');
      console.log('   Available bins:', data.allNearbyBins?.length || 0);
    } else {
      console.log('❌ Location detection failed');
    }
  } catch (error) {
    console.log('❌ Cannot test location - backend not running');
  }

  console.log('\n🏁 System test completed!');
  console.log('\n📋 Next Steps:');
  console.log('1. If backend is not running: cd backend && npm run dev');
  console.log('2. If database is not connected: Make sure MongoDB is running');
  console.log('3. If location is not working: Check backend logs for errors');
  console.log('4. Start frontend: npm run dev');
}

// Run the test
testSystem().catch(console.error);