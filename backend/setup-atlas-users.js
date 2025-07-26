import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// User schema (same as your existing one)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  role: { type: String, default: 'user' },
  points: { type: Number, default: 0 },
  level: { type: String, default: 'Beginner' },
  totalWasteCollected: { type: Number, default: 0 }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);

async function setupAtlasUsers() {
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Create test user
    const testUser = {
      name: 'Test User',
      email: 'test@zerowastedelhi.com',
      password: 'Password123',
      phone: '9876543210'
    };

    const existingUser = await User.findOne({ email: testUser.email });
    if (existingUser) {
      console.log('⚠️ Test user already exists in Atlas');
    } else {
      const user = new User(testUser);
      await user.save();
      console.log('✅ Test user created in Atlas');
    }

    console.log('');
    console.log('🎯 Atlas Database Ready!');
    console.log('Test login credentials:');
    console.log('Email: test@zerowastedelhi.com');
    console.log('Password: Password123');
    console.log('');
    console.log('Your backend is now using MongoDB Atlas cloud database!');

  } catch (error) {
    console.error('❌ Error setting up Atlas users:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('📤 Disconnected from Atlas');
  }
}

setupAtlasUsers();