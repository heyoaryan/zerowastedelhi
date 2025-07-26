// Test database saving functionality
const API_BASE_URL = 'http://localhost:5000';

async function testDatabaseSave() {
  console.log('💾 TESTING DATABASE SAVE FUNCTIONALITY');
  console.log('='.repeat(50));

  let authToken = null;
  let userId = null;

  // Step 1: Register a test user
  console.log('\n1. 👤 Testing user registration...');
  try {
    const registerResponse = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Database Test User',
        email: `dbtest${Date.now()}@example.com`,
        phone: '9876543210',
        password: 'test123456'
      })
    });

    if (registerResponse.ok) {
      const data = await registerResponse.json();
      authToken = data.token;
      userId = data.user._id;
      console.log('   ✅ User registered successfully');
      console.log(`   👤 User ID: ${userId}`);
      console.log(`   🔑 Token: ${authToken ? 'Generated' : 'Missing'}`);
    } else {
      const errorData = await registerResponse.json();
      console.log('   ❌ Registration failed:', errorData.message);
      return;
    }
  } catch (error) {
    console.log('   ❌ Registration error:', error.message);
    return;
  }

  // Step 2: Test waste entry submission
  console.log('\n2. 🗑️ Testing waste entry submission...');
  try {
    const wasteData = {
      binId: 'CP-001',
      wasteType: 'plastic',
      weight: 2.5,
      description: 'Database test waste entry',
      userLocation: {
        latitude: 28.6315,
        longitude: 77.2167,
        address: 'Test Location for Database'
      }
    };

    console.log('   📝 Submitting waste entry:', wasteData);

    const wasteResponse = await fetch(`${API_BASE_URL}/api/waste`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(wasteData)
    });

    if (wasteResponse.ok) {
      const result = await wasteResponse.json();
      console.log('   ✅ Waste entry submitted successfully');
      console.log(`   🆔 Entry ID: ${result.wasteEntry._id}`);
      console.log(`   🎯 Points earned: ${result.pointsEarned}`);
      console.log(`   📍 Location detected: ${result.locationInfo.detectedLocation}`);
      console.log(`   💾 Database saved: ${result.databaseSaved ? 'YES' : 'NO'}`);
      
      // Step 3: Verify entry was saved by fetching user entries
      console.log('\n3. 🔍 Verifying entry was saved to database...');
      
      const entriesResponse = await fetch(`${API_BASE_URL}/api/waste/my-entries`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (entriesResponse.ok) {
        const entriesData = await entriesResponse.json();
        console.log(`   ✅ Found ${entriesData.wasteEntries.length} entries in database`);
        
        if (entriesData.wasteEntries.length > 0) {
          const entry = entriesData.wasteEntries[0];
          console.log(`   📊 Latest entry: ${entry.wasteType}, ${entry.weight}kg, ${entry.pointsEarned} points`);
          console.log(`   📅 Created: ${new Date(entry.createdAt).toLocaleString()}`);
          console.log('   ✅ DATABASE SAVE CONFIRMED!');
        } else {
          console.log('   ❌ No entries found in database');
        }
      } else {
        console.log('   ❌ Failed to fetch entries from database');
      }

      // Step 4: Check user stats update
      console.log('\n4. 📊 Checking user stats update...');
      
      const statsResponse = await fetch(`${API_BASE_URL}/api/waste/stats`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        console.log('   ✅ User stats retrieved');
        console.log(`   📊 Total entries: ${statsData.stats.overall.totalEntries}`);
        console.log(`   ⚖️ Total weight: ${statsData.stats.overall.totalWeight}kg`);
        console.log(`   🎯 Total points: ${statsData.stats.overall.totalPoints}`);
        
        if (statsData.stats.overall.totalEntries > 0) {
          console.log('   ✅ USER STATS UPDATED!');
        } else {
          console.log('   ❌ User stats not updated');
        }
      } else {
        console.log('   ❌ Failed to fetch user stats');
      }

    } else {
      const errorData = await wasteResponse.json();
      console.log('   ❌ Waste entry failed:', errorData.message);
      console.log('   📊 Response status:', wasteResponse.status);
    }

  } catch (error) {
    console.log('   ❌ Waste entry error:', error.message);
  }

  // Step 5: Test database collections directly
  console.log('\n5. 🗄️ Testing database collections...');
  try {
    const dbTestResponse = await fetch(`${API_BASE_URL}/api/debug/test-db`);
    
    if (dbTestResponse.ok) {
      const dbData = await dbTestResponse.json();
      console.log('   ✅ Database connection confirmed');
      console.log(`   📊 Collections stats:`, dbData.stats);
      console.log(`   🗄️ Database: ${dbData.database}`);
      console.log(`   🖥️ Host: ${dbData.host}`);
      
      if (dbData.stats.entries > 0) {
        console.log('   ✅ WASTE ENTRIES ARE BEING SAVED!');
      } else {
        console.log('   ⚠️ No waste entries found in database');
      }
    } else {
      console.log('   ❌ Database test failed');
    }
  } catch (error) {
    console.log('   ❌ Database test error:', error.message);
  }

  console.log('\n' + '='.repeat(50));
  console.log('📋 DATABASE TEST SUMMARY:');
  console.log('If you see "DATABASE SAVE CONFIRMED!" above,');
  console.log('then waste entries are being properly saved.');
  console.log('If not, there may be a database connection issue.');
  console.log('\n🔧 If entries are not saving:');
  console.log('1. Make sure MongoDB is running');
  console.log('2. Run: node clear-and-reset.js');
  console.log('3. Restart backend: cd backend && npm run dev');
}

testDatabaseSave().catch(console.error);