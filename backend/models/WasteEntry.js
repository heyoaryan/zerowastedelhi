import mongoose from 'mongoose';

const wasteEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WasteBin',
    required: true
  },
  wasteType: {
    type: String,
    enum: ['organic', 'recyclable', 'hazardous', 'general'],
    required: true
  },
  weight: {
    type: Number,
    required: true,
    min: 0
  },
  description: String,
  images: [String], // URLs to uploaded images
  location: {
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    address: String
  },
  pointsEarned: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verificationDate: Date,
  rejectionReason: String,
  carbonFootprintSaved: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate points based on waste type and weight
wasteEntrySchema.pre('save', function(next) {
  if (this.isNew || this.isModified('weight') || this.isModified('wasteType')) {
    const pointsPerKg = {
      organic: 2,
      recyclable: 5,
      hazardous: 10,
      general: 1
    };
    
    this.pointsEarned = Math.round(this.weight * pointsPerKg[this.wasteType]);
    
    // Calculate carbon footprint saved (kg CO2 equivalent)
    const carbonSavingPerKg = {
      organic: 0.5,
      recyclable: 2.0,
      hazardous: 3.0,
      general: 0.2
    };
    
    this.carbonFootprintSaved = this.weight * carbonSavingPerKg[this.wasteType];
  }
  next();
});

export default mongoose.model('WasteEntry', wasteEntrySchema);