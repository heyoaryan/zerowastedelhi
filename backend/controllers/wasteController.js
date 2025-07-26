import mongoose from 'mongoose';
import WasteEntry from '../models/WasteEntry.js';
import WasteBin from '../models/WasteBin.js';
import User from '../models/User.js';
import Leaderboard from '../models/Leaderboard.js';
import LocationWasteTracker from '../models/LocationWasteTracker.js';
import { findNearestLocation, calculateDistance } from '../services/locationService.js';

// Add Waste Entry
export const addWasteEntry = async (req, res) => {
  console.log('🗑️ Processing waste entry request...');
  console.log('📊 Request body:', req.body);
  console.log('👤 User:', req.user?.name || req.user?.id);
  
  try {
    const { binId, wasteType, weight, description, location, userLocation } = req.body;

    // Validate required location data
    if (!userLocation || !userLocation.latitude || !userLocation.longitude) {
      console.log('❌ Missing location data');
      return res.status(400).json({
        success: false,
        message: 'User location (latitude and longitude) is required'
      });
    }

    console.log('📍 User location:', userLocation);

    // Find the waste bin or create a default one if not found
    let bin = await WasteBin.findOne({ binId });
    
    if (!bin) {
      console.log(`⚠️ Bin ${binId} not found, creating default bin entry`);
      
      // Create a default bin for manual entries or missing bins
      bin = new WasteBin({
        binId: binId || 'MANUAL_ENTRY',
        location: {
          address: userLocation.address || 'Manual Entry Location',
          coordinates: {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude
          },
          area: 'Delhi NCR',
          landmark: 'Manual Entry'
        },
        type: 'general',
        capacity: {
          total: 1000, // Large capacity for manual entries
          current: 0
        },
        status: 'active'
      });
      
      try {
        await bin.save();
        console.log(`✅ Created default bin: ${bin.binId}`);
      } catch (error) {
        console.error('⚠️ Error creating default bin:', error);
        // If bin creation fails, continue with a temporary bin object
        bin = {
          _id: new mongoose.Types.ObjectId(),
          binId: binId || 'MANUAL_ENTRY',
          location: {
            address: userLocation.address || 'Manual Entry Location',
            coordinates: {
              latitude: userLocation.latitude,
              longitude: userLocation.longitude
            }
          },
          type: 'general',
          capacity: { total: 1000, current: 0 },
          status: 'active',
          updateStatus: () => {},
          save: async () => {}
        };
      }
    } else {
      console.log(`✅ Found existing bin: ${bin.binId}`);
    }

    // Detect user's location using accurate GPS detection
    const { getAccurateGPSLocation } = await import('../services/accurateLocation.js');
    let detectedLocation;
    
    try {
      detectedLocation = await getAccurateGPSLocation(userLocation.latitude, userLocation.longitude);
      console.log('✅ Accurate GPS location detected:', detectedLocation);
    } catch (error) {
      console.log('⚠️ Accurate GPS location detection failed, using fallback location');
      detectedLocation = {
        name: userLocation.address || `Location ${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}`,
        area: 'Delhi NCR',
        coordinates: {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude
        },
        landmarks: ['Manual Entry'],
        distanceFromUser: 0,
        source: 'fallback',
        accuracy: 'low'
      };
    }

    // Calculate distance from user to bin
    const distanceToBin = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      bin.location.coordinates.latitude,
      bin.location.coordinates.longitude
    );

    console.log('💾 Creating waste entry in database...');

    // Create waste entry with explicit database save
    const wasteEntryData = {
      user: req.user._id || req.user.id,
      bin: bin._id,
      wasteType,
      weight: parseFloat(weight),
      description: description || `${wasteType} waste entry`,
      location: {
        coordinates: {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude
        },
        address: userLocation.address || detectedLocation.name
      }
    };

    console.log('📝 Waste entry data:', wasteEntryData);

    const wasteEntry = new WasteEntry(wasteEntryData);
    await wasteEntry.save();
    
    console.log('✅ Waste entry saved to database:', wasteEntry._id);
    console.log('🎯 Points earned:', wasteEntry.pointsEarned);

    // Create location waste tracker entry
    console.log('📍 Creating location tracker entry...');
    
    const locationTrackerData = {
      user: req.user._id || req.user.id,
      wasteEntry: wasteEntry._id,
      detectedLocation: {
        name: detectedLocation.name,
        area: detectedLocation.area,
        coordinates: detectedLocation.coordinates,
        landmarks: detectedLocation.landmarks || [],
        distanceFromUser: detectedLocation.distanceFromUser || 0
      },
      userLocation: {
        coordinates: {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude
        },
        address: userLocation.address || `${detectedLocation.name}, ${detectedLocation.area}`,
        timestamp: new Date()
      },
      binUsed: bin._id,
      binLocation: {
        area: bin.location.area,
        address: bin.location.address,
        coordinates: bin.location.coordinates,
        distanceFromUser: parseFloat(distanceToBin.toFixed(2))
      },
      wasteDetails: {
        type: wasteType,
        weight: parseFloat(weight),
        pointsEarned: wasteEntry.pointsEarned,
        carbonFootprintSaved: wasteEntry.carbonFootprintSaved
      },
      locationAccuracy: distanceToBin < 0.5 ? 'high' : distanceToBin < 2 ? 'medium' : 'low',
      verificationMethod: 'gps'
    };

    const locationTracker = new LocationWasteTracker(locationTrackerData);
    await locationTracker.save();
    
    console.log('✅ Location tracker saved:', locationTracker._id);

    // Update user stats (skip for fallback users)
    if (!req.user.id || !req.user.id.toString().startsWith('fallback-user-id')) {
      try {
        const user = await User.findById(req.user._id || req.user.id);
        if (user) {
          user.totalWasteCollected += parseFloat(weight);
          user.points += wasteEntry.pointsEarned;
          user.updateLevel();
          await user.save();
          console.log('✅ User stats updated:', user.name);

          // Update leaderboard
          let leaderboardEntry = await Leaderboard.findOne({ user: user._id });
          if (leaderboardEntry) {
            leaderboardEntry.totalPoints += wasteEntry.pointsEarned;
            leaderboardEntry.totalWasteCollected += parseFloat(weight);
            leaderboardEntry.carbonFootprintSaved += wasteEntry.carbonFootprintSaved;
            await leaderboardEntry.save();
            console.log('✅ Leaderboard updated');
          } else {
            // Create new leaderboard entry
            leaderboardEntry = new Leaderboard({
              user: user._id,
              totalPoints: wasteEntry.pointsEarned,
              totalWasteCollected: parseFloat(weight),
              carbonFootprintSaved: wasteEntry.carbonFootprintSaved
            });
            await leaderboardEntry.save();
            console.log('✅ New leaderboard entry created');
          }
        }
      } catch (userUpdateError) {
        console.error('⚠️ Error updating user stats:', userUpdateError);
        // Continue even if user update fails
      }
    } else {
      console.log('⚠️ Skipping user stats update for fallback user');
    }

    // Update bin capacity (only for real bins)
    if (bin.save && typeof bin.save === 'function') {
      try {
        bin.capacity.current += parseFloat(weight);
        if (bin.updateStatus && typeof bin.updateStatus === 'function') {
          bin.updateStatus();
        }
        await bin.save();
        console.log('✅ Bin capacity updated');
      } catch (binUpdateError) {
        console.error('⚠️ Error updating bin:', binUpdateError);
      }
    }

    // Populate bin data for response
    await wasteEntry.populate('bin', 'binId location type');

    console.log('🎉 Waste entry process completed successfully');

    res.status(201).json({
      success: true,
      message: 'Waste entry added successfully to database',
      wasteEntry: {
        _id: wasteEntry._id,
        wasteType: wasteEntry.wasteType,
        weight: wasteEntry.weight,
        pointsEarned: wasteEntry.pointsEarned,
        carbonFootprintSaved: wasteEntry.carbonFootprintSaved,
        createdAt: wasteEntry.createdAt,
        bin: wasteEntry.bin
      },
      locationInfo: {
        detectedLocation: detectedLocation.name,
        area: detectedLocation.area,
        source: detectedLocation.source,
        accuracy: detectedLocation.accuracy,
        distanceToBin: parseFloat(distanceToBin.toFixed(2))
      },
      pointsEarned: wasteEntry.pointsEarned,
      trackingId: locationTracker._id,
      databaseSaved: true
    });
    
  } catch (error) {
    console.error('❌ Error in addWasteEntry:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding waste entry',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Get User's Waste Entries
export const getUserWasteEntries = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const wasteEntries = await WasteEntry.find({ user: req.user.id })
      .populate('bin', 'binId location type')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await WasteEntry.countDocuments({ user: req.user.id });

    res.status(200).json({
      success: true,
      wasteEntries,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalEntries: total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching waste entries',
      error: error.message
    });
  }
};

// Get Waste Statistics
export const getWasteStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's total stats
    const userStats = await WasteEntry.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalEntries: { $sum: 1 },
          totalWeight: { $sum: '$weight' },
          totalPoints: { $sum: '$pointsEarned' },
          totalCarbonSaved: { $sum: '$carbonFootprintSaved' }
        }
      }
    ]);

    // Get stats by waste type
    const statsByType = await WasteEntry.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$wasteType',
          count: { $sum: 1 },
          weight: { $sum: '$weight' },
          points: { $sum: '$pointsEarned' }
        }
      }
    ]);

    // Get monthly stats for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyStats = await WasteEntry.aggregate([
      { 
        $match: { 
          user: userId,
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          entries: { $sum: 1 },
          weight: { $sum: '$weight' },
          points: { $sum: '$pointsEarned' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        overall: userStats[0] || { totalEntries: 0, totalWeight: 0, totalPoints: 0, totalCarbonSaved: 0 },
        byType: statsByType,
        monthly: monthlyStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching waste statistics',
      error: error.message
    });
  }
};