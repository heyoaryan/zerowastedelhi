// Test real-time location detection
const API_BASE_URL = 'http://localhost:5000';

async function testRealTimeLocation() {
  console.log('📍 TESTING REAL-TIME LOCATION DETECTION');
  console.log('='.repeat(50));

  // Test different coordinates to verify location detection
  const testCoordinates = [
    { lat: 28.6315, lng: 77.2167, expected: 'Connaught Place' },
    { lat: 28.6129, lng: 77.2295, expected: 'India Gate' },
    { lat: 28.5983, lng: 77.2319, expected: 'Khan Market' },
    { lat: 28.6519, lng: 77.1909, expected: 'Karol Bagh' },
    { lat: 28.5677, lng: 77.2436, expected: 'Lajpat Nagar' },
    { lat: 28.6692, lng: 77.1174, expected: 'Rajouri Garden' },
    { lat: 28.5245, lng: 77.2066, expected: 'Saket' },
    { lat: 28.5921, lng: 77.0460, expected: 'Dwarka' }
  ];

  console.log('\n🧪 Testing location detection for different coordinates...\n');

  for (const coord of testCoordinates) {
    try {
      console.log(`📍 Testing: ${coord.lat}, ${coord.lng} (Expected: ${coord.expected})`);
      
      const response = await fetch(
        `${API_BASE_URL}/api/location/info?latitude=${coord.lat}&longitude=${coord.lng}`
      );
      
      if (response.ok) {
        const data = await response.json();
        const detectedName = data.currentLocation?.name || 'Unknown';
        const detectedArea = data.currentLocation?.area || 'Unknown';
        const source = data.currentLocation?.source || 'unknown';
        const accuracy = data.currentLocation?.accuracy || 'unknown';
        
        console.log(`   ✅ Detected: ${detectedName}, ${detectedArea}`);
        console.log(`   📊 Source: ${source}, Accuracy: ${accuracy}`);
        console.log(`   🗑️ Nearby bins: ${data.allNearbyBins?.length || 0}`);
        
        if (detectedName.toLowerCase().includes(coord.expected.toLowerCase()) || 
            coord.expected.toLowerCase().includes(detectedName.toLowerCase())) {
          console.log(`   🎯 MATCH: Expected location detected!`);
        } else {
          console.log(`   ⚠️ DIFFERENT: Expected ${coord.expected}, got ${detectedName}`);
        }
      } else {
        console.log(`   ❌ API call failed: ${response.status}`);
      }
      
      console.log(''); // Empty line for readability
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}\n`);
    }
  }

  // Test reverse geocoding directly
  console.log('🌐 Testing reverse geocoding API directly...\n');
  
  const testLat = 28.6315;
  const testLng = 77.2167;
  
  try {
    const geocodingUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${testLat}&longitude=${testLng}&localityLanguage=en`;
    const response = await fetch(geocodingUrl);
    
    if (response.ok) {
      const data = await response.json();
      console.log('📍 Reverse geocoding result:');
      console.log(`   Locality: ${data.locality || 'N/A'}`);
      console.log(`   City: ${data.city || 'N/A'}`);
      console.log(`   Principal Subdivision: ${data.principalSubdivision || 'N/A'}`);
      console.log(`   Country: ${data.countryName || 'N/A'}`);
      console.log('   ✅ Reverse geocoding is working');
    } else {
      console.log('   ❌ Reverse geocoding failed');
    }
  } catch (error) {
    console.log(`   ❌ Reverse geocoding error: ${error.message}`);
  }

  console.log('\n' + '='.repeat(50));
  console.log('📋 SUMMARY:');
  console.log('If locations are showing correctly above, your location');
  console.log('detection is working properly and will show accurate');
  console.log('locations instead of "Defence Colony" or static data.');
  console.log('\n🚀 Start backend: cd backend && npm run dev');
  console.log('🌐 Start frontend: npm run dev');
}

testRealTimeLocation().catch(console.error);