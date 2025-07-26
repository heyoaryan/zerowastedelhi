import express from 'express';
import mongoose from 'mongoose';
import WasteBin from '../models/WasteBin.js';
import User from '../models/User.js';
import WasteEntry from '../models/WasteEntry.js';

const router = express.Router();

// Test database connection
router.get('/test-db', async (req, res) => {
  try {
    // Test MongoDB connection
    const dbState = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    if (dbState !== 1) {
      return res.status(500).json({
        success: false,
        message: `Database ${states[dbState]}`,
        state: dbState
      });
    }

    // Test collections
    const binCount = await WasteBin.countDocuments();
    const userCount = await User.countDocuments();
    const entryCount = await WasteEntry.countDocuments();

    res.status(200).json({
      success: true,
      message: 'Database connected successfully',
      stats: {
        bins: binCount,
        users: userCount,
        entries: entryCount
      },
      database: mongoose.connection.name,
      host: mongoose.connection.host
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database test failed',
      error: error.message
    });
  }
});

// Get all bins for testing
router.get('/bins', async (req, res) => {
  try {
    const bins = await WasteBin.find().limit(10);
    res.status(200).json({
      success: true,
      bins,
      count: bins.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bins',
      error: error.message
    });
  }
});

// Test location detection
router.get('/test-location', async (req, res) => {
  try {
    const { latitude = 28.6315, longitude = 77.2167 } = req.query;
    
    const { getAccurateLocation } = await import('../services/locationService.js');
    const location = await getAccurateLocation(parseFloat(latitude), parseFloat(longitude));
    
    res.status(200).json({
      success: true,
      location,
      coordinates: { latitude: parseFloat(latitude), longitude: parseFloat(longitude) }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Location test failed',
      error: error.message
    });
  }
});

export default router;