// Test accurate location detection
const API_BASE_URL = 'http://localhost:5000';

async function testAccurateLocation() {
  console.log('🧪 TESTING ACCURATE LOCATION DETECTION');
  console.log('='.repeat(50));

  // Test coordinates for different Delhi areas
  const testCoordinates = [
    { lat: 28.6315, lng: 77.2167, expected: 'Connaught Place', area: 'Central Delhi' },
    { lat: 28.6129, lng: 77.2295, expected: 'India Gate', area: 'Central Delhi' },
    { lat: 28.5983, lng: 77.2319, expected: 'Khan Market', area: 'Central Delhi' },
    { lat: 28.5729, lng: 77.2294, expected: 'Defence Colony', area: 'South Delhi' },
    { lat: 28.6769, lng: 77.2232, expected: 'Civil Lines', area: 'North Delhi' },
    { lat: 28.5677, lng: 77.2436, expected: 'Lajpat Nagar', area: 'South Delhi' },
    { lat: 28.6692, lng: 77.1174, expected: 'Rajouri Garden', area: 'West Delhi' },
    { lat: 28.6345, lng: 77.2767, expected: 'Laxmi Nagar', area: 'East Delhi' }
  ];

  console.log('\n🔍 Testing location detection for different coordinates...\n');

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
        
        // Check accuracy
        if (detectedName.toLowerCase().includes(coord.expected.toLowerCase()) || 
            coord.expected.toLowerCase().includes(detectedName.toLowerCase())) {
          console.log(`   🎯 ✅ ACCURATE: Expected location detected!`);
        } else if (detectedName === 'Defence Colony' && coord.expected !== 'Defence Colony') {
          console.log(`   ⚠️ ❌ ISSUE: Showing Defence Colony instead of ${coord.expected}`);
        } else if (detectedName === 'Civil Lines' && coord.expected !== 'Civil Lines') {
          console.log(`   ⚠️ ❌ ISSUE: Showing Civil Lines instead of ${coord.expected}`);
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

  // Test real-time location service directly
  console.log('🌐 Testing real-time location service directly...\n');
  
  try {
    const testResponse = await fetch(`${API_BASE_URL}/api/test-location/test/28.6315/77.2167`);
    if (testResponse.ok) {
      const testData = await testResponse.json();
      console.log('📍 Real-time service result:');
      console.log(`   Name: ${testData.detectedLocation?.name || 'N/A'}`);
      console.log(`   Area: ${testData.detectedLocation?.area || 'N/A'}`);
      console.log(`   Source: ${testData.detectedLocation?.source || 'N/A'}`);
      console.log(`   Accuracy: ${testData.detectedLocation?.accuracy || 'N/A'}`);
      
      if (testData.geocodingResult) {
        console.log('   🌐 Geocoding result:');
        console.log(`      Locality: ${testData.geocodingResult.locality || 'N/A'}`);
        console.log(`      City: ${testData.geocodingResult.city || 'N/A'}`);
        console.log(`      Area: ${testData.geocodingResult.principalSubdivision || 'N/A'}`);
      }
    } else {
      console.log('❌ Real-time service test failed');
    }
  } catch (error) {
    console.log('❌ Real-time service error:', error.message);
  }

  console.log('\n' + '='.repeat(50));
  console.log('📋 LOCATION ACCURACY SUMMARY:');
  console.log('');
  console.log('✅ If locations are showing correctly above:');
  console.log('   - Location detection is working properly');
  console.log('   - Frontend should show accurate locations');
  console.log('');
  console.log('❌ If still showing wrong locations:');
  console.log('   1. Clear browser cache completely');
  console.log('   2. Try incognito/private browsing');
  console.log('   3. Check browser location permissions');
  console.log('   4. Disable VPN if using one');
  console.log('   5. Try different network/device');
  console.log('');
  console.log('🔧 If API is working but frontend shows wrong:');
  console.log('   - The issue is likely browser caching');
  console.log('   - Try hard refresh (Ctrl+Shift+R)');
  console.log('   - Clear localStorage in browser console');
}

testAccurateLocation().catch(console.error);