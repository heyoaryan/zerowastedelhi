import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// User schema (simplified version)
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

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

async function createTestUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@zerowastedelhi.com' });
    if (existingUser) {
      console.log('⚠️ Test user already exists');
      console.log('Email: test@zerowastedelhi.com');
      console.log('Password: password123');
      process.exit(0);
    }

    // Create test user
    const testUser = new User({
      name: 'Test User',
      email: 'test@zerowastedelhi.com',
      password: 'password123',
      phone: '9876543210'
    });

    await testUser.save();
    console.log('✅ Test user created successfully!');
    console.log('');
    console.log('Login credentials:');
    console.log('Email: test@zerowastedelhi.com');
    console.log('Password: password123');
    console.log('');
    console.log('You can now test proper authentication with these credentials.');

  } catch (error) {
    console.error('❌ Error creating test user:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('📤 Disconnected from MongoDB');
  }
}

createTestUser();