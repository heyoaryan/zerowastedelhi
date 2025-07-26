// Test the simple waste entry system
const API_BASE_URL = 'http://localhost:5000';

async function testSimpleWasteSystem() {
  console.log('🧪 TESTING SIMPLE WASTE ENTRY SYSTEM');
  console.log('='.repeat(50));

  // Test 1: Health check
  console.log('\n1. 🏥 Testing simple waste system health...');
  try {
    const healthResponse = await fetch(`${API_BASE_URL}/api/simple-waste/health`);
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('   ✅ Simple waste system is running');
      console.log('   📊 Response:', healthData.message);
    } else {
      console.log('   ❌ Simple waste system health check failed');
      return;
    }
  } catch (error) {
    console.log('   ❌ Cannot connect to simple waste system');
    console.log('   🔧 Make sure backend is running: cd backend && npm run dev');
    return;
  }

  // Test 2: Simple authentication
  console.log('\n2. 🔐 Testing simple authentication...');
  const testUser = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    action: 'register'
  };

  try {
    const authResponse = await fetch(`${API_BASE_URL}/api/simple-waste/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });

    if (authResponse.ok) {
      const authData = await authResponse.json();
      console.log('   ✅ Simple authentication working');
      console.log('   👤 User:', authData.user.name);
      console.log('   🆔 Session ID:', authData.user.sessionId);
      testUser.sessionId = authData.user.sessionId;
    } else {
      console.log('   ❌ Simple authentication failed');
      return;
    }
  } catch (error) {
    console.log('   ❌ Authentication error:', error.message);
    return;
  }

  // Test 3: Add waste entry
  console.log('\n3. 🗑️ Testing waste entry submission...');
  const wasteEntry = {
    userName: testUser.name,
    userEmail: testUser.email,
    wasteType: 'plastic',
    weight: 2.5,
    description: 'Test plastic waste entry',
    userLocation: {
      latitude: 28.6315,
      longitude: 77.2167,
      address: 'Test Location, Delhi'
    },
    sessionId: testUser.sessionId
  };

  try {
    const wasteResponse = await fetch(`${API_BASE_URL}/api/simple-waste/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(wasteEntry)
    });

    if (wasteResponse.ok) {
      const wasteData = await wasteResponse.json();
      console.log('   ✅ Waste entry submitted successfully');
      console.log('   🆔 Entry ID:', wasteData.data.entryId);
      console.log('   🎯 Points earned:', wasteData.data.pointsEarned);
      console.log('   📍 Location detected:', wasteData.data.location.detected);
      console.log('   💾 Database saved:', wasteData.success);
      
      if (wasteData.user) {
        console.log('   📊 User stats updated:');
        console.log('      Total entries:', wasteData.user.totalEntries);
        console.log('      Total points:', wasteData.user.totalPoints);
        console.log('      Total weight:', wasteData.user.totalWeight);
      }
    } else {
      const errorData = await wasteResponse.json();
      console.log('   ❌ Waste entry failed:', errorData.message);
      return;
    }
  } catch (error) {
    console.log('   ❌ Waste entry error:', error.message);
    return;
  }

  // Test 4: Fetch user entries
  console.log('\n4. 📊 Testing user entries retrieval...');
  try {
    const entriesResponse = await fetch(
      `${API_BASE_URL}/api/simple-waste/entries?userEmail=${testUser.email}`
    );

    if (entriesResponse.ok) {
      const entriesData = await entriesResponse.json();
      console.log('   ✅ User entries retrieved successfully');
      console.log('   📝 Total entries:', entriesData.entries.length);
      console.log('   📊 Stats:', entriesData.stats);
      
      if (entriesData.entries.length > 0) {
        const latestEntry = entriesData.entries[0];
        console.log('   📄 Latest entry:');
        console.log('      Type:', latestEntry.wasteType);
        console.log('      Weight:', latestEntry.weight, 'kg');
        console.log('      Points:', latestEntry.pointsEarned);
        console.log('      Location:', latestEntry.location.detectedLocation.name);
      }
    } else {
      console.log('   ❌ Failed to retrieve user entries');
    }
  } catch (error) {
    console.log('   ❌ Entries retrieval error:', error.message);
  }

  // Test 5: Fetch user stats
  console.log('\n5. 📈 Testing user stats retrieval...');
  try {
    const statsResponse = await fetch(
      `${API_BASE_URL}/api/simple-waste/stats?userEmail=${testUser.email}`
    );

    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      console.log('   ✅ User stats retrieved successfully');
      console.log('   👤 User:', statsData.user?.name);
      console.log('   📊 Stats:');
      console.log('      Total entries:', statsData.stats.totalEntries);
      console.log('      Total weight:', statsData.stats.totalWeight, 'kg');
      console.log('      Total points:', statsData.stats.totalPoints);
      console.log('      Carbon saved:', statsData.stats.totalCarbonSaved, 'kg CO2');
    } else {
      console.log('   ❌ Failed to retrieve user stats');
    }
  } catch (error) {
    console.log('   ❌ Stats retrieval error:', error.message);
  }

  console.log('\n' + '='.repeat(50));
  console.log('🎉 SIMPLE WASTE SYSTEM TEST COMPLETE!');
  console.log('\n✅ If all tests passed, your waste entry system is working:');
  console.log('   - No complex authentication required');
  console.log('   - Waste entries save to separate database');
  console.log('   - User stats are tracked');
  console.log('   - Location detection works');
  console.log('\n🚀 Now update your frontend to use the simple system!');
  console.log('   Frontend should call: /api/simple-waste/add');
  console.log('   No authentication headers needed');
}

testSimpleWasteSystem().catch(console.error);