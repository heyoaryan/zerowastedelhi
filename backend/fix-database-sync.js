import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function fixDatabaseSync() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🔧 Fixing Database Synchronization Issues');
    console.log('========================================');
    
    const db = mongoose.connection.db;
    
    // Get all users and their waste data
    const users = await db.collection('users').find({}).toArray();
    const simpleUsers = await db.collection('simpleusers').find({}).toArray();
    const wasteEntries = await db.collection('simplewasteentries').find({}).toArray();
    
    console.log('📊 Current Database State:');
    console.log(`- Users: ${users.length}`);
    console.log(`- Simple Users: ${simpleUsers.length}`);
    console.log(`- Waste Entries: ${wasteEntries.length}`);
    console.log('');
    
    // Group waste entries by user email
    const entriesByUser = {};
    wasteEntries.forEach(entry => {
      const email = entry.userEmail;
      if (!entriesByUser[email]) {
        entriesByUser[email] = {
          entries: [],
          totalWeight: 0,
          totalPoints: 0,
          totalCarbonSaved: 0
        };
      }
      entriesByUser[email].entries.push(entry);
      entriesByUser[email].totalWeight += entry.weight || 0;
      entriesByUser[email].totalPoints += entry.pointsEarned || 0;
      entriesByUser[email].totalCarbonSaved += entry.carbonFootprintSaved || 0;
    });
    
    console.log('📈 Calculated Stats from Waste Entries:');
    Object.keys(entriesByUser).forEach(email => {
      const stats = entriesByUser[email];
      console.log(`${email}:`);
      console.log(`  - Entries: ${stats.entries.length}`);
      console.log(`  - Weight: ${stats.totalWeight.toFixed(1)}kg`);
      console.log(`  - Points: ${stats.totalPoints}`);
      console.log(`  - Carbon Saved: ${stats.totalCarbonSaved.toFixed(1)}kg`);
    });
    console.log('');
    
    // Fix main users collection
    console.log('🔄 Updating Main Users Collection:');
    for (const user of users) {
      const userStats = entriesByUser[user.email];
      if (userStats) {
        const updateResult = await db.collection('users').updateOne(
          { _id: user._id },
          {
            $set: {
              totalWasteCollected: userStats.totalWeight,
              points: userStats.totalPoints,
              totalWasteEntries: userStats.entries.length,
              totalCarbonSaved: userStats.totalCarbonSaved
            }
          }
        );
        
        console.log(`✅ Updated ${user.name} (${user.email}):`);
        console.log(`   - Weight: ${user.totalWasteCollected || 0} → ${userStats.totalWeight.toFixed(1)}kg`);
        console.log(`   - Points: ${user.points || 0} → ${userStats.totalPoints}`);
      } else {
        console.log(`⚠️ No waste entries found for ${user.name} (${user.email})`);
      }
    }
    console.log('');
    
    // Fix simple users collection
    console.log('🔄 Updating Simple Users Collection:');
    for (const simpleUser of simpleUsers) {
      const userStats = entriesByUser[simpleUser.email];
      if (userStats) {
        await db.collection('simpleusers').updateOne(
          { _id: simpleUser._id },
          {
            $set: {
              totalWasteWeight: userStats.totalWeight,
              totalPoints: userStats.totalPoints,
              totalWasteEntries: userStats.entries.length,
              totalCarbonSaved: userStats.totalCarbonSaved
            }
          }
        );
        
        console.log(`✅ Updated simple user ${simpleUser.name} (${simpleUser.email}):`);
        console.log(`   - Weight: ${simpleUser.totalWasteWeight || 0} → ${userStats.totalWeight.toFixed(1)}kg`);
        console.log(`   - Points: ${simpleUser.totalPoints || 0} → ${userStats.totalPoints}`);
      }
    }
    console.log('');
    
    // Create/update leaderboard entries
    console.log('🏆 Updating Leaderboard:');
    for (const user of users) {
      const userStats = entriesByUser[user.email];
      if (userStats && userStats.totalPoints > 0) {
        // Check if leaderboard entry exists
        const existingLeaderboard = await db.collection('leaderboards').findOne({ user: user._id });
        
        if (existingLeaderboard) {
          await db.collection('leaderboards').updateOne(
            { user: user._id },
            {
              $set: {
                totalPoints: userStats.totalPoints,
                totalWasteCollected: userStats.totalWeight,
                totalEntries: userStats.entries.length,
                lastUpdated: new Date()
              }
            }
          );
          console.log(`✅ Updated leaderboard for ${user.name}`);
        } else {
          await db.collection('leaderboards').insertOne({
            user: user._id,
            totalPoints: userStats.totalPoints,
            totalWasteCollected: userStats.totalWeight,
            totalEntries: userStats.entries.length,
            createdAt: new Date(),
            lastUpdated: new Date()
          });
          console.log(`✅ Created leaderboard entry for ${user.name}`);
        }
      }
    }
    
    console.log('');
    console.log('🎉 Database Synchronization Complete!');
    console.log('====================================');
    
    // Verify the fixes
    console.log('🔍 Verification:');
    const updatedUsers = await db.collection('users').find({}).toArray();
    updatedUsers.forEach(user => {
      console.log(`${user.name}: ${user.totalWasteCollected || 0}kg, ${user.points || 0} points`);
    });
    
    console.log('');
    console.log('✅ Dashboard and Leaderboard should now show correct data!');
    
  } catch (error) {
    console.error('❌ Error fixing database sync:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('📤 Disconnected from Atlas');
  }
}

fixDatabaseSync();