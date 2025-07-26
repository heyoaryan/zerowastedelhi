import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function createGarimaData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('👤 Setting up Garima\'s Dashboard Data');
    console.log('====================================');
    
    const db = mongoose.connection.db;
    
    // Check current Garima data
    const garimaUser = await db.collection('users').findOne({ email: 'jaingarima360@gmail.com' });
    const garimaSimpleUser = await db.collection('simpleusers').findOne({ email: 'jaingarima360@gmail.com' });
    const garimaEntries = await db.collection('simplewasteentries').find({ userEmail: 'jaingarima360@gmail.com' }).toArray();
    
    console.log('Current Garima data:');
    if (garimaUser) {
      console.log('✅ Main user exists:', garimaUser.name);
    }
    
    if (garimaSimpleUser) {
      console.log('✅ Simple user exists with stats:');
      console.log(`   - Entries: ${garimaSimpleUser.totalWasteEntries || 0}`);
      console.log(`   - Weight: ${garimaSimpleUser.totalWasteWeight || 0}kg`);
      console.log(`   - Points: ${garimaSimpleUser.totalPoints || 0}`);
    }
    
    console.log(`✅ Waste entries: ${garimaEntries.length} found`);
    
    if (garimaEntries.length > 0) {
      console.log('Recent entries:');
      garimaEntries.forEach((entry, index) => {
        console.log(`   ${index + 1}. ${entry.wasteType} - ${entry.weight}kg - ${entry.pointsEarned} points`);
      });
    }
    
    console.log('');
    console.log('🎯 Dashboard should show for Garima:');
    console.log(`   - Total Weight: ${garimaSimpleUser?.totalWasteWeight || 0} kg`);
    console.log(`   - Total Points: ${garimaSimpleUser?.totalPoints || 0}`);
    console.log(`   - Total Entries: ${garimaSimpleUser?.totalWasteEntries || 0}`);
    
    console.log('');
    console.log('🔧 To fix dashboard:');
    console.log('1. Make sure you\'re logged in as jaingarima360@gmail.com');
    console.log('2. Dashboard should fetch data for this email');
    console.log('3. Expected display: 20kg waste, 100 points');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('📤 Disconnected from Atlas');
  }
}

createGarimaData();