// Fix dashboard connection to show real data
const fixDashboardConnection = async () => {
  console.log('🔧 Fixing Dashboard Connection');
  console.log('=============================');
  
  // Check what user data would be in localStorage after login
  console.log('1. Testing login to get actual user data...');
  
  try {
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@zerowastedelhi.com',
        password: 'Password123'
      })
    });
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login successful');
      console.log('User data from login:', {
        id: loginData.user.id,
        name: loginData.user.name,
        email: loginData.user.email
      });
      
      // This is what should be stored in localStorage
      const userForStorage = {
        id: loginData.user.id,
        name: loginData.user.name,
        email: loginData.user.email,
        phone: '+91 00000 00000',
        avatar: '👤',
        totalWaste: 0, // This will be updated from API
        rewardPoints: 0, // This will be updated from API
        joinedDate: new Date().toISOString().split('T')[0]
      };
      
      console.log('');
      console.log('2. Testing dashboard data fetch with correct user...');
      
      // Test the dashboard API calls with the correct user email
      const statsUrl = `http://localhost:5000/api/simple-waste/stats?userEmail=${encodeURIComponent(loginData.user.email)}`;
      const statsResponse = await fetch(statsUrl);
      const statsData = await statsResponse.json();
      
      console.log('Stats for logged-in user:', {
        email: loginData.user.email,
        totalEntries: statsData.stats?.totalEntries,
        totalWeight: statsData.stats?.totalWeight,
        totalPoints: statsData.stats?.totalPoints
      });
      
      if (statsData.success && statsData.stats?.totalWeight > 0) {
        console.log('');
        console.log('✅ SOLUTION FOUND:');
        console.log('- User login works correctly');
        console.log('- User email matches database entries');
        console.log('- Dashboard should show real data');
        console.log('');
        console.log('🎯 Expected Dashboard Display:');
        console.log(`- Total Waste: ${statsData.stats.totalWeight} kg`);
        console.log(`- Reward Points: ${statsData.stats.totalPoints}`);
        console.log(`- Total Entries: ${statsData.stats.totalEntries}`);
      } else {
        console.log('❌ No data found for this user');
      }
      
    } else {
      console.log('❌ Login failed');
      const errorData = await loginResponse.json();
      console.log('Error:', errorData.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

await fixDashboardConnection();