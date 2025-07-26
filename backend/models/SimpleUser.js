import mongoose from 'mongoose';

// Simple user model for session management
const simpleUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: false
  },
  
  // Simple session management
  sessionId: {
    type: String,
    required: false
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  
  // Stats
  totalWasteEntries: {
    type: Number,
    default: 0
  },
  totalWasteWeight: {
    type: Number,
    default: 0
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  totalCarbonSaved: {
    type: Number,
    default: 0
  },
  
  // Simple password (for basic auth)
  password: {
    type: String,
    required: false
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Update last active on save
simpleUserSchema.pre('save', function(next) {
  this.lastActive = new Date();
  next();
});

export default mongoose.model('SimpleUser', simpleUserSchema);