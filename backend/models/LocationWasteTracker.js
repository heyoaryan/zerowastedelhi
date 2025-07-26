import mongoose from 'mongoose';

const locationWasteTrackerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  wasteEntry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WasteEntry',
    required: true
  },
  detectedLocation: {
    name: {
      type: String,
      required: true
    },
    area: {
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
    landmarks: [String],
    distanceFromUser: {
      type: Number,
      default: 0
    }
  },
  userLocation: {
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
    address: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  binUsed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WasteBin',
    required: true
  },
  binLocation: {
    area: String,
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    distanceFromUser: Number
  },
  wasteDetails: {
    type: {
      type: String,
      enum: ['organic', 'recyclable', 'hazardous', 'general'],
      required: true
    },
    weight: {
      type: Number,
      required: true
    },
    pointsEarned: {
      type: Number,
      default: 0
    },
    carbonFootprintSaved: {
      type: Number,
      default: 0
    }
  },
  locationAccuracy: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  },
  isLocationVerified: {
    type: Boolean,
    default: false
  },
  verificationMethod: {
    type: String,
    enum: ['gps', 'manual', 'bin_proximity'],
    default: 'gps'
  },
  additionalNotes: String
}, {
  timestamps: true
});

// Index for efficient queries
locationWasteTrackerSchema.index({ user: 1, createdAt: -1 });
locationWasteTrackerSchema.index({ 'detectedLocation.name': 1 });
locationWasteTrackerSchema.index({ 'detectedLocation.area': 1 });
locationWasteTrackerSchema.index({ 'userLocation.coordinates.latitude': 1, 'userLocation.coordinates.longitude': 1 });

// Static method to get location-wise waste statistics
locationWasteTrackerSchema.statics.getLocationStats = async function() {
  return await this.aggregate([
    {
      $group: {
        _id: {
          locationName: '$detectedLocation.name',
          locationArea: '$detectedLocation.area'
        },
        totalEntries: { $sum: 1 },
        totalWeight: { $sum: '$wasteDetails.weight' },
        totalPoints: { $sum: '$wasteDetails.pointsEarned' },
        totalCarbonSaved: { $sum: '$wasteDetails.carbonFootprintSaved' },
        uniqueUsers: { $addToSet: '$user' },
        wasteTypes: { $addToSet: '$wasteDetails.type' }
      }
    },
    {
      $project: {
        locationName: '$_id.locationName',
        locationArea: '$_id.locationArea',
        totalEntries: 1,
        totalWeight: { $round: ['$totalWeight', 2] },
        totalPoints: 1,
        totalCarbonSaved: { $round: ['$totalCarbonSaved', 2] },
        uniqueUserCount: { $size: '$uniqueUsers' },
        wasteTypesCount: { $size: '$wasteTypes' },
        _id: 0
      }
    },
    { $sort: { totalEntries: -1 } }
  ]);
};

// Static method to get user's location history
locationWasteTrackerSchema.statics.getUserLocationHistory = async function(userId) {
  return await this.find({ user: userId })
    .populate('wasteEntry', 'createdAt status')
    .populate('binUsed', 'binId type')
    .sort({ createdAt: -1 })
    .limit(50);
};

export default mongoose.model('LocationWasteTracker', locationWasteTrackerSchema);