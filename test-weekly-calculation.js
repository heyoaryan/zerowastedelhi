// Test weekly calculation logic
const testWeeklyCalculation = async () => {
  console.log('📅 Testing Weekly Calculation Logic');
  console.log('==================================');
  
  try {
    // Get Garima's entries
    const entriesResponse = await fetch('http://localhost:5000/api/simple-waste/entries?userEmail=jaingarima360@gmail.com');
    
    if (entriesResponse.ok) {
      const entriesData = await entriesResponse.json();
      const entries = entriesData.entries || [];
      
      console.log(`Found ${entries.length} total entries for Garima`);
      console.log('');
      
      // Show all entries with dates
      console.log('📊 All Entries:');
      entries.forEach((entry, index) => {
        const entryDate = new Date(entry.submittedAt || entry.createdAt);
        const daysAgo = Math.floor((new Date() - entryDate) / (1000 * 60 * 60 * 24));
        
        console.log(`${index + 1}. ${entry.wasteType} - ${entry.weight}kg - ${entry.pointsEarned} points`);
        console.log(`   Date: ${entryDate.toLocaleDateString()} (${daysAgo} days ago)`);
      });
      
      console.log('');
      
      // Calculate weekly stats (last 7 days)
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      console.log('📅 Weekly Calculation (Last 7 Days):');
      console.log(`Cutoff date: ${oneWeekAgo.toLocaleDateString()}`);
      
      const weeklyEntries = entries.filter(entry => {
        const entryDate = new Date(entry.submittedAt || entry.createdAt);
        return entryDate >= oneWeekAgo;
      });
      
      console.log(`Entries in last 7 days: ${weeklyEntries.length}`);
      
      if (weeklyEntries.length > 0) {
        const weeklyWeight = weeklyEntries.reduce((total, entry) => total + entry.weight, 0);
        const weeklyPoints = weeklyEntries.reduce((total, entry) => total + entry.pointsEarned, 0);
        
        console.log('');
        console.log('📈 Weekly Stats:');
        console.log(`- Weight: ${weeklyWeight.toFixed(1)} kg`);
        console.log(`- Points: ${weeklyPoints}`);
        console.log(`- Entries: ${weeklyEntries.length}`);
        
        console.log('');
        console.log('🎯 Dashboard Should Show:');
        console.log(`- "This Week": ${weeklyWeight.toFixed(1)} kg`);
        console.log(`- Weekly entries: ${weeklyEntries.length} entries`);
        console.log(`- Weekly goal progress: ${Math.min((weeklyWeight / 5) * 100, 100).toFixed(0)}%`);
        
        if (weeklyWeight > 0) {
          console.log('✅ Weekly data available - dashboard should show real numbers');
        } else {
          console.log('❌ No weekly data - dashboard will show 0');
        }
      } else {
        console.log('❌ No entries in the last 7 days');
        console.log('💡 All entries are older than 1 week');
        
        // Show when the most recent entry was
        if (entries.length > 0) {
          const mostRecent = entries[0];
          const mostRecentDate = new Date(mostRecent.submittedAt || mostRecent.createdAt);
          const daysAgo = Math.floor((new Date() - mostRecentDate) / (1000 * 60 * 60 * 24));
          
          console.log(`Most recent entry: ${daysAgo} days ago`);
          console.log('📝 To see weekly data, add new waste entries within the last 7 days');
        }
      }
      
    } else {
      console.log('❌ Failed to fetch entries');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

await testWeeklyCalculation();