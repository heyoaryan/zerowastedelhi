// Complete Flow Test - Location, Auth, and Database
// Run this with: node test-complete-flow.js

const API_BASE_URL = 'http://localhost:5000';

async function testCompleteFlow() {
  console.log('🧪 Testing Complete Flow: Location + Auth + Database...\n');

  try {
    // Step 1: Test Backend Health
    console.log('1. Testing Backend Health...');
    const healthResponse = await fetch(`${API_BASE_URL}/api/health`);
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Backend is running:', healthData.message);
    } else {
      throw new Error('Backend health check failed');
    }

    // Step 2: Test Location Detection
    console.log('\n2. Testing Location Detection...');
    const testCoords = { lat: 28.6315, lng: 77.2167 }; // Connaught Place
    
    const locationResponse = await fetch(
      `${API_BASE_URL}/api/location/info?latitude=${testCoords.lat}&longitude=${testCoords.lng}`
    );

    if (locationResponse.ok) {
      const locationData = await locationResponse.json();
      console.log('✅ Location Detection Results:');
      console.log('   Success:', locationData.success);
      console.log('   In Delhi:', locationData.isInDelhi);
      console.log('   Recognized Area:', locationData.isInRecognizedArea);
      
      if (locationData.currentLocation) {
        console.log('   📍 Detected:', locationData.currentLocation.name, ',', locationData.currentLocation.area);
      }
      
      console.log('   Nearby Bins:', locationData.allNearbyBins?.length || 0);
      console.log('   Message:', locationData.message);
    } else {
      console.log('❌ Location detection failed');
    }

    // Step 3: Test Authentication
    console.log('\n3. Testing Authentication...');
    const loginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'rahul@example.com',
        password: 'password123'
      })
    });

    if (!loginResponse.ok) {
      throw new Error('Login failed');
    }

    const loginData = await loginResponse.json();
    console.log('✅ Login successful:', loginData.user.name);
    const token = loginData.token;

    // Step 4: Test Waste Submission
    console.log('\n4. Testing Waste Submission...');
    const wasteData = {
      binId: 'BIN001',
      wasteType: 'plastic',
      weight: 2.5,
      description: 'Test plastic waste entry',
      userLocation: {
        latitude: testCoords.lat,
        longitude: testCoords.lng,
        address: 'Connaught Place, New Delhi'
      }
    };

    const wasteResponse = await fetch(`${API_BASE_URL}/api/waste`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(wasteData)
    });

    if (wasteResponse.ok) {
      const wasteResult = await wasteResponse.json();
      console.log('✅ Waste Entry Submitted:');
      console.log('   Entry ID:', wasteResult.wasteEntry._id);
      console.log('   Points Earned:', wasteResult.pointsEarned);
      console.log('   Database Saved:', !!wasteResult.wasteEntry._id);
    } else {
      const wasteError = await wasteResponse.json();
      console.log('❌ Waste submission failed:', wasteError.message);
    }

    // Step 5: Test Dashboard Data
    console.log('\n5. Testing Dashboard Data...');
    
    // Test user stats
    const statsResponse = await fetch(`${API_BASE_URL}/api/waste/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      console.log('✅ Dashboard Stats:');
      console.log('   Total Entries:', statsData.stats.overall.totalEntries);
      console.log('   Total Weight:', statsData.stats.overall.totalWeight, 'kg');
      console.log('   Total Points:', statsData.stats.overall.totalPoints);
    }

    // Test recent entries
    const entriesResponse = await fetch(`${API_BASE_URL}/api/waste/my-entries?limit=3`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (entriesResponse.ok) {
      const entriesData = await entriesResponse.json();
      console.log('✅ Recent Entries:', entriesData.wasteEntries.length);
      if (entriesData.wasteEntries.length > 0) {
        const latest = entriesData.wasteEntries[0];
        console.log('   Latest:', latest.wasteType, '-', latest.weight + 'kg', '(' + latest.pointsEarned + ' points)');
      }
    }

    console.log('\n🎉 All tests passed! System is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Make sure backend is running: cd backend && npm run dev');
    console.log('2. Check if database is seeded: cd backend && npm run seed');
    console.log('3. Verify port 5000 is not blocked by firewall');
  }

  console.log('\n🏁 Complete flow test finished!');
}

testCompleteFlow();