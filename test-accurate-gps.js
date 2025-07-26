// Test accurate GPS location detection
const API_BASE_URL = 'http://localhost:5000';

async function testAccurateGPS() {
  console.log('🎯 TESTING ACCURATE GPS LOCATION DETECTION');
  console.log('='.repeat(60));

  // Test with real Delhi coordinates
  const realCoordinates = [
    { lat: 28.6315, lng: 77.2167, expected: 'Connaught Place', description: 'CP Central' },
    { lat: 28.6129, lng: 77.2295, expected: 'India Gate', description: 'India Gate Area' },
    { lat: 28.5983, lng: 77.2319, expected: 'Khan Market', description: 'Khan Market' },
    { lat: 28.6519, lng: 77.1909, expected: 'Karol Bagh', description: 'Karol Bagh Market' },
    { lat: 28.5677, lng: 77.2436, expected: 'Lajpat Nagar', description: 'Lajpat Nagar Central' },
    { lat: 28.5729, lng: 77.2294, expected: 'Defence Colony', description: 'Defence Colony Market' },
    { lat: 28.6692, lng: 77.1174, expected: 'Rajouri Garden', description: 'Rajouri Garden Metro' },
    { lat: 28.5245, lng: 77.2066, expected: 'Saket', description: 'Saket Select City' },
    { lat: 28.6345, lng: 77.2767, expected: 'Laxmi Nagar', description: 'Laxmi Nagar Metro' },
    { lat: 28.6769, lng: 77.2232, expected: 'Civil Lines', description: 'Civil Lines Area' }
  ];

  console.log('\n🔍 Testing GPS accuracy for different Delhi locations...\n');

  let correctDetections = 0;
  let totalTests = realCoordinates.length;

  for (const coord of realCoordinates) {
    try {
      console.log(`📍 Testing: ${coord.description} (${coord.lat}, ${coord.lng})`);
      console.log(`   Expected: ${coord.expected}`);
      
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
        if (detectedName === coord.expected) {
          console.log(`   🎯 ✅ PERFECT MATCH!`);
          correctDetections++;
        } else if (detectedName.includes(coord.expected) || coord.expected.includes(detectedName)) {
          console.log(`   🎯 ✅ CLOSE MATCH!`);
          correctDetections++;
        } else {
          console.log(`   ❌ MISMATCH: Expected ${coord.expected}, got ${detectedName}`);
        }

        // Check if bins are relevant to the location
        if (data.allNearbyBins && data.allNearbyBins.length > 0) {
          const nearestBin = data.allNearbyBins[0];
          console.log(`   🗑️ Nearest bin: ${nearestBin.binId} at ${nearestBin.distanceFromUser?.toFixed(2)}km`);
        } else {
          console.log(`   ⚠️ No nearby bins found`);
        }
        
      } else {
        console.log(`   ❌ API call failed: ${response.status}`);
      }
      
      console.log(''); // Empty line for readability
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}\n`);
    }
  }

  // Test with user's actual location (if they want to provide it)
  console.log('🌐 TESTING WITH YOUR ACTUAL LOCATION:');
  console.log('To test with your real GPS coordinates:');
  console.log('1. Open browser developer tools (F12)');
  console.log('2. Go to Console tab');
  console.log('3. Run: navigator.geolocation.getCurrentPosition(pos => {');
  console.log('   const lat = pos.coords.latitude;');
  console.log('   const lng = pos.coords.longitude;');
  console.log(`   fetch('${API_BASE_URL}/api/location/info?latitude=' + lat + '&longitude=' + lng)`);
  console.log('     .then(r => r.json()).then(d => console.log("Your location:", d.currentLocation));');
  console.log('});');

  console.log('\n' + '='.repeat(60));
  console.log('📊 GPS ACCURACY TEST RESULTS:');
  console.log(`   Correct detections: ${correctDetections}/${totalTests} (${((correctDetections/totalTests)*100).toFixed(1)}%)`);
  console.log('');
  
  if (correctDetections >= totalTests * 0.8) {
    console.log('✅ EXCELLENT: GPS location detection is working accurately!');
    console.log('   - Locations are being detected correctly');
    console.log('   - Nearby bins should be relevant');
    console.log('   - Frontend should show accurate locations');
  } else if (correctDetections >= totalTests * 0.6) {
    console.log('⚠️ GOOD: GPS location detection is mostly working');
    console.log('   - Most locations are detected correctly');
    console.log('   - Some edge cases may need refinement');
  } else {
    console.log('❌ NEEDS IMPROVEMENT: GPS location detection has issues');
    console.log('   - Many locations are not detected correctly');
    console.log('   - Backend may need restart with new code');
    console.log('   - Check geocoding services availability');
  }
  
  console.log('');
  console.log('🔧 If accuracy is still poor:');
  console.log('   1. Restart backend server: cd backend && npm run dev');
  console.log('   2. Clear browser cache completely');
  console.log('   3. Test in incognito mode');
  console.log('   4. Check browser location permissions');
  console.log('   5. Disable VPN if using one');
}

testAccurateGPS().catch(console.error);