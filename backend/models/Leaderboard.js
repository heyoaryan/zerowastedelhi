import mongoose from 'mongoose';

const leaderboardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  totalWasteCollected: {
    type: Number,
    default: 0
  },
  carbonFootprintSaved: {
    type: Number,
    default: 0
  },
  rank: {
    type: Number,
    default: 0
  },
  monthlyStats: [{
    month: {
      type: Date,
      required: true
    },
    points: {
      type: Number,
      default: 0
    },
    wasteCollected: {
      type: Number,
      default: 0
    },
    carbonSaved: {
      type: Number,
      default: 0
    }
  }],
  achievements: [{
    type: {
      type: String,
      enum: ['first_entry', 'eco_warrior', 'recycling_champion', 'green_hero', 'waste_reducer']
    },
    earnedAt: {
      type: Date,
      default: Date.now
    },
    points: Number
  }],
  streaks: {
    current: {
      type: Number,
      default: 0
    },
    longest: {
      type: Number,
      default: 0
    },
    lastEntryDate: Date
  }
}, {
  timestamps: true
});

// Update rank based on total points
leaderboardSchema.statics.updateRanks = async function() {
  const users = await this.find().sort({ totalPoints: -1 });
  
  for (let i = 0; i < users.length; i++) {
    users[i].rank = i + 1;
    await users[i].save();
  }
};

export default mongoose.model('Leaderboard', leaderboardSchema);