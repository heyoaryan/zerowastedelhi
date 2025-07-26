import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testAtlasConnection() {
  try {
    console.log('🔄 Testing MongoDB Atlas connection...');
    console.log('Connection string:', process.env.MONGODB_URI.replace(/\/\/.*@/, '//***:***@'));
    
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    // Test database operations
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log('📊 Database info:');
    console.log(`- Database name: ${db.databaseName}`);
    console.log(`- Collections found: ${collections.length}`);
    
    if (collections.length > 0) {
      console.log('- Collection names:');
      collections.forEach(col => {
        console.log(`  • ${col.name}`);
      });
    } else {
      console.log('- No collections found (fresh database)');
    }
    
    // Test write operation
    const testCollection = db.collection('connection_test');
    await testCollection.insertOne({ 
      test: true, 
      timestamp: new Date(),
      message: 'Atlas connection successful' 
    });
    console.log('✅ Write test successful');
    
    // Clean up test document
    await testCollection.deleteOne({ test: true });
    console.log('✅ Cleanup successful');
    
    console.log('');
    console.log('🎉 MongoDB Atlas is ready to use!');
    console.log('Your backend will now use cloud database instead of local MongoDB.');
    
  } catch (error) {
    console.error('❌ Atlas connection failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting steps:');
    console.log('1. Check your connection string in .env file');
    console.log('2. Ensure password is correctly URL-encoded');
    console.log('3. Verify network access allows your IP');
    console.log('4. Confirm database user has proper permissions');
  } finally {
    await mongoose.disconnect();
    console.log('📤 Disconnected from database');
  }
}

async function createTestUser() {
  try {
    console.log('👤 Creating test user in Atlas...');
    
    // Simple user schema for testing
    const userSchema = new mongoose.Schema({
      name: String,
      email: { type: String, unique: true },
      password: String,
      createdAt: { type: Date, default: Date.now }
    });
    
    const User = mongoose.model('User', userSchema);
    
    // Check if test user exists
    const existingUser = await User.findOne({ email: 'atlas-test@zerowastedelhi.com' });
    if (existingUser) {
      console.log('⚠️ Test user already exists in Atlas');
      return;
    }
    
    // Create test user
    const testUser = new User({
      name: 'Atlas Test User',
      email: 'atlas-test@zerowastedelhi.com',
      password: 'hashedpassword123'
    });
    
    await testUser.save();
    console.log('✅ Test user created in Atlas database');
    console.log('Email: atlas-test@zerowastedelhi.com');
    
  } catch (error) {
    console.error('❌ Error creating test user:', error.message);
  }
}

// Run the tests
console.log('🚀 MongoDB Atlas Migration Tool');
console.log('================================');
console.log('');

await testAtlasConnection();

if (process.argv.includes('--create-test-user')) {
  console.log('');
  await mongoose.connect(process.env.MONGODB_URI);
  await createTestUser();
  await mongoose.disconnect();
}