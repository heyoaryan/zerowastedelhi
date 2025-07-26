import WasteBin from '../models/WasteBin.js';
import { 
  findNearestLocation, 
  isInDelhiArea, 
  getLocationSuggestions,
  isWithinDelhiNCR,
  calculateDistance,
  delhiLocations 
} from '../services/locationService.js';

// Get current location info and nearby bins
export const getLocationInfo = async (req, res) => {
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

    console.log(`Location request: ${userLat}, ${userLon}`);

    // Check if within Delhi NCR
    const isInNCR = isWithinDelhiNCR(userLat, userLon);
    console.log(`🗺️ Is in Delhi NCR: ${isInNCR}`);
    
    if (!isInNCR) {
      return res.status(400).json({
        success: false,
        message: 'Location is outside Delhi NCR area',
        isInDelhi: false,
        coordinates: { latitude: userLat, longitude: userLon }
      });
    }

    // Get location with user selection option
    const { getLocationWithUserChoice } = await import('../services/simpleLocation.js');
    const locationData = await getLocationWithUserChoice(userLat, userLon);
    console.log(`📍 Location data with user choice:`, locationData);
    
    // Find all bins within reasonable radius for calculation
    const allBins = await WasteBin.find({
      status: { $ne: 'inactive' }
    });

    // Calculate distances for all bins
    const binsWithDistance = allBins.map(bin => {
      const distance = calculateDistance(
        userLat,
        userLon,
        bin.location.coordinates.latitude,
        bin.location.coordinates.longitude
      );
      
      return {
        ...bin.toObject(),
        distanceFromUser: parseFloat(distance.toFixed(2))
      };
    }).sort((a, b) => a.distanceFromUser - b.distanceFromUser);

    // Find bins within 1km (local bins)
    const localBins = binsWithDistance.filter(bin => bin.distanceFromUser <= 1);
    
    // Find bins within 3km for backup (nearby bins)
    const nearbyBins = binsWithDistance.filter(bin => bin.distanceFromUser <= 3);

    // Response structure with location selection
    const response = {
      success: true,
      isInDelhi: true,
      isInRecognizedArea: true,
      userCoordinates: { latitude: userLat, longitude: userLon },
      locationData: locationData,
      localBins: localBins, // Bins within 1km
      localBinCount: localBins.length,
      nearbyBins: nearbyBins.slice(0, 8), // Top 8 bins within 3km
      nearbyBinCount: nearbyBins.length,
      allNearbyBins: localBins.length > 0 ? localBins : nearbyBins.slice(0, 5) // Show local first, then nearby
    };

    // Generate message for user selection
    if (localBins.length > 0) {
      response.message = `Please select your area. Found ${localBins.length} bin(s) within 1km of your location.`;
      response.hasBinsInArea = true;
    } else if (nearbyBins.length > 0) {
      response.message = `Please select your area. Found ${nearbyBins.length} bins within 3km of your location.`;
      response.hasBinsInArea = false;
      response.nearestBinDistance = nearbyBins[0].distanceFromUser;
      response.nearestBinLocation = nearbyBins[0].location.area;
    } else {
      response.message = `Please select your area. No bins found within 3km radius.`;
      response.hasBinsInArea = false;
    }

    res.status(200).json(response);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while getting location info',
      error: error.message
    });
  }
};

// Get location suggestions for search
export const searchLocations = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const suggestions = getLocationSuggestions(query);

    res.status(200).json({
      success: true,
      suggestions,
      count: suggestions.length
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while searching locations',
      error: error.message
    });
  }
};

// Get all Delhi locations
export const getAllDelhiLocations = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      locations: delhiLocations,
      count: delhiLocations.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching locations',
      error: error.message
    });
  }
};

// Validate and get bins for a specific location
export const getBinsForLocation = async (req, res) => {
  try {
    const { locationName } = req.params;
    
    // Find the location
    const location = delhiLocations.find(loc => 
      loc.name.toLowerCase() === locationName.toLowerCase()
    );

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found in our database'
      });
    }

    // Find bins within the location's radius
    const bins = await WasteBin.find({
      $expr: {
        $lte: [
          {
            $sqrt: {
              $add: [
                { $pow: [{ $subtract: ['$location.coordinates.latitude', location.coordinates.latitude] }, 2] },
                { $pow: [{ $subtract: ['$location.coordinates.longitude', location.coordinates.longitude] }, 2] }
              ]
            }
          },
          location.radius / 111 // Convert km to approximate degrees
        ]
      }
    });

    // Calculate distances
    const binsWithDistance = bins.map(bin => {
      const distance = calculateDistance(
        location.coordinates.latitude,
        location.coordinates.longitude,
        bin.location.coordinates.latitude,
        bin.location.coordinates.longitude
      );
      
      return {
        ...bin.toObject(),
        distanceFromLocation: parseFloat(distance.toFixed(2))
      };
    }).sort((a, b) => a.distanceFromLocation - b.distanceFromLocation);

    res.status(200).json({
      success: true,
      location,
      bins: binsWithDistance,
      binCount: binsWithDistance.length
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching location bins',
      error: error.message
    });
  }
};