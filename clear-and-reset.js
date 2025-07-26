import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './backend/.env' });

const clearAndReset = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Drop the entire database to clear any cached/corrupted data
    console.log('🗑️ Dropping entire database to clear cache...');
    await mongoose.connection.db.dropDatabase();
    console.log('✅ Database dropped successfully');

    // Recreate the database
    console.log('🏗️ Recreating database with fresh data...');
    
    // Create collections
    const collections = ['users', 'wastebins', 'wasteentries', 'leaderboards', 'locationwastetrackers'];
    
    for (const collectionName of collections) {
      await mongoose.connection.db.createCollection(collectionName);
      console.log(`✅ Created collection: ${collectionName}`);
    }

    // Seed fresh waste bins with different locations
    console.log('🌱 Seeding fresh waste bins...');
    
    const freshBins = [
      {
        binId: 'CP-001',
        location: {
          area: 'Connaught Place',
          address: 'Connaught Place Central, Block A',
          coordinates: { latitude: 28.6315, longitude: 77.2167 },
          landmark: 'Near Metro Station'
        },
        type: 'general',
        capacity: { total: 100, current: 10 },
        status: 'active',
        lastEmptied: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        binId: 'IG-002',
        location: {
          area: 'India Gate',
          address: 'India Gate, Rajpath',
          coordinates: { latitude: 28.6129, longitude: 77.2295 },
          landmark: 'Near War Memorial'
        },
        type: 'recyclable',
        capacity: { total: 80, current: 5 },
        status: 'active',
        lastEmptied: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        binId: 'KM-003',
        location: {
          area: 'Khan Market',
          address: 'Khan Market, Middle Lane',
          coordinates: { latitude: 28.5983, longitude: 77.2319 },
          landmark: 'Near Shopping Complex'
        },
        type: 'organic',
        capacity: { total: 60, current: 15 },
        status: 'active',
        lastEmptied: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        binId: 'KB-004',
        location: {
          area: 'Karol Bagh',
          address: 'Karol Bagh Main Market',
          coordinates: { latitude: 28.6519, longitude: 77.1909 },
          landmark: 'Near Metro Station'
        },
        type: 'general',
        capacity: { total: 120, current: 20 },
        status: 'active',
        lastEmptied: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        binId: 'LN-005',
        location: {
          area: 'Lajpat Nagar',
          address: 'Lajpat Nagar Central Market',
          coordinates: { latitude: 28.5677, longitude: 77.2436 },
          landmark: 'Near Central Market'
        },
        type: 'recyclable',
        capacity: { total: 90, current: 8 },
        status: 'active',
        lastEmptied: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        binId: 'RG-006',
        location: {
          area: 'Rajouri Garden',
          address: 'Rajouri Garden Metro Station',
          coordinates: { latitude: 28.6692, longitude: 77.1174 },
          landmark: 'Near Metro Station'
        },
        type: 'general',
        capacity: { total: 100, current: 12 },
        status: 'active',
        lastEmptied: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        binId: 'SK-007',
        location: {
          area: 'Saket',
          address: 'Saket Select City Walk',
          coordinates: { latitude: 28.5245, longitude: 77.2066 },
          landmark: 'Near Mall'
        },
        type: 'recyclable',
        capacity: { total: 95, current: 18 },
        status: 'active',
        lastEmptied: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        binId: 'DW-008',
        location: {
          area: 'Dwarka',
          address: 'Dwarka Sector 21 Metro',
          coordinates: { latitude: 28.5921, longitude: 77.0460 },
          landmark: 'Near City Center'
        },
        type: 'general',
        capacity: { total: 110, current: 25 },
        status: 'active',
        lastEmptied: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await mongoose.connection.collection('wastebins').insertMany(freshBins);
    console.log(`✅ Seeded ${freshBins.length} fresh waste bins`);

    // Create indexes
    console.log('🔍 Creating database indexes...');
    
    // User indexes
    await mongoose.connection.collection('users').createIndex({ email: 1 }, { unique: true });
    
    // WasteBin indexes
    await mongoose.connection.collection('wastebins').createIndex({ binId: 1 }, { unique: true });
    await mongoose.connection.collection('wastebins').createIndex({ 'location.coordinates': '2dsphere' });
    await mongoose.connection.collection('wastebins').createIndex({ status: 1 });
    
    // WasteEntry indexes
    await mongoose.connection.collection('wasteentries').createIndex({ user: 1, createdAt: -1 });
    await mongoose.connection.collection('wasteentries').createIndex({ bin: 1 });
    await mongoose.connection.collection('wasteentries').createIndex({ status: 1 });
    
    // Leaderboard indexes
    await mongoose.connection.collection('leaderboards').createIndex({ user: 1 }, { unique: true });
    await mongoose.connection.collection('leaderboards').createIndex({ totalPoints: -1 });
    
    console.log('✅ Database indexes created');

    console.log('🎉 Database cleared and reset successfully!');
    console.log('\n📊 Fresh database ready with:');
    console.log(`   - ${freshBins.length} waste bins across Delhi`);
    console.log('   - Clean collections for users, entries, and leaderboard');
    console.log('   - Proper indexes for performance');
    console.log('\n🚀 Now start your backend server: cd backend && npm run dev');
    
  } catch (error) {
    console.error('❌ Error clearing and resetting database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

clearAndReset();