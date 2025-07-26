// Debug location detection specifically on port 5000
const API_BASE_URL = 'http://localhost:5000';

async function debugLocationPort5000() {
  console.log('🔍 DEBUGGING LOCATION ON PORT 5000');
  console.log('='.repeat(50));

  // Test 1: Verify backend is on port 5000
  console.log('\n1. 🔌 Verifying backend on port 5000...');
  try {
    const healthResponse = await fetch(`${API_BASE_URL}/api/health`);
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('   ✅ Backend running on port 5000');
      console.log('   📊 Response:', healthData.message);
    } else {
      console.log('   ❌ Backend not responding on port 5000');
      console.log('   🔧 Make sure backend is running: cd backend && npm run dev');
      return;
    }
  } catch (error) {
    console.log('   ❌ Cannot connect to port 5000');
    console.log('   🔧 Backend is not running on port 5000');
    return;
  }

  // Test 2: Test location detection with different coordinates
  console.log('\n2. 📍 Testing location detection...');
  
  const testCoordinates = [
    { lat: 28.6315, lng: 77.2167, name: 'Connaught Place' },
    { lat: 28.6129, lng: 77.2295, name: 'India Gate' },
    { lat: 28.5983, lng: 77.2319, name: 'Khan Market' },
    { lat: 28.5729, lng: 77.2294, name: 'Defence Colony' }
  ];

  for (const coord of testCoordinates) {
    try {
      console.log(`\n   🧪 Testing ${coord.name} (${coord.lat}, ${coord.lng}):`);
      
      const response = await fetch(
        `${API_BASE_URL}/api/location/info?latitude=${coord.lat}&longitude=${coord.lng}`
      );
      
      if (response.ok) {
        const data = await response.json();
        console.log(`      ✅ API Response: ${response.status}`);
        console.log(`      📍 Detected: ${data.currentLocation?.name || 'Unknown'}`);
        console.log(`      🏢 Area: ${data.currentLocation?.area || 'Unknown'}`);
        console.log(`      🔍 Source: ${data.currentLocation?.source || 'Unknown'}`);
        console.log(`      🎯 Accuracy: ${data.currentLocation?.accuracy || 'Unknown'}`);
        console.log(`      🗑️ Nearby bins: ${data.allNearbyBins?.length || 0}`);
        
        // Check if it's showing wrong location
        if (data.currentLocation?.name === 'Defence Colony' && coord.name !== 'Defence Colony') {
          console.log(`      ⚠️ WARNING: Expected ${coord.name}, got Defence Colony!`);
        } else if (data.currentLocation?.name !== coord.name && data.currentLocation?.name !== 'Delhi NCR') {
          console.log(`      ⚠️ INFO: Expected ${coord.name}, got ${data.currentLocation?.name}`);
        } else {
          console.log(`      ✅ Location detection working correctly`);
        }
      } else {
        console.log(`      ❌ API call failed: ${response.status}`);
      }
    } catch (error) {
      console.log(`      ❌ Error: ${error.message}`);
    }
  }

  // Test 3: Test real-time location service directly
  console.log('\n3. 🌐 Testing real-time location service...');
  try {
    const testResponse = await fetch(`${API_BASE_URL}/api/test-location/test/28.6315/77.2167`);
    if (testResponse.ok) {
      const testData = await testResponse.json();
      console.log('   ✅ Real-time location service working');
      console.log('   📍 Detected:', testData.detectedLocation?.name);
      console.log('   🔍 Source:', testData.detectedLocation?.source);
      console.log('   🎯 Accuracy:', testData.detectedLocation?.accuracy);
    } else {
      console.log('   ❌ Real-time location service failed');
      console.log('   🔧 Make sure backend has latest code');
    }
  } catch (error) {
    console.log('   ❌ Real-time location service error:', error.message);
  }

  // Test 4: Test reverse geocoding directly
  console.log('\n4. 🗺️ Testing reverse geocoding directly...');
  try {
    const geocodingUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=28.6315&longitude=77.2167&localityLanguage=en&timestamp=${Date.now()}`;
    const geocodingResponse = await fetch(geocodingUrl);
    
    if (geocodingResponse.ok) {
      const geocodingData = await geocodingResponse.json();
      console.log('   ✅ Reverse geocoding working');
      console.log('   📍 Locality:', geocodingData.locality || 'N/A');
      console.log('   🏢 City:', geocodingData.city || 'N/A');
      console.log('   🗺️ Principal Subdivision:', geocodingData.principalSubdivision || 'N/A');
      
      if (geocodingData.locality === 'Defence Colony') {
        console.log('   ⚠️ WARNING: Geocoding service returning Defence Colony for Connaught Place!');
        console.log('   🔍 This is a geocoding service issue, not our code');
      }
    } else {
      console.log('   ❌ Reverse geocoding failed');
    }
  } catch (error) {
    console.log('   ❌ Reverse geocoding error:', error.message);
  }

  console.log('\n' + '='.repeat(50));
  console.log('📋 LOCATION DEBUG SUMMARY:');
  console.log('');
  console.log('✅ If backend is running on port 5000 and responding:');
  console.log('   - Location API should work');
  console.log('   - Frontend should connect properly');
  console.log('');
  console.log('⚠️ If location is still showing wrong:');
  console.log('   1. Clear browser cache completely');
  console.log('   2. Try incognito/private browsing');
  console.log('   3. Check browser location permissions');
  console.log('   4. Disable VPN if using one');
  console.log('   5. Try different network/device');
  console.log('');
  console.log('🔧 If API calls are failing:');
  console.log('   1. Restart backend: cd backend && npm run dev');
  console.log('   2. Check port 5000 is not blocked by firewall');
  console.log('   3. Verify .env file has correct PORT=5000');
}

debugLocationPort5000().catch(console.error);