// Balanced location detection - shows place names when possible
export const getAccurateGPSLocation = async (lat, lon) => {
  console.log(`🎯 BALANCED location detection for: ${lat}, ${lon}`);
  
  // STEP 1: Check precise coordinate ranges first
  const preciseMatch = getLocationFromPreciseCoordinates(lat, lon);
  if (preciseMatch.accuracy === 'high') {
    console.log(`✅ PRECISE COORDINATE MATCH: ${preciseMatch.name}`);
    return {
      name: preciseMatch.name,
      area: preciseMatch.area,
      coordinates: { latitude: lat, longitude: lon },
      source: preciseMatch.source,
      accuracy: 'high',
      timestamp: new Date().toISOString()
    };
  }
  
  // STEP 2: Check if it's close to a known location (within 2km)
  if (preciseMatch.accuracy === 'medium' && preciseMatch.distance && parseFloat(preciseMatch.distance) <= 2.0) {
    console.log(`✅ NEARBY COORDINATE MATCH: ${preciseMatch.name} (${preciseMatch.distance}km away)`);
    return {
      name: preciseMatch.name,
      area: preciseMatch.area,
      coordinates: { latitude: lat, longitude: lon },
      source: preciseMatch.source,
      accuracy: 'medium',
      timestamp: new Date().toISOString()
    };
  }
  
  // STEP 3: Try geocoding services for place names
  console.log('🌐 Trying geocoding services for place name...');
  try {
    const geocodingResults = await Promise.allSettled([
      // Service 1: Nominatim (OpenStreetMap)
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=16&addressdetails=1&accept-language=en`, {
        headers: {
          'User-Agent': 'ZeroWasteDelhi/1.0',
          'Cache-Control': 'no-cache'
        }
      }).then(res => res.json()).then(data => ({
        service: 'Nominatim',
        locality: data.address?.neighbourhood || data.address?.suburb || data.address?.quarter,
        city: data.address?.city || data.address?.town,
        area: data.address?.state_district || data.address?.county,
        road: data.address?.road
      })),
      
      // Service 2: BigDataCloud
      fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`, {
        headers: { 'Cache-Control': 'no-cache' }
      }).then(res => res.json()).then(data => ({
        service: 'BigDataCloud',
        locality: data.locality,
        city: data.city,
        area: data.principalSubdivision
      }))
    ]);

    const validResults = geocodingResults
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value);

    console.log('🌐 Geocoding results:', validResults);

    // Look for a good locality name
    for (const result of validResults) {
      if (result.locality && result.locality !== 'Delhi' && result.locality !== 'New Delhi' && result.locality.length > 3) {
        // Filter out generic terms
        const isGeneric = result.locality.toLowerCase().includes('tehsil') ||
                         result.locality.toLowerCase().includes('district') ||
                         result.locality.toLowerCase().includes('subdivision') ||
                         result.locality.toLowerCase().includes('block');
        
        if (!isGeneric) {
          console.log(`✅ Found good locality from ${result.service}: ${result.locality}`);
          return {
            name: result.locality,
            area: result.area || result.city || 'Delhi NCR',
            coordinates: { latitude: lat, longitude: lon },
            source: result.service.toLowerCase(),
            accuracy: 'medium',
            timestamp: new Date().toISOString()
          };
        }
      }
    }

    // If no good locality, try road names
    for (const result of validResults) {
      if (result.road && result.road !== 'Delhi' && result.road.length > 5) {
        const isGoodRoad = result.road.toLowerCase().includes('market') ||
                          result.road.toLowerCase().includes('nagar') ||
                          result.road.toLowerCase().includes('colony') ||
                          result.road.toLowerCase().includes('marg');
        
        if (isGoodRoad) {
          console.log(`✅ Using road name from ${result.service}: ${result.road}`);
          return {
            name: result.road,
            area: result.area || result.city || 'Delhi NCR',
            coordinates: { latitude: lat, longitude: lon },
            source: result.service.toLowerCase(),
            accuracy: 'medium',
            timestamp: new Date().toISOString()
          };
        }
      }
    }
  } catch (geocodingError) {
    console.log('⚠️ Geocoding failed:', geocodingError.message);
  }
  
  // STEP 4: Final fallback - use nearest known location if within reasonable distance
  if (preciseMatch.nearestKnown) {
    const distanceMatch = preciseMatch.nearestKnown.match(/\(([0-9.]+)km away\)/);
    if (distanceMatch && parseFloat(distanceMatch[1]) <= 3.0) {
      const nearestName = preciseMatch.nearestKnown.split(' (')[0];
      console.log(`✅ Using nearest known location: ${nearestName}`);
      return {
        name: `Near ${nearestName}`,
        area: 'Delhi NCR',
        coordinates: { latitude: lat, longitude: lon },
        source: 'nearest-approximation',
        accuracy: 'low',
        timestamp: new Date().toISOString()
      };
    }
  }
  
  // STEP 5: Last resort - GPS coordinates
  console.log('⚠️ Using GPS coordinates as last resort');
  return {
    name: `GPS Location ${lat.toFixed(4)}, ${lon.toFixed(4)}`,
    area: 'Delhi NCR',
    coordinates: { latitude: lat, longitude: lon },
    source: 'gps-coordinates',
    accuracy: 'low',
    timestamp: new Date().toISOString()
  };
};

// Check if a location name is a valid Delhi area (not generic)
const isValidDelhiLocation = (locationName) => {
  // Filter out generic/administrative terms that are not specific locations
  const genericTerms = [
    'tehsil', 'district', 'subdivision', 'block', 'ward', 'zone',
    'new delhi', 'delhi', 'ncr', 'national capital territory',
    'central delhi', 'south delhi', 'north delhi', 'east delhi', 'west delhi',
    'south west delhi', 'north west delhi', 'north east delhi', 'south east delhi'
  ];
  
  const lowerName = locationName.toLowerCase();
  
  // Reject if it contains generic administrative terms
  if (genericTerms.some(term => lowerName.includes(term))) {
    console.log(`❌ Rejected generic location: ${locationName}`);
    return false;
  }
  
  const validDelhiAreas = [
    'Connaught Place', 'India Gate', 'Khan Market', 'Karol Bagh', 'Paharganj',
    'Lajpat Nagar', 'Defence Colony', 'Saket', 'Greater Kailash', 'Nehru Place',
    'Green Park', 'Hauz Khas', 'Malviya Nagar', 'Kalkaji', 'Govindpuri',
    'Civil Lines', 'Model Town', 'Kamla Nagar', 'Azadpur', 'Burari',
    'Laxmi Nagar', 'Preet Vihar', 'Mayur Vihar', 'Shahdara', 'Anand Vihar',
    'Rajouri Garden', 'Janakpuri', 'Tilak Nagar', 'Punjabi Bagh', 'Paschim Vihar',
    'Dwarka', 'Dwarka Mor', 'Rohini', 'Pitampura', 'Shalimar Bagh',
    'Vasant Kunj', 'Munirka', 'RK Puram', 'Chanakyapuri', 'Diplomatic Enclave',
    'Chandni Chowk', 'Jama Masjid', 'Red Fort', 'Kashmere Gate', 'Daryaganj',
    'Lodhi Road', 'Lodhi Colony', 'Jangpura', 'Nizamuddin', 'Humayun Tomb',
    'Safdarjung', 'AIIMS', 'IIT Delhi', 'JNU', 'Jamia Millia'
  ];
  
  const isValid = validDelhiAreas.some(area => 
    locationName.toLowerCase().includes(area.toLowerCase()) ||
    area.toLowerCase().includes(locationName.toLowerCase())
  );
  
  if (isValid) {
    console.log(`✅ Valid specific location: ${locationName}`);
  } else {
    console.log(`❌ Not a recognized specific location: ${locationName}`);
  }
  
  return isValid;
};

// Precise coordinate-based location detection
const getLocationFromPreciseCoordinates = (lat, lon) => {
  console.log('🎯 Using precise coordinate analysis...');
  
  // Comprehensive Delhi locations with precise coordinate ranges
  const preciseLocations = [
    // Central Delhi - Expanded ranges
    { name: 'Connaught Place', area: 'Central Delhi', latMin: 28.6250, latMax: 28.6380, lonMin: 77.2100, lonMax: 77.2220 },
    { name: 'India Gate', area: 'Central Delhi', latMin: 28.6080, latMax: 28.6180, lonMin: 77.2250, lonMax: 77.2350 },
    { name: 'Khan Market', area: 'Central Delhi', latMin: 28.5940, latMax: 28.6030, lonMin: 77.2280, lonMax: 77.2360 },
    { name: 'Karol Bagh', area: 'Central Delhi', latMin: 28.6470, latMax: 28.6570, lonMin: 77.1860, lonMax: 77.1960 },
    { name: 'Paharganj', area: 'Central Delhi', latMin: 28.6400, latMax: 28.6500, lonMin: 77.2060, lonMax: 77.2160 },
    { name: 'Chandni Chowk', area: 'Central Delhi', latMin: 28.6500, latMax: 28.6560, lonMin: 77.2300, lonMax: 77.2360 },
    { name: 'Jama Masjid', area: 'Central Delhi', latMin: 28.6510, latMax: 28.6530, lonMin: 77.2330, lonMax: 77.2350 },
    { name: 'Red Fort', area: 'Central Delhi', latMin: 28.6560, latMax: 28.6580, lonMin: 77.2400, lonMax: 77.2420 },
    { name: 'Daryaganj', area: 'Central Delhi', latMin: 28.6450, latMax: 28.6490, lonMin: 77.2400, lonMax: 77.2440 },
    
    // South Delhi
    { name: 'Lajpat Nagar', area: 'South Delhi', latMin: 28.5650, latMax: 28.5710, lonMin: 77.2410, lonMax: 77.2460 },
    { name: 'Defence Colony', area: 'South Delhi', latMin: 28.5700, latMax: 28.5760, lonMin: 77.2270, lonMax: 77.2320 },
    { name: 'Saket', area: 'South Delhi', latMin: 28.5220, latMax: 28.5270, lonMin: 77.2040, lonMax: 77.2090 },
    { name: 'Greater Kailash', area: 'South Delhi', latMin: 28.5330, latMax: 28.5380, lonMin: 77.2400, lonMax: 77.2450 },
    { name: 'Nehru Place', area: 'South Delhi', latMin: 28.5470, latMax: 28.5520, lonMin: 77.2500, lonMax: 77.2550 },
    { name: 'Green Park', area: 'South Delhi', latMin: 28.5570, latMax: 28.5620, lonMin: 77.2040, lonMax: 77.2090 },
    { name: 'Hauz Khas', area: 'South Delhi', latMin: 28.5470, latMax: 28.5520, lonMin: 77.2040, lonMax: 77.2090 },
    { name: 'Malviya Nagar', area: 'South Delhi', latMin: 28.5280, latMax: 28.5320, lonMin: 77.2050, lonMax: 77.2090 },
    { name: 'Kalkaji', area: 'South Delhi', latMin: 28.5330, latMax: 28.5370, lonMin: 77.2580, lonMax: 77.2620 },
    { name: 'Govindpuri', area: 'South Delhi', latMin: 28.5350, latMax: 28.5390, lonMin: 77.2520, lonMax: 77.2560 },
    { name: 'Lodhi Road', area: 'South Delhi', latMin: 28.5900, latMax: 28.5940, lonMin: 77.2200, lonMax: 77.2240 },
    { name: 'Jangpura', area: 'South Delhi', latMin: 28.5820, latMax: 28.5860, lonMin: 77.2450, lonMax: 77.2490 },
    { name: 'Nizamuddin', area: 'South Delhi', latMin: 28.5900, latMax: 28.5940, lonMin: 77.2430, lonMax: 77.2470 },
    
    // North Delhi - Expanded ranges
    { name: 'Civil Lines', area: 'North Delhi', latMin: 28.6720, latMax: 28.6820, lonMin: 77.2180, lonMax: 77.2280 },
    { name: 'Model Town', area: 'North Delhi', latMin: 28.6990, latMax: 28.7090, lonMin: 77.1980, lonMax: 77.2070 },
    { name: 'Kamla Nagar', area: 'North Delhi', latMin: 28.6770, latMax: 28.6870, lonMin: 77.2050, lonMax: 77.2140 },
    { name: 'Azadpur', area: 'North Delhi', latMin: 28.7030, latMax: 28.7110, lonMin: 77.1730, lonMax: 77.1810 },
    { name: 'Kashmere Gate', area: 'North Delhi', latMin: 28.6650, latMax: 28.6710, lonMin: 77.2250, lonMax: 77.2310 },
    { name: 'Burari', area: 'North Delhi', latMin: 28.7180, latMax: 28.7260, lonMin: 77.1980, lonMax: 77.2060 },
    { name: 'Sant Nagar', area: 'North Delhi', latMin: 28.6830, latMax: 28.6910, lonMin: 77.2080, lonMax: 77.2160 },
    { name: 'Swaroop Nagar', area: 'North Delhi', latMin: 28.6880, latMax: 28.6960, lonMin: 77.1930, lonMax: 77.2010 },
    { name: 'Timarpur', area: 'North Delhi', latMin: 28.6930, latMax: 28.7010, lonMin: 77.2030, lonMax: 77.2110 },
    { name: 'Shastri Nagar', area: 'North Delhi', latMin: 28.6780, latMax: 28.6860, lonMin: 77.1880, lonMax: 77.1960 },
    
    // East Delhi
    { name: 'Laxmi Nagar', area: 'East Delhi', latMin: 28.6320, latMax: 28.6380, lonMin: 77.2740, lonMax: 77.2800 },
    { name: 'Preet Vihar', area: 'East Delhi', latMin: 28.6270, latMax: 28.6320, lonMin: 77.2920, lonMax: 77.2980 },
    { name: 'Mayur Vihar', area: 'East Delhi', latMin: 28.6100, latMax: 28.6160, lonMin: 77.2750, lonMax: 77.2800 },
    { name: 'Shahdara', area: 'East Delhi', latMin: 28.6700, latMax: 28.6740, lonMin: 77.2850, lonMax: 77.2890 },
    { name: 'Anand Vihar', area: 'East Delhi', latMin: 28.6470, latMax: 28.6510, lonMin: 77.3150, lonMax: 77.3190 },
    { name: 'Patparganj', area: 'East Delhi', latMin: 28.6200, latMax: 28.6240, lonMin: 77.2900, lonMax: 77.2940 },
    { name: 'Geeta Colony', area: 'East Delhi', latMin: 28.6550, latMax: 28.6590, lonMin: 77.2750, lonMax: 77.2790 },
    { name: 'Krishna Nagar', area: 'East Delhi', latMin: 28.6400, latMax: 28.6440, lonMin: 77.2800, lonMax: 77.2840 },
    { name: 'Vivek Vihar', area: 'East Delhi', latMin: 28.6720, latMax: 28.6760, lonMin: 77.3000, lonMax: 77.3040 },
    
    // West Delhi
    { name: 'Rajouri Garden', area: 'West Delhi', latMin: 28.6670, latMax: 28.6720, lonMin: 77.1150, lonMax: 77.1200 },
    { name: 'Janakpuri', area: 'West Delhi', latMin: 28.6190, latMax: 28.6250, lonMin: 77.0790, lonMax: 77.0850 },
    { name: 'Tilak Nagar', area: 'West Delhi', latMin: 28.6390, latMax: 28.6450, lonMin: 77.0910, lonMax: 77.0970 },
    { name: 'Punjabi Bagh', area: 'West Delhi', latMin: 28.6740, latMax: 28.6780, lonMin: 77.1310, lonMax: 77.1350 },
    { name: 'Paschim Vihar', area: 'West Delhi', latMin: 28.6700, latMax: 28.6740, lonMin: 77.1020, lonMax: 77.1060 },
    { name: 'Subhash Nagar', area: 'West Delhi', latMin: 28.6420, latMax: 28.6460, lonMin: 77.1200, lonMax: 77.1240 },
    { name: 'Kirti Nagar', area: 'West Delhi', latMin: 28.6500, latMax: 28.6540, lonMin: 77.1400, lonMax: 77.1440 },
    { name: 'Moti Nagar', area: 'West Delhi', latMin: 28.6600, latMax: 28.6640, lonMin: 77.1450, lonMax: 77.1490 },
    { name: 'Ramesh Nagar', area: 'West Delhi', latMin: 28.6350, latMax: 28.6390, lonMin: 77.1350, lonMax: 77.1390 },
    
    // South West Delhi
    { name: 'Dwarka', area: 'South West Delhi', latMin: 28.5900, latMax: 28.5950, lonMin: 77.0440, lonMax: 77.0490 },
    { name: 'Vasant Kunj', area: 'South West Delhi', latMin: 28.5200, latMax: 28.5240, lonMin: 77.1580, lonMax: 77.1620 },
    { name: 'Munirka', area: 'South West Delhi', latMin: 28.5560, latMax: 28.5600, lonMin: 77.1740, lonMax: 77.1780 },
    { name: 'RK Puram', area: 'South West Delhi', latMin: 28.5630, latMax: 28.5670, lonMin: 77.1800, lonMax: 77.1840 },
    { name: 'Vasant Vihar', area: 'South West Delhi', latMin: 28.5570, latMax: 28.5610, lonMin: 77.1650, lonMax: 77.1690 },
    { name: 'Safdarjung', area: 'South West Delhi', latMin: 28.5750, latMax: 28.5790, lonMin: 77.2050, lonMax: 77.2090 },
    
    // North West Delhi
    { name: 'Rohini', area: 'North West Delhi', latMin: 28.7010, latMax: 28.7070, lonMin: 77.1000, lonMax: 77.1050 },
    { name: 'Pitampura', area: 'North West Delhi', latMin: 28.6920, latMax: 28.6970, lonMin: 77.1290, lonMax: 77.1340 },
    { name: 'Shalimar Bagh', area: 'North West Delhi', latMin: 28.7100, latMax: 28.7140, lonMin: 77.1640, lonMax: 77.1680 },
    { name: 'Kohat Enclave', area: 'North West Delhi', latMin: 28.7050, latMax: 28.7090, lonMin: 77.1350, lonMax: 77.1390 },
    { name: 'Ashok Vihar', area: 'North West Delhi', latMin: 28.6950, latMax: 28.6990, lonMin: 77.1750, lonMax: 77.1790 },
    { name: 'Wazirpur', area: 'North West Delhi', latMin: 28.7000, latMax: 28.7040, lonMin: 77.1600, lonMax: 77.1640 },
    
    // North East Delhi
    { name: 'Seelampur', area: 'North East Delhi', latMin: 28.6700, latMax: 28.6740, lonMin: 77.2650, lonMax: 77.2690 },
    { name: 'Yamuna Vihar', area: 'North East Delhi', latMin: 28.6950, latMax: 28.6990, lonMin: 77.2700, lonMax: 77.2740 },
    { name: 'Jaffrabad', area: 'North East Delhi', latMin: 28.6800, latMax: 28.6840, lonMin: 77.2500, lonMax: 77.2540 },
    { name: 'Maujpur', area: 'North East Delhi', latMin: 28.6850, latMax: 28.6890, lonMin: 77.2600, lonMax: 77.2640 },
    
    // South East Delhi
    { name: 'Okhla', area: 'South East Delhi', latMin: 28.5350, latMax: 28.5390, lonMin: 77.2700, lonMax: 77.2740 },
    { name: 'Jamia Nagar', area: 'South East Delhi', latMin: 28.5600, latMax: 28.5640, lonMin: 77.2800, lonMax: 77.2840 },
    { name: 'Batla House', area: 'South East Delhi', latMin: 28.5650, latMax: 28.5690, lonMin: 77.2750, lonMax: 77.2790 },
    { name: 'Shaheen Bagh', area: 'South East Delhi', latMin: 28.5500, latMax: 28.5540, lonMin: 77.2900, lonMax: 77.2940 }
  ];

  // Check for exact coordinate match
  for (const location of preciseLocations) {
    if (lat >= location.latMin && lat <= location.latMax && 
        lon >= location.lonMin && lon <= location.lonMax) {
      console.log(`✅ PRECISE MATCH: ${location.name}, ${location.area}`);
      return {
        name: location.name,
        area: location.area,
        source: 'coordinate-precise',
        accuracy: 'high'
      };
    }
  }

  // If no precise match, find nearest location
  let nearest = null;
  let minDistance = Infinity;

  for (const location of preciseLocations) {
    const centerLat = (location.latMin + location.latMax) / 2;
    const centerLon = (location.lonMin + location.lonMax) / 2;
    const distance = Math.sqrt(Math.pow(lat - centerLat, 2) + Math.pow(lon - centerLon, 2));
    
    if (distance < minDistance) {
      minDistance = distance;
      nearest = location;
    }
  }

  // More generous coordinate-based detection
  if (nearest && minDistance < 0.025) { // Within ~2.5km
    const distanceKm = minDistance * 111;
    console.log(`🎯 NEAREST COORDINATE MATCH: ${nearest.name}, ${nearest.area} (${distanceKm.toFixed(2)}km)`);
    
    // Return different accuracy based on distance
    if (distanceKm <= 1.0) {
      return {
        name: nearest.name,
        area: nearest.area,
        source: 'coordinate-nearest',
        accuracy: 'medium',
        distance: distanceKm.toFixed(2)
      };
    } else if (distanceKm <= 2.0) {
      return {
        name: nearest.name,
        area: nearest.area,
        source: 'coordinate-approximate',
        accuracy: 'medium',
        distance: distanceKm.toFixed(2)
      };
    } else {
      // Store nearest for potential use later
      return {
        name: `GPS Location ${lat.toFixed(4)}, ${lon.toFixed(4)}`,
        area: 'Delhi NCR',
        source: 'coordinate-fallback',
        accuracy: 'low',
        nearestKnown: `${nearest.name} (${distanceKm.toFixed(2)}km away)`
      };
    }
  }

  // Final fallback
  console.log('⚠️ Using fallback location');
  return {
    name: `GPS Location ${lat.toFixed(4)}, ${lon.toFixed(4)}`,
    area: 'Delhi NCR',
    source: 'fallback',
    accuracy: 'low'
  };
};

export default getAccurateGPSLocation;