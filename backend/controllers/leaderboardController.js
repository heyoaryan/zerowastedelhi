import Leaderboard from '../models/Leaderboard.js';
import User from '../models/User.js';

// Get Global Leaderboard
export const getGlobalLeaderboard = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const leaderboard = await Leaderboard.find()
      .populate('user', 'name email level')
      .sort({ totalPoints: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Leaderboard.countDocuments();

    // Update ranks
    await Leaderboard.updateRanks();

    res.status(200).json({
      success: true,
      leaderboard,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching leaderboard',
      error: error.message
    });
  }
};

// Get User Rank
export const getUserRank = async (req, res) => {
  try {
    const userLeaderboard = await Leaderboard.findOne({ user: req.user.id })
      .populate('user', 'name email level');

    if (!userLeaderboard) {
      return res.status(404).json({
        success: false,
        message: 'User not found in leaderboard'
      });
    }

    // Get users above and below current user
    const usersAbove = await Leaderboard.find({
      totalPoints: { $gt: userLeaderboard.totalPoints }
    }).countDocuments();

    const usersBelow = await Leaderboard.find({
      totalPoints: { $lt: userLeaderboard.totalPoints }
    }).countDocuments();

    const rank = usersAbove + 1;

    res.status(200).json({
      success: true,
      userRank: {
        ...userLeaderboard.toObject(),
        rank,
        usersAbove,
        usersBelow
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user rank',
      error: error.message
    });
  }
};

// Get Monthly Leaderboard
export const getMonthlyLeaderboard = async (req, res) => {
  try {
    const { year, month } = req.query;
    const currentDate = new Date();
    const targetYear = year || currentDate.getFullYear();
    const targetMonth = month || currentDate.getMonth() + 1;

    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0);

    const monthlyLeaderboard = await Leaderboard.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      {
        $unwind: '$monthlyStats'
      },
      {
        $match: {
          'monthlyStats.month': {
            $gte: startDate,
            $lte: endDate
          }
        }
      },
      {
        $sort: { 'monthlyStats.points': -1 }
      },
      {
        $limit: 50
      },
      {
        $project: {
          user: { $arrayElemAt: ['$userInfo', 0] },
          monthlyPoints: '$monthlyStats.points',
          monthlyWaste: '$monthlyStats.wasteCollected',
          monthlyCarbonSaved: '$monthlyStats.carbonSaved'
        }
      }
    ]);

    res.status(200).json({
      success: true,
      month: `${targetYear}-${targetMonth.toString().padStart(2, '0')}`,
      leaderboard: monthlyLeaderboard
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching monthly leaderboard',
      error: error.message
    });
  }
};

// Get Leaderboard Statistics
export const getLeaderboardStats = async (req, res) => {
  try {
    const stats = await Leaderboard.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          totalPoints: { $sum: '$totalPoints' },
          totalWasteCollected: { $sum: '$totalWasteCollected' },
          totalCarbonSaved: { $sum: '$carbonFootprintSaved' },
          avgPointsPerUser: { $avg: '$totalPoints' },
          avgWastePerUser: { $avg: '$totalWasteCollected' }
        }
      }
    ]);

    // Get top performers
    const topPerformers = await Leaderboard.find()
      .populate('user', 'name level')
      .sort({ totalPoints: -1 })
      .limit(3);

    res.status(200).json({
      success: true,
      stats: stats[0] || {},
      topPerformers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching leaderboard statistics',
      error: error.message
    });
  }
};