import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import the actual User model
import User from './models/User.js';

async function fixTestUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to Atlas');

    // Delete existing test user
    await User.deleteOne({ email: 'test@zerowastedelhi.com' });
    console.log('🗑️ Removed old test user');

    // Create new test user with proper password
    const testUser = new User({
      name: 'Test User',
      email: 'test@zerowastedelhi.com',
      password: 'Password123', // This will be hashed by the model
      phone: '9876543210'
    });

    await testUser.save();
    console.log('✅ Created new test user in Atlas');
    console.log('');
    console.log('🎯 Test Login Credentials:');
    console.log('Email: test@zerowastedelhi.com');
    console.log('Password: Password123');
    console.log('');
    console.log('✅ Atlas database is ready with proper test user!');

  } catch (error) {
    console.error('❌ Error fixing test user:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('📤 Disconnected from Atlas');
  }
}

fixTestUser();