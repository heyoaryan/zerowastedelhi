import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Set mongoose options
    mongoose.set('strictQuery', false);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    // Create indexes for better performance
    await createIndexes();
    
    // Seed initial data if database is empty
    await seedInitialData();
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    
    // Try to create database if it doesn't exist
    console.log('🔄 Attempting to create database...');
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI.replace('/zero_waste_delhi_app', '/admin'), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      
      // Switch to our database
      await mongoose.connection.useDb('zero_waste_delhi_app');
      console.log('✅ Database created successfully');
      
      await createIndexes();
      await seedInitialData();
      
    } catch (createError) {
      console.error('❌ Failed to create database:', createError.message);
      process.exit(1);
    }
  }
};

const createIndexes = async () => {
  try {
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
    
    console.log('✅ Database indexes created successfully');
  } catch (error) {
    console.error('⚠️ Error creating indexes:', error.message);
  }
};

const seedInitialData = async () => {
  try {
    // Check if we already have bins
    const binCount = await mongoose.connection.collection('wastebins').countDocuments();
    
    if (binCount === 0) {
      console.log('🌱 Seeding initial waste bins...');
      
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
        }
      ];
      
      await mongoose.connection.collection('wastebins').insertMany(initialBins);
      console.log(`✅ Seeded ${initialBins.length} waste bins`);
    }
    
    // Ensure collections exist
    console.log('🔍 Ensuring all collections exist...');
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    console.log('📊 Existing collections:', collectionNames);
    
    // Create collections if they don't exist
    const requiredCollections = ['users', 'wastebins', 'wasteentries', 'leaderboards', 'locationwastetrackers'];
    
    for (const collectionName of requiredCollections) {
      if (!collectionNames.includes(collectionName)) {
        await mongoose.connection.db.createCollection(collectionName);
        console.log(`✅ Created collection: ${collectionName}`);
      }
    }
    
  } catch (error) {
    console.error('⚠️ Error seeding initial data:', error.message);
  }
};

export default connectDB;