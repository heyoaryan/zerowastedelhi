import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function checkUserDataMatch() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🔍 Checking User Data Match');
    console.log('==========================');
    
    const db = mongoose.connection.db;
    
    // Check all users in the system
    console.log('1. All Users in Database:');
    const users = await db.collection('users').find({}).toArray();
    console.log(`Found ${users.length} users:`);
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - ID: ${user._id}`);
    });
    
    console.log('');
    console.log('2. All Simple Users in Database:');
    const simpleUsers = await db.collection('simpleusers').find({}).toArray();
    console.log(`Found ${simpleUsers.length} simple users:`);
    simpleUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - Entries: ${user.totalWasteEntries || 0}, Weight: ${user.totalWasteWeight || 0}kg`);
    });
    
    console.log('');
    console.log('3. All Waste Entries:');
    const entries = await db.collection('simplewasteentries').find({}).toArray();
    console.log(`Found ${entries.length} waste entries:`);
    
    const entriesByUser = {};
    entries.forEach(entry => {
      const email = entry.userEmail || 'unknown';
      if (!entriesByUser[email]) {
        entriesByUser[email] = { count: 0, weight: 0, points: 0 };
      }
      entriesByUser[email].count++;
      entriesByUser[email].weight += entry.weight;
      entriesByUser[email].points += entry.pointsEarned;
    });
    
    Object.keys(entriesByUser).forEach(email => {
      const data = entriesByUser[email];
      console.log(`- ${email}: ${data.count} entries, ${data.weight.toFixed(1)}kg, ${data.points} points`);
    });
    
    console.log('');
    console.log('4. Checking Data Consistency:');
    
    // Find the main test user
    const testUser = await db.collection('users').findOne({ email: 'test@zerowastedelhi.com' });
    const testSimpleUser = await db.collection('simpleusers').findOne({ email: 'test@zerowastedelhi.com' });
    
    if (testUser) {
      console.log('✅ Main user exists:', testUser.name, testUser.email);
    } else {
      console.log('❌ Main user not found');
    }
    
    if (testSimpleUser) {
      console.log('✅ Simple user exists:', testSimpleUser.name, testSimpleUser.email);
      console.log(`   Stats: ${testSimpleUser.totalWasteEntries || 0} entries, ${testSimpleUser.totalWasteWeight || 0}kg, ${testSimpleUser.totalPoints || 0} points`);
    } else {
      console.log('❌ Simple user not found');
    }
    
    const userEntries = entriesByUser['test@zerowastedelhi.com'];
    if (userEntries) {
      console.log('✅ Waste entries exist for test@zerowastedelhi.com');
      console.log(`   Calculated: ${userEntries.count} entries, ${userEntries.weight.toFixed(1)}kg, ${userEntries.points} points`);
    } else {
      console.log('❌ No waste entries found for test@zerowastedelhi.com');
    }
    
    console.log('');
    console.log('5. Dashboard Connection Status:');
    if (testUser && testSimpleUser && userEntries) {
      console.log('✅ All data exists - Dashboard should work');
      console.log('✅ User can login with: test@zerowastedelhi.com / Password123');
      console.log('✅ Dashboard should show:', userEntries.weight.toFixed(1), 'kg and', userEntries.points, 'points');
    } else {
      console.log('❌ Data missing - Dashboard will show empty');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('📤 Disconnected from Atlas');
  }
}

checkUserDataMatch();