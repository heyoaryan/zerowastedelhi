// Direct location detection without external APIs
export const getDirectLocation = (lat, lon) => {
  console.log(`🎯 DIRECT location detection for: ${lat}, ${lon}`);
  
  // Direct coordinate mapping for Delhi areas (no external API calls)
  const locationMap = [
    // Central Delhi
    { name: 'Connaught Place', area: 'Central Delhi', lat: 28.6315, lon: 77.2167, radius: 0.01 },
    { name: 'India Gate', area: 'Central Delhi', lat: 28.6129, lon: 77.2295, radius: 0.01 },
    { name: 'Khan Market', area: 'Central Delhi', lat: 28.5983, lon: 77.2319, radius: 0.008 },
    { name: 'Karol Bagh', area: 'Central Delhi', lat: 28.6519, lon: 77.1909, radius: 0.01 },
    { name: 'Paharganj', area: 'Central Delhi', lat: 28.6450, lon: 77.2110, radius: 0.008 },
    
    // South Delhi
    { name: 'Lajpat Nagar', area: 'South Delhi', lat: 28.5677, lon: 77.2436, radius: 0.008 },
    { name: 'Defence Colony', area: 'South Delhi', lat: 28.5729, lon: 77.2294, radius: 0.008 },
    { name: 'Saket', area: 'South Delhi', lat: 28.5245, lon: 77.2066, radius: 0.01 },
    { name: 'Greater Kailash', area: 'South Delhi', lat: 28.5355, lon: 77.2420, radius: 0.008 },
    { name: 'Nehru Place', area: 'South Delhi', lat: 28.5494, lon: 77.2519, radius: 0.008 },
    { name: 'Green Park', area: 'South Delhi', lat: 28.5594, lon: 77.2067, radius: 0.008 },
    { name: 'Hauz Khas', area: 'South Delhi', lat: 28.5494, lon: 77.2067, radius: 0.008 },
    { name: 'Malviya Nagar', area: 'South Delhi', lat: 28.5355, lon: 77.2067, radius: 0.008 },
    
    // North Delhi
    { name: 'Civil Lines', area: 'North Delhi', lat: 28.6769, lon: 77.2232, radius: 0.008 },
    { name: 'Model Town', area: 'North Delhi', lat: 28.7041, lon: 77.2025, radius: 0.01 },
    { name: 'Kamla Nagar', area: 'North Delhi', lat: 28.6816, lon: 77.2094, radius: 0.008 },
    { name: 'Azadpur', area: 'North Delhi', lat: 28.7041, lon: 77.1925, radius: 0.008 },
    
    // East Delhi
    { name: 'Laxmi Nagar', area: 'East Delhi', lat: 28.6345, lon: 77.2767, radius: 0.008 },
    { name: 'Preet Vihar', area: 'East Delhi', lat: 28.6292, lon: 77.2947, radius: 0.008 },
    { name: 'Mayur Vihar', area: 'East Delhi', lat: 28.6127, lon: 77.2773, radius: 0.008 },
    { name: 'Shahdara', area: 'East Delhi', lat: 28.6692, lon: 77.2884, radius: 0.008 },
    { name: 'Anand Vihar', area: 'East Delhi', lat: 28.6469, lon: 77.3150, radius: 0.008 },
    
    // West Delhi
    { name: 'Rajouri Garden', area: 'West Delhi', lat: 28.6692, lon: 77.1174, radius: 0.008 },
    { name: 'Janakpuri', area: 'West Delhi', lat: 28.6219, lon: 77.0814, radius: 0.01 },
    { name: 'Tilak Nagar', area: 'West Delhi', lat: 28.6420, lon: 77.0938, radius: 0.008 },
    { name: 'Punjabi Bagh', area: 'West Delhi', lat: 28.6742, lon: 77.1342, radius: 0.008 },
    { name: 'Paschim Vihar', area: 'West Delhi', lat: 28.6692, lon: 77.1025, radius: 0.01 },
    
    // South West Delhi
    { name: 'Dwarka', area: 'South West Delhi', lat: 28.5921, lon: 77.0460, radius: 0.015 },
    { name: 'Dwarka Mor', area: 'South West Delhi', lat: 28.5889, lon: 77.0583, radius: 0.01 },
    
    // North West Delhi
    { name: 'Rohini', area: 'North West Delhi', lat: 28.7041, lon: 77.1025, radius: 0.015 },
    { name: 'Pitampura', area: 'North West Delhi', lat: 28.6942, lon: 77.1314, radius: 0.008 },
    { name: 'Shalimar Bagh', area: 'North West Delhi', lat: 28.7196, lon: 77.1641, radius: 0.01 }
  ];

  // Find exact match first
  for (const location of locationMap) {
    const distance = Math.sqrt(
      Math.pow(lat - location.lat, 2) + Math.pow(lon - location.lon, 2)
    );
    
    if (distance <= location.radius) {
      console.log(`✅ DIRECT MATCH: ${location.name}, ${location.area}`);
      return {
        name: location.name,
        area: location.area,
        coordinates: { latitude: lat, longitude: lon },
        source: 'direct-mapping',
        accuracy: 'high',
        timestamp: new Date().toISOString(),
        distance: (distance * 111).toFixed(2) // Convert to km
      };
    }
  }

  // Find nearest location if no exact match
  let nearest = null;
  let minDistance = Infinity;

  for (const location of locationMap) {
    const distance = Math.sqrt(
      Math.pow(lat - location.lat, 2) + Math.pow(lon - location.lon, 2)
    );
    
    if (distance < minDistance) {
      minDistance = distance;
      nearest = location;
    }
  }

  if (nearest && minDistance < 0.05) { // Within ~5km
    console.log(`✅ NEAREST MATCH: ${nearest.name}, ${nearest.area} (${(minDistance * 111).toFixed(2)}km)`);
    return {
      name: nearest.name,
      area: nearest.area,
      coordinates: { latitude: lat, longitude: lon },
      source: 'direct-nearest',
      accuracy: minDistance < 0.02 ? 'medium' : 'low',
      timestamp: new Date().toISOString(),
      distance: (minDistance * 111).toFixed(2)
    };
  }

  // Fallback to coordinate-based area detection
  console.log('📍 Using coordinate-based area detection');
  
  if (lat >= 28.60 && lat <= 28.70 && lon >= 77.15 && lon <= 77.25) {
    return { name: 'Central Delhi', area: 'Central Delhi', coordinates: { latitude: lat, longitude: lon }, source: 'area-detection', accuracy: 'low', timestamp: new Date().toISOString() };
  } else if (lat >= 28.50 && lat <= 28.60 && lon >= 77.20 && lon <= 77.30) {
    return { name: 'South Delhi', area: 'South Delhi', coordinates: { latitude: lat, longitude: lon }, source: 'area-detection', accuracy: 'low', timestamp: new Date().toISOString() };
  } else if (lat >= 28.65 && lat <= 28.75 && lon >= 77.20 && lon <= 77.30) {
    return { name: 'North Delhi', area: 'North Delhi', coordinates: { latitude: lat, longitude: lon }, source: 'area-detection', accuracy: 'low', timestamp: new Date().toISOString() };
  } else if (lat >= 28.60 && lat <= 28.70 && lon >= 77.25 && lon <= 77.35) {
    return { name: 'East Delhi', area: 'East Delhi', coordinates: { latitude: lat, longitude: lon }, source: 'area-detection', accuracy: 'low', timestamp: new Date().toISOString() };
  } else if (lat >= 28.60 && lat <= 28.70 && lon >= 77.05 && lon <= 77.15) {
    return { name: 'West Delhi', area: 'West Delhi', coordinates: { latitude: lat, longitude: lon }, source: 'area-detection', accuracy: 'low', timestamp: new Date().toISOString() };
  }

  // Final fallback
  return {
    name: `Location ${lat.toFixed(4)}, ${lon.toFixed(4)}`,
    area: 'Delhi NCR',
    coordinates: { latitude: lat, longitude: lon },
    source: 'fallback',
    accuracy: 'low',
    timestamp: new Date().toISOString()
  };
};

export default getDirectLocation;