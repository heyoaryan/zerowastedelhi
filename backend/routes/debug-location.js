import express from 'express';

const router = express.Router();

// Debug location detection endpoint
router.get('/location-debug', async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    console.log(`🔍 DEBUG: Location detection for ${userLat}, ${userLon}`);

    // Import the accurate location service
    const { getAccurateGPSLocation } = await import('../services/accurateLocation.js');
    
    // Get detailed location detection results
    const locationResult = await getAccurateGPSLocation(userLat, userLon);

    // Also test with multiple geocoding services directly
    const geocodingTests = [];
    
    try {
      // Test Nominatim
      const nominatimResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLat}&lon=${userLon}&zoom=18&addressdetails=1&accept-language=en`,
        { headers: { 'User-Agent': 'ZeroWasteDelhi/1.0' } }
      );
      if (nominatimResponse.ok) {
        const nominatimData = await nominatimResponse.json();
        geocodingTests.push({
          service: 'Nominatim',
          raw: nominatimData,
          parsed: {
            locality: nominatimData.address?.neighbourhood || nominatimData.address?.suburb,
            city: nominatimData.address?.city,
            area: nominatimData.address?.state_district
          }
        });
      }
    } catch (e) {
      geocodingTests.push({ service: 'Nominatim', error: e.message });
    }

    try {
      // Test BigDataCloud
      const bigDataResponse = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${userLat}&longitude=${userLon}&localityLanguage=en`
      );
      if (bigDataResponse.ok) {
        const bigDataData = await bigDataResponse.json();
        geocodingTests.push({
          service: 'BigDataCloud',
          raw: bigDataData,
          parsed: {
            locality: bigDataData.locality,
            city: bigDataData.city,
            area: bigDataData.principalSubdivision
          }
        });
      }
    } catch (e) {
      geocodingTests.push({ service: 'BigDataCloud', error: e.message });
    }

    res.json({
      success: true,
      coordinates: { latitude: userLat, longitude: userLon },
      finalResult: locationResult,
      geocodingTests: geocodingTests,
      debug: {
        message: 'This endpoint shows detailed location detection process',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Debug location error:', error);
    res.status(500).json({
      success: false,
      message: 'Debug location detection failed',
      error: error.message
    });
  }
});

export default router;