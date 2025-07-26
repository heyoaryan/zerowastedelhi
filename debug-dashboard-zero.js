// Debug why dashboard is showing 0 when leaderboard works
const debugDashboardZero = async () => {
  console.log('🔍 Debugging Dashboard Zero Issue');
  console.log('================================');
  console.log('Leaderboard works but dashboard shows 0 - investigating...');
  console.log('');

  try {
    // Test the exact same API calls the dashboard makes
    console.log('1. Testing Dashboard API Calls...');
    
    // Simulate logged-in user data (what would be in localStorage)
    const userEmail = 'jaingarima360@gmail.com';
    console.log('User email:', userEmail);
    
    // Test simple waste stats (what dashboard calls)
    console.log('');
    console.log('2. Testing Simple Waste Stats API...');
    const statsUrl = `http://localhost:5000/api/simple-waste/stats?userEmail=${encodeURIComponent(userEmail)}`;
    console.log('Stats URL:', statsUrl);
    
    const statsResponse = await fetch(statsUrl);
    console.log('Stats Response Status:', statsResponse.status);
    
    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      console.log('Stats Response Data:', JSON.stringify(statsData, null, 2));
      
      if (statsData.success && statsData.stats) {
        console.log('✅ Stats API working correctly');
        console.log('Expected dashboard values:');
        console.log(`- Total Weight: ${statsData.stats.totalWeight} kg`);
        console.log(`- Total Points: ${statsData.stats.totalPoints}`);
        console.log(`- Total Entries: ${statsData.stats.totalEntries}`);
      } else {
        console.log('❌ Stats API returned no data');
      }
    } else {
      console.log('❌ Stats API failed');
      const errorText = await statsResponse.text();
      console.log('Error:', errorText);
    }
    
    // Test simple waste entries (what dashboard calls)
    console.log('');
    console.log('3. Testing Simple Waste Entries API...');
    const entriesUrl = `http://localhost:5000/api/simple-waste/entries?userEmail=${encodeURIComponent(userEmail)}`;
    console.log('Entries URL:', entriesUrl);
    
    const entriesResponse = await fetch(entriesUrl);
    console.log('Entries Response Status:', entriesResponse.status);
    
    if (entriesResponse.ok) {
      const entriesData = await entriesResponse.json();
      console.log('Entries Response Data:', JSON.stringify(entriesData, null, 2));
      
      if (entriesData.success && entriesData.entries) {
        console.log('✅ Entries API working correctly');
        console.log(`Found ${entriesData.entries.length} entries`);
        
        if (entriesData.stats) {
          console.log('Entries response includes stats:');
          console.log(`- Total Weight: ${entriesData.stats.totalWeight} kg`);
          console.log(`- Total Points: ${entriesData.stats.totalPoints}`);
        }
      } else {
        console.log('❌ Entries API returned no data');
      }
    } else {
      console.log('❌ Entries API failed');
      const errorText = await entriesResponse.text();
      console.log('Error:', errorText);
    }
    
    // Test authenticated endpoints (what dashboard might try first)
    console.log('');
    console.log('4. Testing Authenticated Endpoints...');
    
    // Try to login and get token
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userEmail,
        password: 'Password123'
      })
    });
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      const token = loginData.token;
      console.log('✅ Got auth token');
      
      // Test authenticated waste endpoints
      const authHeaders = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      // Test my-entries endpoint
      const myEntriesResponse = await fetch('http://localhost:5000/api/waste/my-entries', {
        headers: authHeaders
      });
      
      console.log('My-entries response status:', myEntriesResponse.status);
      
      if (myEntriesResponse.ok) {
        const myEntriesData = await myEntriesResponse.json();
        console.log('✅ Authenticated entries working');
        console.log(`Found ${myEntriesData.entries?.length || 0} authenticated entries`);
      } else {
        console.log('❌ Authenticated entries failed');
      }
      
      // Test my-stats endpoint
      const myStatsResponse = await fetch('http://localhost:5000/api/waste/my-stats', {
        headers: authHeaders
      });
      
      console.log('My-stats response status:', myStatsResponse.status);
      
      if (myStatsResponse.ok) {
        const myStatsData = await myStatsResponse.json();
        console.log('✅ Authenticated stats working');
        console.log('Authenticated stats:', myStatsData);
      } else {
        console.log('❌ Authenticated stats failed');
      }
    }
    
    console.log('');
    console.log('5. Diagnosis:');
    console.log('=============');
    
    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      if (statsData.success && statsData.stats?.totalWeight > 0) {
        console.log('✅ API returns correct data');
        console.log('❓ Issue is likely in frontend processing');
        console.log('');
        console.log('🔧 Possible causes:');
        console.log('- User email mismatch in localStorage');
        console.log('- Dashboard not calling the right API');
        console.log('- Frontend data processing error');
        console.log('- Browser cache issues');
      } else {
        console.log('❌ API returns zero data');
        console.log('❓ Issue is in backend data retrieval');
      }
    }
    
  } catch (error) {
    console.error('❌ Debug error:', error.message);
  }
};

await debugDashboardZero();