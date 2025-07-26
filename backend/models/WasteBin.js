import mongoose from 'mongoose';

const wasteBinSchema = new mongoose.Schema({
  binId: {
    type: String,
    required: true,
    unique: true
  },
  location: {
    address: {
      type: String,
      required: true
    },
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
    area: String,
    landmark: String
  },
  type: {
    type: String,
    enum: ['organic', 'recyclable', 'hazardous', 'general'],
    required: true
  },
  capacity: {
    total: {
      type: Number,
      required: true,
      min: 0
    },
    current: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  status: {
    type: String,
    enum: ['active', 'full', 'maintenance', 'inactive'],
    default: 'active'
  },
  lastEmptied: {
    type: Date,
    default: Date.now
  },
  nextCollection: Date,
  assignedCollector: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  maintenanceHistory: [{
    date: {
      type: Date,
      default: Date.now
    },
    type: {
      type: String,
      enum: ['cleaning', 'repair', 'replacement']
    },
    description: String,
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  sensors: {
    fillLevel: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    temperature: Number,
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true
});

// Calculate fill percentage
wasteBinSchema.virtual('fillPercentage').get(function() {
  return Math.round((this.capacity.current / this.capacity.total) * 100);
});

// Update status based on capacity
wasteBinSchema.methods.updateStatus = function() {
  const fillPercentage = this.fillPercentage;
  if (fillPercentage >= 90) {
    this.status = 'full';
  } else if (this.status === 'full' && fillPercentage < 80) {
    this.status = 'active';
  }
};

export default mongoose.model('WasteBin', wasteBinSchema);