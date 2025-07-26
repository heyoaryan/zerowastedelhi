// Test dashboard data fetching
const testDashboardData = async () => {
  try {
    console.log('🧪 Testing Dashboard Data Fetching');
    console.log('================================');
    
    // Test with authenticated user
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ODM2YzQxMGIxODU0OTUyZTRlZTZiZiIsImlhdCI6MTc1MzQ0MzM5MywiZXhwIjoxNzU0MDQ4MTkzfQ.d8s7s8orUfigPQ_2BXzHRAFGy70PenQY26hBxSjJtqg'; // Your actual token
    
    console.log('1. Testing authenticated user profile:');
    const userResponse = await fetch('http://localhost:5000/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (userResponse.ok) {
      const userData = await userResponse.json();
      console.log('✅ User profile data:', {
        name: userData.user?.name,
        email: userData.user?.email,
        totalWasteCollected: userData.user?.totalWasteCollected,
        points: userData.user?.points,
        totalWasteEntries: userData.user?.totalWasteEntries
      });
    } else {
      console.log('❌ User profile fetch failed:', userResponse.status);
    }
    
    console.log('');
    console.log('2. Testing simple waste stats:');
    const statsResponse = await fetch('http://localhost:5000/api/simple-waste/stats?userEmail=test@zerowastedelhi.com');
    
    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      console.log('✅ Simple waste stats:', {
        success: statsData.success,
        totalEntries: statsData.stats?.totalEntries,
        totalWeight: statsData.stats?.totalWeight,
        totalPoints: statsData.stats?.totalPoints
      });
    } else {
      console.log('❌ Simple waste stats fetch failed:', statsResponse.status);
    }
    
    console.log('');
    console.log('3. Testing simple waste entries:');
    const entriesResponse = await fetch('http://localhost:5000/api/simple-waste/entries?userEmail=test@zerowastedelhi.com');
    
    if (entriesResponse.ok) {
      const entriesData = await entriesResponse.json();
      console.log('✅ Simple waste entries:', {
        success: entriesData.success,
        entriesCount: entriesData.entries?.length || 0,
        hasStats: !!entriesData.stats
      });
      
      if (entriesData.entries && entriesData.entries.length > 0) {
        console.log('Recent entries:');
        entriesData.entries.slice(0, 3).forEach((entry, index) => {
          console.log(`  ${index + 1}. ${entry.wasteType} - ${entry.weight}kg - ${entry.pointsEarned} points`);
        });
      }
    } else {
      console.log('❌ Simple waste entries fetch failed:', entriesResponse.status);
    }
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
};

await testDashboardData();