// Debug dashboard data fetching issue
const debugDashboard = async () => {
  console.log('🔍 Debugging Dashboard Data Issue');
  console.log('================================');
  
  // Simulate what the dashboard does
  console.log('1. Checking localStorage data...');
  
  // Test what would be in localStorage for a logged-in user
  const testUserData = {
    id: 'test-user-id',
    name: 'Garima',
    email: 'test@zerowastedelhi.com',
    phone: '+91 00000 00000',
    avatar: '👤',
    totalWaste: 0,
    rewardPoints: 0,
    joinedDate: '2025-07-26'
  };
  
  console.log('Simulated localStorage user:', testUserData);
  console.log('User email:', testUserData.email);
  
  // Test the API endpoints the dashboard would call
  console.log('');
  console.log('2. Testing simple waste stats API...');
  
  try {
    const statsUrl = `http://localhost:5000/api/simple-waste/stats?userEmail=${encodeURIComponent(testUserData.email)}`;
    console.log('Stats URL:', statsUrl);
    
    const statsResponse = await fetch(statsUrl);
    const statsData = await statsResponse.json();
    
    console.log('Stats Response:', {
      status: statsResponse.status,
      success: statsData.success,
      totalEntries: statsData.stats?.totalEntries,
      totalWeight: statsData.stats?.totalWeight,
      totalPoints: statsData.stats?.totalPoints
    });
    
    console.log('');
    console.log('3. Testing simple waste entries API...');
    
    const entriesUrl = `http://localhost:5000/api/simple-waste/entries?userEmail=${encodeURIComponent(testUserData.email)}`;
    console.log('Entries URL:', entriesUrl);
    
    const entriesResponse = await fetch(entriesUrl);
    const entriesData = await entriesResponse.json();
    
    console.log('Entries Response:', {
      status: entriesResponse.status,
      success: entriesData.success,
      entriesCount: entriesData.entries?.length || 0,
      hasStats: !!entriesData.stats
    });
    
    if (entriesData.entries && entriesData.entries.length > 0) {
      console.log('Sample entries:');
      entriesData.entries.slice(0, 2).forEach((entry, index) => {
        console.log(`  ${index + 1}. ${entry.wasteType} - ${entry.weight}kg - ${entry.pointsEarned} points`);
      });
    }
    
    console.log('');
    console.log('4. Diagnosis:');
    
    if (statsData.success && statsData.stats && statsData.stats.totalWeight > 0) {
      console.log('✅ Data exists in database');
      console.log('✅ API endpoints working');
      console.log('❓ Issue might be in frontend data processing');
    } else {
      console.log('❌ No data found for user email:', testUserData.email);
      console.log('❓ Check if user email matches database entries');
    }
    
  } catch (error) {
    console.error('❌ API Error:', error.message);
  }
};

await debugDashboard();