import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import models
import SimpleUser from './models/SimpleUser.js';
import SimpleWasteEntry from './models/SimpleWasteEntry.js';

async function createTestWasteEntry() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to Atlas');

    // Find or create test user
    let user = await SimpleUser.findOne({ email: 'test@zerowastedelhi.com' });
    if (!user) {
      user = new SimpleUser({
        name: 'Test User',
        email: 'test@zerowastedelhi.com',
        sessionId: Date.now().toString()
      });
      await user.save();
      console.log('✅ Created test user');
    }

    // Create some test waste entries
    const testEntries = [
      {
        userName: 'Test User',
        userEmail: 'test@zerowastedelhi.com',
        wasteType: 'organic',
        weight: 2.5,
        pointsEarned: 25,
        carbonFootprintSaved: 1.2,
        description: 'Kitchen waste disposal',
        location: {
          coordinates: { latitude: 28.6139, longitude: 77.2090 },
          address: 'Connaught Place, New Delhi',
          detectedLocation: {
            name: 'Connaught Place',
            area: 'Central Delhi',
            source: 'manual'
          }
        },
        sessionId: user.sessionId,
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        userName: 'Test User',
        userEmail: 'test@zerowastedelhi.com',
        wasteType: 'recyclable',
        weight: 1.8,
        pointsEarned: 18,
        carbonFootprintSaved: 0.9,
        description: 'Paper and plastic bottles',
        location: {
          coordinates: { latitude: 28.6139, longitude: 77.2090 },
          address: 'India Gate, New Delhi',
          detectedLocation: {
            name: 'India Gate',
            area: 'Central Delhi',
            source: 'manual'
          }
        },
        sessionId: user.sessionId,
        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        userName: 'Test User',
        userEmail: 'test@zerowastedelhi.com',
        wasteType: 'general',
        weight: 3.2,
        pointsEarned: 32,
        carbonFootprintSaved: 1.6,
        description: 'Mixed household waste',
        location: {
          coordinates: { latitude: 28.6139, longitude: 77.2090 },
          address: 'Khan Market, New Delhi',
          detectedLocation: {
            name: 'Khan Market',
            area: 'Central Delhi',
            source: 'manual'
          }
        },
        sessionId: user.sessionId,
        submittedAt: new Date() // Today
      }
    ];

    // Clear existing entries for this user
    await SimpleWasteEntry.deleteMany({ userEmail: 'test@zerowastedelhi.com' });
    console.log('🗑️ Cleared existing test entries');

    // Create new entries
    for (const entryData of testEntries) {
      const entry = new SimpleWasteEntry(entryData);
      await entry.save();
      console.log(`✅ Created waste entry: ${entry.wasteType} - ${entry.weight}kg`);
    }

    // Update user stats
    const totalEntries = testEntries.length;
    const totalWeight = testEntries.reduce((sum, entry) => sum + entry.weight, 0);
    const totalPoints = testEntries.reduce((sum, entry) => sum + entry.pointsEarned, 0);
    const totalCarbonSaved = testEntries.reduce((sum, entry) => sum + entry.carbonFootprintSaved, 0);

    user.totalWasteEntries = totalEntries;
    user.totalWasteWeight = totalWeight;
    user.totalPoints = totalPoints;
    user.totalCarbonSaved = totalCarbonSaved;
    await user.save();

    console.log('');
    console.log('📊 Updated User Stats:');
    console.log(`- Total Entries: ${totalEntries}`);
    console.log(`- Total Weight: ${totalWeight.toFixed(1)} kg`);
    console.log(`- Total Points: ${totalPoints}`);
    console.log(`- Carbon Saved: ${totalCarbonSaved.toFixed(1)} kg`);
    console.log('');
    console.log('🎉 Test waste entries created! Your dashboard should now show data.');

  } catch (error) {
    console.error('❌ Error creating test waste entries:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('📤 Disconnected from Atlas');
  }
}

createTestWasteEntry();