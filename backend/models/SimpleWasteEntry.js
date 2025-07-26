import mongoose from 'mongoose';

// Simple waste entry model that doesn't require complex authentication
const simpleWasteEntrySchema = new mongoose.Schema({
  // User information (can be stored without complex auth)
  userName: {
    type: String,
    required: true,
    default: 'Anonymous User'
  },
  userEmail: {
    type: String,
    required: false
  },
  
  // Waste details
  wasteType: {
    type: String,
    enum: ['organic', 'recyclable', 'hazardous', 'general', 'plastic', 'paper', 'glass', 'metal', 'e-waste'],
    required: true
  },
  weight: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    default: ''
  },
  
  // Location information
  location: {
    coordinates: {
      latitude: {
        type: Number,
        required: true
      },
      longitude: {
        type: Number,
        required: true
      }
    },
    address: {
      type: String,
      required: true
    },
    detectedLocation: {
      name: String,
      area: String,
      source: String
    }
  },
  
  // Bin information
  binId: {
    type: String,
    default: 'MANUAL_ENTRY'
  },
  
  // Points and rewards
  pointsEarned: {
    type: Number,
    default: 0
  },
  carbonFootprintSaved: {
    type: Number,
    default: 0
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'verified', 'completed'],
    default: 'completed'
  },
  
  // Timestamps
  submittedAt: {
    type: Date,
    default: Date.now
  },
  
  // Session tracking (simple)
  sessionId: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

// Calculate points before saving
simpleWasteEntrySchema.pre('save', function(next) {
  if (this.isNew || this.isModified('weight') || this.isModified('wasteType')) {
    const pointsPerKg = {
      organic: 2,
      recyclable: 5,
      hazardous: 10,
      general: 1,
      plastic: 5,
      paper: 3,
      glass: 4,
      metal: 6,
      'e-waste': 10
    };
    
    this.pointsEarned = Math.round(this.weight * (pointsPerKg[this.wasteType] || 1));
    
    // Calculate carbon footprint saved (kg CO2 equivalent)
    const carbonSavingPerKg = {
      organic: 0.5,
      recyclable: 2.0,
      hazardous: 3.0,
      general: 0.2,
      plastic: 2.5,
      paper: 1.5,
      glass: 1.8,
      metal: 3.2,
      'e-waste': 4.0
    };
    
    this.carbonFootprintSaved = this.weight * (carbonSavingPerKg[this.wasteType] || 0.2);
  }
  next();
});

export default mongoose.model('SimpleWasteEntry', simpleWasteEntrySchema);