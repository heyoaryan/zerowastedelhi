import SimpleWasteEntry from '../models/SimpleWasteEntry.js';
import SimpleUser from '../models/SimpleUser.js';
import { sendWasteCollectionConfirmation, sendAdminNotification } from '../services/emailService.js';

// Add waste entry without complex authentication
export const addSimpleWasteEntry = async (req, res) => {
  console.log('🗑️ Processing simple waste entry...');
  console.log('📊 Request body:', req.body);
  
  try {
    const { 
      userName, 
      userEmail, 
      wasteType, 
      weight, 
      description, 
      userLocation,
      sessionId 
    } = req.body;

    // Validate required fields
    if (!wasteType || !weight || !userLocation) {
      return res.status(400).json({
        success: false,
        message: 'Waste type, weight, and location are required'
      });
    }

    if (!userLocation.latitude || !userLocation.longitude) {
      return res.status(400).json({
        success: false,
        message: 'User location coordinates are required'
      });
    }

    console.log('📍 User location:', userLocation);

    // Get or create user
    let user = null;
    if (userEmail) {
      user = await SimpleUser.findOne({ email: userEmail });
      if (!user) {
        user = new SimpleUser({
          name: userName || 'Anonymous User',
          email: userEmail,
          sessionId: sessionId || Date.now().toString()
        });
        await user.save();
        console.log('✅ Created new simple user:', user.name);
      } else {
        // Update session
        user.sessionId = sessionId || Date.now().toString();
        user.lastActive = new Date();
        await user.save();
        console.log('✅ Updated existing user session:', user.name);
      }
    }

    // Detect location
    let detectedLocation = {
      name: 'Delhi NCR',
      area: 'Delhi NCR Area',
      source: 'fallback'
    };

    try {
      const { getRealTimeLocation } = await import('../services/realTimeLocation.js');
      detectedLocation = await getRealTimeLocation(userLocation.latitude, userLocation.longitude);
      console.log('✅ Location detected:', detectedLocation.name);
    } catch (locationError) {
      console.log('⚠️ Location detection failed, using fallback');
    }

    // Create waste entry
    const wasteEntryData = {
      userName: userName || 'Anonymous User',
      userEmail: userEmail || null,
      wasteType,
      weight: parseFloat(weight),
      description: description || `${wasteType} waste entry`,
      location: {
        coordinates: {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude
        },
        address: userLocation.address || detectedLocation.name,
        detectedLocation: {
          name: detectedLocation.name,
          area: detectedLocation.area,
          source: detectedLocation.source
        }
      },
      sessionId: sessionId || Date.now().toString(),
      submittedAt: new Date()
    };

    console.log('💾 Creating waste entry:', wasteEntryData);

    const wasteEntry = new SimpleWasteEntry(wasteEntryData);
    await wasteEntry.save();

    console.log('✅ Waste entry saved successfully:', wasteEntry._id);
    console.log('🎯 Points earned:', wasteEntry.pointsEarned);

    // Update user stats if user exists
    if (user) {
      user.totalWasteEntries += 1;
      user.totalWasteWeight += parseFloat(weight);
      user.totalPoints += wasteEntry.pointsEarned;
      user.totalCarbonSaved += wasteEntry.carbonFootprintSaved;
      await user.save();
      console.log('✅ User stats updated');
    }

    // Send confirmation email if user has email
    if (userEmail) {
      sendWasteCollectionConfirmation(userEmail, userName, {
        type: wasteType,
        weight: weight,
        location: detectedLocation.name,
        points: wasteEntry.pointsEarned
      }).catch(err => {
        console.error('Failed to send waste collection confirmation:', err);
      });
    }

    // Notify admin of waste entry
    sendAdminNotification(
      'New Waste Entry',
      `Waste entry submitted by ${userName} (${userEmail || 'No email'})`,
      {
        wasteType,
        weight,
        location: detectedLocation.name,
        points: wasteEntry.pointsEarned,
        entryId: wasteEntry._id
      }
    ).catch(err => {
      console.error('Failed to send admin notification:', err);
    });

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Waste entry added successfully',
      data: {
        entryId: wasteEntry._id,
        wasteType: wasteEntry.wasteType,
        weight: wasteEntry.weight,
        pointsEarned: wasteEntry.pointsEarned,
        carbonFootprintSaved: wasteEntry.carbonFootprintSaved,
        location: {
          detected: detectedLocation.name,
          area: detectedLocation.area
        },
        submittedAt: wasteEntry.submittedAt
      },
      user: user ? {
        name: user.name,
        totalEntries: user.totalWasteEntries,
        totalPoints: user.totalPoints,
        totalWeight: user.totalWasteWeight
      } : null
    });

  } catch (error) {
    console.error('❌ Error adding simple waste entry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add waste entry',
      error: error.message
    });
  }
};

// Get user's waste entries
export const getSimpleWasteEntries = async (req, res) => {
  try {
    const { userEmail, sessionId } = req.query;

    let query = {};
    if (userEmail) {
      query.userEmail = userEmail;
    } else if (sessionId) {
      query.sessionId = sessionId;
    } else {
      return res.status(400).json({
        success: false,
        message: 'User email or session ID required'
      });
    }

    const entries = await SimpleWasteEntry.find(query)
      .sort({ submittedAt: -1 })
      .limit(50);

    const totalStats = await SimpleWasteEntry.aggregate([
      { $match: query },
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

    res.json({
      success: true,
      entries,
      stats: totalStats[0] || {
        totalEntries: 0,
        totalWeight: 0,
        totalPoints: 0,
        totalCarbonSaved: 0
      }
    });

  } catch (error) {
    console.error('Error fetching waste entries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch waste entries',
      error: error.message
    });
  }
};

// Get user stats
export const getSimpleUserStats = async (req, res) => {
  try {
    const { userEmail, sessionId } = req.query;

    let user = null;
    if (userEmail) {
      user = await SimpleUser.findOne({ email: userEmail });
    }

    if (!user) {
      return res.json({
        success: true,
        stats: {
          totalEntries: 0,
          totalWeight: 0,
          totalPoints: 0,
          totalCarbonSaved: 0
        }
      });
    }

    res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        joinedDate: user.createdAt
      },
      stats: {
        totalEntries: user.totalWasteEntries,
        totalWeight: user.totalWasteWeight,
        totalPoints: user.totalPoints,
        totalCarbonSaved: user.totalCarbonSaved
      }
    });

  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user stats',
      error: error.message
    });
  }
};

// Simple login/register
export const simpleAuth = async (req, res) => {
  try {
    const { name, email, action } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required'
      });
    }

    let user = await SimpleUser.findOne({ email });

    if (action === 'register' || !user) {
      if (!user) {
        user = new SimpleUser({
          name,
          email,
          sessionId: Date.now().toString()
        });
        await user.save();
        console.log('✅ New user registered:', user.name);
      }
    }

    // Update session
    user.sessionId = Date.now().toString();
    user.lastActive = new Date();
    await user.save();

    res.json({
      success: true,
      message: action === 'register' ? 'User registered successfully' : 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        sessionId: user.sessionId,
        totalEntries: user.totalWasteEntries,
        totalPoints: user.totalPoints,
        totalWeight: user.totalWasteWeight
      }
    });

  } catch (error) {
    console.error('Error in simple auth:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed',
      error: error.message
    });
  }
};