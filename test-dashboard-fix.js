// Test dashboard data fix
const API_BASE_URL = 'http://localhost:5000';

async function testDashboardFix() {
  console.log('📊 TESTING DASHBOARD DATA FIX');
  console.log('='.repeat(50));

  const testUser = {
    userName: 'Dashboard Fix Test',
    userEmail: 'dashboardfix@test.com',
    wasteType: 'plastic',
    weight: 2.5,
    description: 'Dashboard fix test entry',
    userLocation: {
      latitude: 28.6315,
      longitude: 77.2167,
      address: 'Test Location'
    },
    sessionId: Date.now().toString()
  };

  // Step 1: Add waste entry
  console.log('\n1. 🗑️ Adding test waste entry...');
  
  try {
    const addResponse = await fetch(`${API_BASE_URL}/api/simple-waste/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });

    if (addResponse.ok) {
      const addData = await addResponse.json();
      console.log('   ✅ Entry added successfully');
      console.log('   🆔 Entry ID:', addData.data?.entryId);
      console.log('   🎯 Points:', addData.data?.pointsEarned);
      console.log('   📍 Location:', addData.data?.location?.detected);
    } else {
      console.log('   ❌ Failed to add entry');
      return;
    }
  } catch (error) {
    console.log('   ❌ Error adding entry:', error.message);
    return;
  }

  // Step 2: Test entries endpoint
  console.log('\n2. 📝 Testing entries endpoint...');
  
  try {
    const entriesResponse = await fetch(`${API_BASE_URL}/api/simple-waste/entries?userEmail=${testUser.userEmail}`);
    
    if (entriesResponse.ok) {
      const entriesData = await entriesResponse.json();
      console.log('   ✅ Entries fetched successfully');
      console.log('   📊 Response structure:', {
        success: entriesData.success,
        entriesCount: entriesData.entries?.length || 0,
        hasStats: !!entriesData.stats
      });
      
      if (entriesData.entries && entriesData.entries.length > 0) {
        const entry = entriesData.entries[0];
        console.log('   📄 Latest entry details:');
        console.log('      ID:', entry._id);
        console.log('      Type:', entry.wasteType);
        console.log('      Weight:', entry.weight);
        console.log('      Points:', entry.pointsEarned);
        console.log('      Location:', entry.location?.detectedLocation?.name);
        console.log('      Submitted:', entry.submittedAt);
      }
      
      if (entriesData.stats) {
        console.log('   📊 Stats from entries:');
        console.log('      Total entries:', entriesData.stats.totalEntries);
        console.log('      Total weight:', entriesData.stats.totalWeight);
        console.log('      Total points:', entriesData.stats.totalPoints);
      }
    } else {
      console.log('   ❌ Entries fetch failed:', entriesResponse.status);
    }
  } catch (error) {
    console.log('   ❌ Entries fetch error:', error.message);
  }

  // Step 3: Test stats endpoint
  console.log('\n3. 📈 Testing stats endpoint...');
  
  try {
    const statsResponse = await fetch(`${API_BASE_URL}/api/simple-waste/stats?userEmail=${testUser.userEmail}`);
    
    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      console.log('   ✅ Stats fetched successfully');
      console.log('   📊 Stats data:', statsData.stats);
    } else {
      console.log('   ❌ Stats fetch failed:', statsResponse.status);
    }
  } catch (error) {
    console.log('   ❌ Stats fetch error:', error.message);
  }

  // Step 4: Simulate frontend localStorage
  console.log('\n4. 💾 Simulating frontend localStorage...');
  
  const mockUser = {
    id: Date.now().toString(),
    name: testUser.userName,
    email: testUser.userEmail,
    totalWaste: 0,
    rewardPoints: 0
  };
  
  console.log('   📝 Mock user data:', mockUser);
  console.log('   🔑 Session ID:', testUser.sessionId);
  console.log('');
  console.log('   💡 To test in browser, run this in console:');
  console.log(`   localStorage.setItem('user', '${JSON.stringify(mockUser)}');`);
  console.log(`   localStorage.setItem('sessionId', '${testUser.sessionId}');`);
  console.log('   window.location.reload();');

  console.log('\n' + '='.repeat(50));
  console.log('📋 DASHBOARD FIX TEST SUMMARY:');
  console.log('');
  console.log('✅ If all tests passed:');
  console.log('   - Waste entries are being saved');
  console.log('   - API endpoints are working');
  console.log('   - Dashboard should show data');
  console.log('');
  console.log('🌐 Next steps:');
  console.log('   1. Set localStorage in browser (see commands above)');
  console.log('   2. Go to dashboard page');
  console.log('   3. Check if data appears');
  console.log('   4. Add new waste entry');
  console.log('   5. Verify dashboard updates');
}

testDashboardFix().catch(console.error);