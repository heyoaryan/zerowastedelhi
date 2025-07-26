// Test Waste Entry Submission
// Run this with: node test-waste-entry.js

const API_BASE_URL = 'http://localhost:5001'; // Updated port

async function testWasteEntry() {
  console.log('🧪 Testing Waste Entry Submission...\n');

  try {
    // Step 1: Login to get token
    console.log('1. Logging in...');
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

    if (!loginResponse.ok) {
      console.log('❌ Login failed');
      return;
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Login successful');

    // Step 2: Test waste entry submission
    console.log('\n2. Submitting test waste entry...');
    
    const wasteEntryData = {
      binId: 'BIN001', // Use a bin ID from seeded data
      wasteType: 'plastic',
      weight: 2.5,
      description: 'Test plastic waste entry',
      userLocation: {
        latitude: 28.6315,
        longitude: 77.2167,
        address: 'Connaught Place, New Delhi'
      }
    };

    const wasteResponse = await fetch(`${API_BASE_URL}/api/waste`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(wasteEntryData)
    });

    console.log('Waste submission response status:', wasteResponse.status);

    if (wasteResponse.ok) {
      const wasteData = await wasteResponse.json();
      console.log('✅ Waste entry submitted successfully!');
      console.log(`   Points earned: ${wasteData.pointsEarned}`);
      console.log(`   Entry ID: ${wasteData.wasteEntry._id}`);
    } else {
      const errorData = await wasteResponse.json();
      console.log('❌ Waste entry submission failed');
      console.log(`   Status: ${wasteResponse.status}`);
      console.log(`   Error: ${errorData.message}`);
    }

    // Step 3: Check if data appears in user stats
    console.log('\n3. Checking user stats...');
    const statsResponse = await fetch(`${API_BASE_URL}/api/waste/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      console.log('✅ User stats retrieved:');
      console.log(`   Total entries: ${statsData.stats.overall.totalEntries}`);
      console.log(`   Total weight: ${statsData.stats.overall.totalWeight} kg`);
      console.log(`   Total points: ${statsData.stats.overall.totalPoints}`);
    } else {
      console.log('❌ Failed to get user stats');
    }

    // Step 4: Check recent entries
    console.log('\n4. Checking recent entries...');
    const entriesResponse = await fetch(`${API_BASE_URL}/api/waste/my-entries?limit=5`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (entriesResponse.ok) {
      const entriesData = await entriesResponse.json();
      console.log('✅ Recent entries retrieved:');
      console.log(`   Number of entries: ${entriesData.wasteEntries.length}`);
      if (entriesData.wasteEntries.length > 0) {
        const latest = entriesData.wasteEntries[0];
        console.log(`   Latest entry: ${latest.wasteType} - ${latest.weight}kg`);
        console.log(`   Points: ${latest.pointsEarned}`);
        console.log(`   Date: ${new Date(latest.createdAt).toLocaleString()}`);
      }
    } else {
      console.log('❌ Failed to get recent entries');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }

  console.log('\n🏁 Waste entry test completed!');
}

// Run the test
testWasteEntry().catch(console.error);