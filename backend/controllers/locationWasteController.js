import LocationWasteTracker from '../models/LocationWasteTracker.js';
import { delhiLocations } from '../services/locationService.js';

// Get location-wise waste statistics
export const getLocationWasteStats = async (req, res) => {
  try {
    const stats = await LocationWasteTracker.getLocationStats();
    
    res.status(200).json({
      success: true,
      locationStats: stats,
      totalLocations: stats.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching location waste statistics',
      error: error.message
    });
  }
};

// Get user's location history
export const getUserLocationHistory = async (req, res) => {
  try {
    const history = await LocationWasteTracker.getUserLocationHistory(req.user.id);
    
    res.status(200).json({
      success: true,
      locationHistory: history,
      totalEntries: history.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user location history',
      error: error.message
    });
  }
};

// Get waste entries for a specific location
export const getWasteEntriesForLocation = async (req, res) => {
  try {
    const { locationName } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const entries = await LocationWasteTracker.find({
      'detectedLocation.name': new RegExp(locationName, 'i')
    })
    .populate('user', 'name email')
    .populate('wasteEntry', 'createdAt status')
    .populate('binUsed', 'binId type')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    const total = await LocationWasteTracker.countDocuments({
      'detectedLocation.name': new RegExp(locationName, 'i')
    });

    // Get summary stats for this location
    const locationStats = await LocationWasteTracker.aggregate([
      { $match: { 'detectedLocation.name': new RegExp(locationName, 'i') } },
      {
        $group: {
          _id: null,
          totalEntries: { $sum: 1 },
          totalWeight: { $sum: '$wasteDetails.weight' },
          totalPoints: { $sum: '$wasteDetails.pointsEarned' },
          totalCarbonSaved: { $sum: '$wasteDetails.carbonFootprintSaved' },
          uniqueUsers: { $addToSet: '$user' },
          wasteTypes: { $push: '$wasteDetails.type' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      locationName,
      entries,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalEntries: total
      },
      locationSummary: locationStats[0] || {
        totalEntries: 0,
        totalWeight: 0,
        totalPoints: 0,
        totalCarbonSaved: 0,
        uniqueUsers: [],
        wasteTypes: []
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching location entries',
      error: error.message
    });
  }
};

// Get top performing locations
export const getTopPerformingLocations = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const topLocations = await LocationWasteTracker.aggregate([
      {
        $group: {
          _id: {
            name: '$detectedLocation.name',
            area: '$detectedLocation.area'
          },
          totalEntries: { $sum: 1 },
          totalWeight: { $sum: '$wasteDetails.weight' },
          totalPoints: { $sum: '$wasteDetails.pointsEarned' },
          totalCarbonSaved: { $sum: '$wasteDetails.carbonFootprintSaved' },
          uniqueUsers: { $addToSet: '$user' },
          avgWeight: { $avg: '$wasteDetails.weight' }
        }
      },
      {
        $project: {
          locationName: '$_id.name',
          locationArea: '$_id.area',
          totalEntries: 1,
          totalWeight: { $round: ['$totalWeight', 2] },
          totalPoints: 1,
          totalCarbonSaved: { $round: ['$totalCarbonSaved', 2] },
          uniqueUserCount: { $size: '$uniqueUsers' },
          avgWeight: { $round: ['$avgWeight', 2] },
          _id: 0
        }
      },
      { $sort: { totalPoints: -1 } },
      { $limit: limit }
    ]);

    res.status(200).json({
      success: true,
      topLocations,
      count: topLocations.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching top performing locations',
      error: error.message
    });
  }
};

// Get location waste trends (monthly data)
export const getLocationWasteTrends = async (req, res) => {
  try {
    const { locationName } = req.params;
    const months = parseInt(req.query.months) || 6;
    
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const trends = await LocationWasteTracker.aggregate([
      {
        $match: {
          'detectedLocation.name': new RegExp(locationName, 'i'),
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            location: '$detectedLocation.name'
          },
          entries: { $sum: 1 },
          weight: { $sum: '$wasteDetails.weight' },
          points: { $sum: '$wasteDetails.pointsEarned' },
          carbonSaved: { $sum: '$wasteDetails.carbonFootprintSaved' },
          uniqueUsers: { $addToSet: '$user' }
        }
      },
      {
        $project: {
          year: '$_id.year',
          month: '$_id.month',
          location: '$_id.location',
          entries: 1,
          weight: { $round: ['$weight', 2] },
          points: 1,
          carbonSaved: { $round: ['$carbonSaved', 2] },
          uniqueUserCount: { $size: '$uniqueUsers' },
          _id: 0
        }
      },
      { $sort: { year: 1, month: 1 } }
    ]);

    res.status(200).json({
      success: true,
      locationName,
      trends,
      periodMonths: months
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching location trends',
      error: error.message
    });
  }
};