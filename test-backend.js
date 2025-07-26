// Quick Backend Test Script
// Run this with: node test-backend.js

const API_BASE_URL = 'http://localhost:5001';

async function testBackend() {
  console.log('🧪 Testing Backend Connection...\n');

  // Test 1: Health Check
  try {
    console.log('1. Testing Health Endpoint...');
    const healthResponse = await fetch(`${API_BASE_URL}/api/health`);
    const healthData = await healthResponse.json();
    
    if (healthData.success) {
      console.log('✅ Backend is running!');
      console.log(`   Message: ${healthData.message}`);
    } else {
      console.log('❌ Backend health check failed');
    }
  } catch (error) {
    console.log('❌ Cannot connect to backend server');
    console.log('   Make sure backend is running on port 5000');
    console.log('   Run: cd backend && npm run dev');
    return;
  }

  // Test 2: Login Test
  try {
    console.log('\n2. Testing Login...');
    const loginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'rahul@example.com',
        password: 'password123'
      })
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login successful!');
      console.log(`   User: ${loginData.user.name}`);
      console.log(`   Token: ${loginData.token.substring(0, 20)}...`);
      
      // Test 3: Protected Endpoint
      console.log('\n3. Testing Protected Endpoints...');
      const token = loginData.token;
      
      const statsResponse = await fetch(`${API_BASE_URL}/api/waste/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        console.log('✅ Waste stats endpoint working!');
        console.log(`   Total entries: ${statsData.stats.overall.totalEntries}`);
        console.log(`   Total weight: ${statsData.stats.overall.totalWeight} kg`);
      } else {
        console.log('❌ Waste stats endpoint failed');
        console.log(`   Status: ${statsResponse.status}`);
      }

    } else {
      console.log('❌ Login failed');
      console.log(`   Status: ${loginResponse.status}`);
      console.log('   Make sure database is seeded: npm run seed');
    }

  } catch (error) {
    console.log('❌ Login test failed');
    console.log(`   Error: ${error.message}`);
  }

  console.log('\n🏁 Backend test completed!');
  console.log('\nIf all tests pass, the issue might be:');
  console.log('- Frontend not connecting properly');
  console.log('- Authentication token not stored');
  console.log('- CORS configuration');
}

// Run the test
testBackend().catch(console.error);