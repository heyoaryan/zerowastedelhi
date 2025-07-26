// Real-time location detection service
// Note: Using global fetch in Node.js 18+ or node-fetch for older versions
const fetch = globalThis.fetch || (await import('node-fetch')).default;

// Force real-time location detection without caching
export const getRealTimeLocation = async (lat, lon) => {
  console.log(`🔍 REAL-TIME location detection for: ${lat}, ${lon}`);
  
  // Add timestamp to prevent any caching
  const timestamp = Date.now();
  
  try {
    // Method 1: Use multiple geocoding services with better parsing
    const geocodingServices = [
      {
        name: 'Nominatim',
        url: `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=16&addressdetails=1&extratags=1&namedetails=1&accept-language=en&timestamp=${timestamp}`,
        parser: (data) => {
          const addr = data.address || {};
          return {
            locality: addr.neighbourhood || addr.suburb || addr.quarter || addr.residential || addr.commercial,
            city: addr.city || addr.town || addr.municipality,
            area: addr.state_district || addr.county || addr.state,
            country: addr.country,
            road: addr.road,
            postcode: addr.postcode
          };
        }
      },
      {
        name: 'BigDataCloud',
        url: `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en&timestamp=${timestamp}`,
        parser: (data) => ({
          locality: data.locality,
          city: data.city,
          area: data.principalSubdivision,
          country: data.countryName,
          postcode: data.postcode
        })
      }
    ];

    for (const service of geocodingServices) {
      try {
        console.log(`🌐 Trying ${service.name} geocoding...`);
        
        const response = await fetch(service.url, {
          headers: {
            'User-Agent': 'ZeroWasteDelhi/1.0 (contact@zerowastedelhi.com)',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          const parsed = service.parser(data);
          
          console.log(`📍 ${service.name} raw result:`, data);
          console.log(`📍 ${service.name} parsed result:`, parsed);
          
          if (parsed.locality || parsed.city || parsed.road) {
            let locationName = 'Delhi NCR';
            let areaName = 'Delhi NCR Area';
            
            // Better location name selection
            if (parsed.locality && parsed.locality !== 'Delhi' && parsed.locality !== 'New Delhi') {
              locationName = parsed.locality;
            } else if (parsed.road && parsed.road !== 'Delhi' && parsed.road !== 'New Delhi') {
              locationName = parsed.road;
            } else if (parsed.city && parsed.city !== 'Delhi' && parsed.city !== 'New Delhi') {
              locationName = parsed.city;
            } else if (parsed.area && parsed.area !== 'Delhi' && parsed.area !== 'National Capital Territory of Delhi') {
              locationName = parsed.area;
            }
            
            // Better area name selection
            if (parsed.area && parsed.area !== 'National Capital Territory of Delhi') {
              areaName = parsed.area;
            } else if (parsed.city && parsed.city !== 'Delhi') {
              areaName = parsed.city;
            } else {
              areaName = 'Delhi NCR';
            }
            
            // Clean up location names
            locationName = cleanLocationName(locationName);
            areaName = cleanLocationName(areaName);
            
            console.log(`✅ ${service.name} final result: ${locationName}, ${areaName}`);
            
            // Don't return generic locations
            if (locationName !== 'Delhi NCR' && locationName !== 'Delhi' && locationName !== 'New Delhi') {
              return {
                name: locationName,
                area: areaName,
                coordinates: { latitude: lat, longitude: lon },
                source: service.name.toLowerCase(),
                accuracy: 'high',
                timestamp: new Date().toISOString(),
                rawData: parsed
              };
            }
          }
        }
      } catch (serviceError) {
        console.log(`⚠️ ${service.name} failed:`, serviceError.message);
        continue;
      }
    }

    // Method 2: Use coordinate-based detection with better precision
    console.log('🗺️ Geocoding failed, using enhanced coordinate-based detection...');
    return getEnhancedLocationFromCoordinates(lat, lon);
    
  } catch (error) {
    console.error('❌ Real-time location detection failed:', error);
    return getFallbackLocation(lat, lon);
  }
};

// Clean location names to remove unwanted prefixes/suffixes
const cleanLocationName = (name) => {
  if (!name) return 'Delhi NCR';
  
  // Remove common prefixes/suffixes that might cause confusion
  const cleanName = name
    .replace(/^New\s+/i, '')
    .replace(/\s+Colony$/i, '')
    .replace(/\s+Block$/i, '')
    .replace(/\s+Sector$/i, '')
    .replace(/\s+Phase\s+\d+$/i, '')
    .trim();
    
  return cleanName || 'Delhi NCR';
};

// Enhanced coordinate-based detection with more precise ranges
const getEnhancedLocationFromCoordinates = (lat, lon) => {
  console.log('🎯 Using enhanced coordinate-based location detection...');
  
  // More precise coordinate ranges for Delhi areas
  const preciseRanges = [
    // Central Delhi
    { name: 'Connaught Place', area: 'Central Delhi', latRange: [28.6280, 28.6350], lonRange: [77.2140, 77.2190] },
    { name: 'India Gate', area: 'Central Delhi', latRange: [28.6100, 28.6160], lonRange: [77.2270, 77.2320] },
    { name: 'Khan Market', area: 'Central Delhi', latRange: [28.5960, 28.6010], lonRange: [77.2300, 77.2340] },
    { name: 'Karol Bagh', area: 'Central Delhi', latRange: [28.6490, 28.6550], lonRange: [77.1880, 77.1940] },
    { name: 'Paharganj', area: 'Central Delhi', latRange: [28.6420, 28.6480], lonRange: [77.2080, 77.2140] },
    
    // South Delhi
    { name: 'Lajpat Nagar', area: 'South Delhi', latRange: [28.5650, 28.5710], lonRange: [77.2410, 77.2460] },
    { name: 'Defence Colony', area: 'South Delhi', latRange: [28.5700, 28.5760], lonRange: [77.2270, 77.2320] },
    { name: 'Saket', area: 'South Delhi', latRange: [28.5220, 28.5270], lonRange: [77.2040, 77.2090] },
    { name: 'Greater Kailash', area: 'South Delhi', latRange: [28.5330, 28.5380], lonRange: [77.2400, 77.2450] },
    { name: 'Nehru Place', area: 'South Delhi', latRange: [28.5470, 28.5520], lonRange: [77.2500, 77.2550] },
    { name: 'Green Park', area: 'South Delhi', latRange: [28.5570, 28.5620], lonRange: [77.2040, 77.2090] },
    { name: 'Hauz Khas', area: 'South Delhi', latRange: [28.5470, 28.5520], lonRange: [77.2040, 77.2090] },
    
    // North Delhi
    { name: 'Civil Lines', area: 'North Delhi', latRange: [28.6740, 28.6800], lonRange: [77.2200, 77.2260] },
    { name: 'Model Town', area: 'North Delhi', latRange: [28.7010, 28.7070], lonRange: [77.2000, 77.2050] },
    { name: 'Kamla Nagar', area: 'North Delhi', latRange: [28.6790, 28.6850], lonRange: [77.2070, 77.2120] },
    
    // East Delhi
    { name: 'Laxmi Nagar', area: 'East Delhi', latRange: [28.6320, 28.6380], lonRange: [77.2740, 77.2800] },
    { name: 'Preet Vihar', area: 'East Delhi', latRange: [28.6270, 28.6320], lonRange: [77.2920, 77.2980] },
    { name: 'Mayur Vihar', area: 'East Delhi', latRange: [28.6100, 28.6160], lonRange: [77.2750, 77.2800] },
    
    // West Delhi
    { name: 'Rajouri Garden', area: 'West Delhi', latRange: [28.6670, 28.6720], lonRange: [77.1150, 77.1200] },
    { name: 'Janakpuri', area: 'West Delhi', latRange: [28.6190, 28.6250], lonRange: [77.0790, 77.0850] },
    { name: 'Tilak Nagar', area: 'West Delhi', latRange: [28.6390, 28.6450], lonRange: [77.0910, 77.0970] },
    
    // South West Delhi
    { name: 'Dwarka', area: 'South West Delhi', latRange: [28.5900, 28.5950], lonRange: [77.0440, 77.0490] },
    
    // North West Delhi
    { name: 'Rohini', area: 'North West Delhi', latRange: [28.7010, 28.7070], lonRange: [77.1000, 77.1050] },
    { name: 'Pitampura', area: 'North West Delhi', latRange: [28.6920, 28.6970], lonRange: [77.1290, 77.1340] }
  ];

  // Check precise ranges first
  for (const range of preciseRanges) {
    if (lat >= range.latRange[0] && lat <= range.latRange[1] &&
        lon >= range.lonRange[0] && lon <= range.lonRange[1]) {
      console.log(`✅ Precise coordinate match: ${range.name}`);
      return {
        name: range.name,
        area: range.area,
        coordinates: { latitude: lat, longitude: lon },
        source: 'coordinate-precise',
        accuracy: 'high',
        timestamp: new Date().toISOString()
      };
    }
  }

  // If no exact match, find nearest area with distance calculation
  return getNearestAreaWithDistance(lat, lon);
};

// Find nearest area with better distance calculation
const getNearestAreaWithDistance = (lat, lon) => {
  console.log('📏 Finding nearest area with distance calculation...');
  
  const majorAreas = [
    { name: 'Connaught Place', area: 'Central Delhi', lat: 28.6315, lon: 77.2167 },
    { name: 'India Gate', area: 'Central Delhi', lat: 28.6129, lon: 77.2295 },
    { name: 'Khan Market', area: 'Central Delhi', lat: 28.5983, lon: 77.2319 },
    { name: 'Lajpat Nagar', area: 'South Delhi', lat: 28.5677, lon: 77.2436 },
    { name: 'Defence Colony', area: 'South Delhi', lat: 28.5729, lon: 77.2294 },
    { name: 'Saket', area: 'South Delhi', lat: 28.5245, lon: 77.2066 },
    { name: 'Karol Bagh', area: 'Central Delhi', lat: 28.6519, lon: 77.1909 },
    { name: 'Rajouri Garden', area: 'West Delhi', lat: 28.6692, lon: 77.1174 },
    { name: 'Civil Lines', area: 'North Delhi', lat: 28.6769, lon: 77.2232 },
    { name: 'Laxmi Nagar', area: 'East Delhi', lat: 28.6345, lon: 77.2767 },
    { name: 'Dwarka', area: 'South West Delhi', lat: 28.5921, lon: 77.0460 }
  ];

  let nearestArea = null;
  let minDistance = Infinity;

  for (const area of majorAreas) {
    const distance = calculateDistance(lat, lon, area.lat, area.lon);
    if (distance < minDistance) {
      minDistance = distance;
      nearestArea = area;
    }
  }

  if (nearestArea && minDistance < 5) { // Within 5km
    console.log(`✅ Nearest area: ${nearestArea.name} (${minDistance.toFixed(2)}km away)`);
    return {
      name: nearestArea.name,
      area: nearestArea.area,
      coordinates: { latitude: lat, longitude: lon },
      source: 'nearest-area',
      accuracy: minDistance < 2 ? 'medium' : 'low',
      timestamp: new Date().toISOString(),
      distance: minDistance.toFixed(2)
    };
  }

  return getFallbackLocation(lat, lon);
};

// Find nearest area using distance calculation
const getNearestArea = (lat, lon) => {
  console.log('📏 Finding nearest area...');
  
  const majorAreas = [
    { name: 'Central Delhi', lat: 28.6315, lon: 77.2167 },
    { name: 'South Delhi', lat: 28.5355, lon: 77.2420 },
    { name: 'North Delhi', lat: 28.7041, lon: 77.2025 },
    { name: 'East Delhi', lat: 28.6345, lon: 77.2767 },
    { name: 'West Delhi', lat: 28.6692, lon: 77.1174 },
    { name: 'New Delhi', lat: 28.6139, lon: 77.2090 }
  ];

  let nearestArea = null;
  let minDistance = Infinity;

  for (const area of majorAreas) {
    const distance = calculateDistance(lat, lon, area.lat, area.lon);
    if (distance < minDistance) {
      minDistance = distance;
      nearestArea = area;
    }
  }

  if (nearestArea) {
    console.log(`✅ Nearest area: ${nearestArea.name}`);
    return {
      name: nearestArea.name,
      area: 'Delhi NCR',
      coordinates: { latitude: lat, longitude: lon },
      source: 'nearest-area',
      accuracy: 'low',
      timestamp: new Date().toISOString(),
      distance: minDistance.toFixed(2)
    };
  }

  return getFallbackLocation(lat, lon);
};

// Calculate distance between two points
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Fallback location when all methods fail
const getFallbackLocation = (lat, lon) => {
  console.log('⚠️ Using fallback location');
  return {
    name: `Location ${lat.toFixed(4)}, ${lon.toFixed(4)}`,
    area: 'Delhi NCR Area',
    coordinates: { latitude: lat, longitude: lon },
    source: 'fallback',
    accuracy: 'low',
    timestamp: new Date().toISOString()
  };
};

export default getRealTimeLocation;