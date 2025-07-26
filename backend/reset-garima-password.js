import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import User model
import User from './models/User.js';

async function resetGarimaPassword() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🔑 Resetting Garima\'s Password');
    console.log('==============================');
    
    // Find Garima's user account
    const user = await User.findOne({ email: 'jaingarima360@gmail.com' });
    
    if (user) {
      console.log('✅ Found Garima\'s account:', user.name);
      
      // Set new password
      user.password = 'Password123'; // This will be hashed by the model
      await user.save();
      
      console.log('✅ Password reset successfully');
      console.log('');
      console.log('🎯 NEW LOGIN CREDENTIALS:');
      console.log('Email: jaingarima360@gmail.com');
      console.log('Password: Password123');
      console.log('');
      console.log('🔧 NEXT STEPS:');
      console.log('1. Log out of current session');
      console.log('2. Log in with the above credentials');
      console.log('3. Dashboard should show: 20kg waste, 100 points');
      
    } else {
      console.log('❌ Garima\'s account not found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('📤 Disconnected from Atlas');
  }
}

resetGarimaPassword();