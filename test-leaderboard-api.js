// Test leaderboard API
const testLeaderboard = async () => {
  console.log('🏆 Testing Leaderboard API');
  console.log('=========================');
  
  try {
    // Test leaderboard endpoint
    const response = await fetch('http://localhost:5000/api/leaderboard');
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Leaderboard API working');
      console.log('Response:', {
        success: data.success,
        count: data.leaderboard?.length || 0
      });
      
      if (data.leaderboard && data.leaderboard.length > 0) {
        console.log('');
        console.log('🏆 Current Leaderboard:');
        data.leaderboard.forEach((entry, index) => {
          console.log(`${index + 1}. ${entry.user?.name || 'Unknown'} - ${entry.totalPoints || 0} points - ${entry.totalWasteCollected || 0}kg`);
        });
      } else {
        console.log('❌ No leaderboard entries found');
      }
    } else {
      console.log('❌ Leaderboard API failed:', response.status);
      const errorData = await response.json().catch(() => ({}));
      console.log('Error:', errorData);
    }
    
  } catch (error) {
    console.error('❌ Error testing leaderboard:', error.message);
  }
};

await testLeaderboard();