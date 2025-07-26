import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './backend/.env' });

const resetDatabase = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Drop all collections
    console.log('🗑️ Dropping all collections...');
    const collections = await mongoose.connection.db.collections();
    
    for (let collection of collections) {
      await collection.drop();
      console.log(`✅ Dropped collection: ${collection.collectionName}`);
    }

    // Seed initial waste bins
    console.log('🌱 Seeding initial data...');
    
    const initialBins = [
      {
        binId: 'CP-001',
        location: {
          area: 'Connaught Place',
          address: 'Connaught Place Central, Block A',
          coordinates: { latitude: 28.6315, longitude: 77.2167 },
          landmark: 'Near Metro Station'
        },
        type: 'general',
        capacity: { total: 100, current: 25 },
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
        capacity: { total: 80, current: 15 },
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
        capacity: { total: 60, current: 30 },
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
        capacity: { total: 120, current: 45 },
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
        capacity: { total: 90, current: 20 },
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
        capacity: { total: 100, current: 35 },
        status: 'active',
        lastEmptied: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        binId: 'DW-007',
        location: {
          area: 'Dwarka',
          address: 'Dwarka Sector 21 Metro',
          coordinates: { latitude: 28.5921, longitude: 77.0460 },
          landmark: 'Near City Center'
        },
        type: 'recyclable',
        capacity: { total: 110, current: 40 },
        status: 'active',
        lastEmptied: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        binId: 'SK-008',
        location: {
          area: 'Saket',
          address: 'Saket Select City Walk',
          coordinates: { latitude: 28.5245, longitude: 77.2066 },
          landmark: 'Near Mall'
        },
        type: 'general',
        capacity: { total: 95, current: 28 },
        status: 'active',
        lastEmptied: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await mongoose.connection.collection('wastebins').insertMany(initialBins);
    console.log(`✅ Seeded ${initialBins.length} waste bins`);

    console.log('🎉 Database reset and seeded successfully!');
    
  } catch (error) {
    console.error('❌ Error resetting database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

resetDatabase();