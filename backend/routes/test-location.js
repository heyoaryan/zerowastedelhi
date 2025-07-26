import express from 'express';

const router = express.Router();

// Test location detection with specific coordinates
router.get('/test/:lat/:lng', async (req, res) => {
  try {
    const { lat, lng } = req.params;
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    
    console.log(`🧪 Testing location detection for: ${latitude}, ${longitude}`);
    
    // Import the real-time location service
    const { getRealTimeLocation } = await import('../services/realTimeLocation.js');
    
    // Get location using real-time detection
    const detectedLocation = await getRealTimeLocation(latitude, longitude);
    
    console.log('📍 Detection result:', detectedLocation);
    
    // Also test reverse geocoding directly
    const geocodingUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
    
    let geocodingResult = null;
    try {
      const geocodingResponse = await fetch(geocodingUrl);
      if (geocodingResponse.ok) {
        geocodingResult = await geocodingResponse.json();
      }
    } catch (geocodingError) {
      console.log('Geocoding failed:', geocodingError.message);
    }
    
    res.json({
      success: true,
      input: { latitude, longitude },
      detectedLocation,
      geocodingResult,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Location test error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Force a specific location (for testing)
router.post('/force-location', async (req, res) => {
  try {
    const { latitude, longitude, name, area } = req.body;
    
    // Store forced location in memory (for testing only)
    global.forcedLocation = {
      coordinates: { latitude, longitude },
      name: name || 'Forced Location',
      area: area || 'Test Area',
      source: 'forced',
      accuracy: 'test',
      timestamp: new Date().toISOString()
    };
    
    console.log('🔧 Forced location set:', global.forcedLocation);
    
    res.json({
      success: true,
      message: 'Location forced for testing',
      forcedLocation: global.forcedLocation
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Clear forced location
router.delete('/force-location', (req, res) => {
  delete global.forcedLocation;
  console.log('🔧 Forced location cleared');
  
  res.json({
    success: true,
    message: 'Forced location cleared'
  });
});

export default router;