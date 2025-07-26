// Test Garima's login and dashboard data
const testGarimaLogin = async () => {
  console.log('👤 Testing Garima\'s Login and Dashboard Data');
  console.log('============================================');
  
  try {
    // Test login for Garima
    console.log('1. Testing login for jaingarima360@gmail.com...');
    
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'jaingarima360@gmail.com',
        password: 'Password123' // Assuming same password format
      })
    });
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login successful for Garima');
      console.log('User data:', {
        name: loginData.user.name,
        email: loginData.user.email,
        id: loginData.user.id
      });
      
      // Test dashboard data fetch
      console.log('');
      console.log('2. Testing dashboard data for Garima...');
      
      const statsUrl = `http://localhost:5000/api/simple-waste/stats?userEmail=${encodeURIComponent(loginData.user.email)}`;
      const statsResponse = await fetch(statsUrl);
      const statsData = await statsResponse.json();
      
      console.log('Dashboard stats:', {
        success: statsData.success,
        totalWeight: statsData.stats?.totalWeight,
        totalPoints: statsData.stats?.totalPoints,
        totalEntries: statsData.stats?.totalEntries
      });
      
      if (statsData.success && statsData.stats?.totalWeight > 0) {
        console.log('');
        console.log('✅ GARIMA\'S DASHBOARD SHOULD SHOW:');
        console.log(`   - Total Waste: ${statsData.stats.totalWeight} kg`);
        console.log(`   - Reward Points: ${statsData.stats.totalPoints}`);
        console.log(`   - Total Entries: ${statsData.stats.totalEntries}`);
        console.log('');
        console.log('🔧 SOLUTION: Make sure Garima logs in with jaingarima360@gmail.com');
      } else {
        console.log('❌ No data found for Garima');
      }
      
    } else {
      console.log('❌ Login failed for Garima');
      
      // Try to create Garima's account if it doesn't exist
      console.log('');
      console.log('2. Trying to create account for Garima...');
      
      const signupResponse = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Garima Jain',
          email: 'jaingarima360@gmail.com',
          password: 'Password123',
          phone: '9876543210'
        })
      });
      
      if (signupResponse.ok) {
        const signupData = await signupResponse.json();
        console.log('✅ Account created for Garima');
        console.log('Now test the dashboard data...');
        
        // Test dashboard data after signup
        const statsUrl = `http://localhost:5000/api/simple-waste/stats?userEmail=jaingarima360@gmail.com`;
        const statsResponse = await fetch(statsUrl);
        const statsData = await statsResponse.json();
        
        console.log('Dashboard stats after signup:', {
          totalWeight: statsData.stats?.totalWeight,
          totalPoints: statsData.stats?.totalPoints
        });
        
      } else {
        const errorData = await signupResponse.json();
        console.log('❌ Signup failed:', errorData.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

await testGarimaLogin();