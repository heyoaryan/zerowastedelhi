// Test direct location detection (no external APIs)
const API_BASE_URL = 'http://localhost:5000';

async function testDirectLocation() {
  console.log('🎯 TESTING DIRECT LOCATION DETECTION');
  console.log('='.repeat(50));

  // Test coordinates that should NOT show Defence Colony
  const testCoordinates = [
    { lat: 28.6315, lng: 77.2167, expected: 'Connaught Place' },
    { lat: 28.6129, lng: 77.2295, expected: 'India Gate' },
    { lat: 28.5983, lng: 77.2319, expected: 'Khan Market' },
    { lat: 28.6519, lng: 77.1909, expected: 'Karol Bagh' },
    { lat: 28.5677, lng: 77.2436, expected: 'Lajpat Nagar' },
    { lat: 28.6692, lng: 77.1174, expected: 'Rajouri Garden' },
    { lat: 28.5245, lng: 77.2066, expected: 'Saket' },
    { lat: 28.6345, lng: 77.2767, expected: 'Laxmi Nagar' }
  ];

  console.log('\n🔍 Testing direct location detection...\n');

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
        
        console.log(`   ✅ Detected: ${detectedName}, ${detectedArea}`);
        console.log(`   📊 Source: ${source}`);
        console.log(`   🗑️ Nearby bins: ${data.allNearbyBins?.length || 0}`);
        
        // Check if it matches expected
        if (detectedName === coord.expected) {
          console.log(`   🎯 ✅ PERFECT MATCH!`);
        } else if (detectedName === 'Defence Colony' && coord.expected !== 'Defence Colony') {
          console.log(`   ❌ STILL SHOWING DEFENCE COLONY - PROBLEM NOT FIXED`);
        } else {
          console.log(`   ⚠️ Different: Expected ${coord.expected}, got ${detectedName}`);
        }
      } else {
        console.log(`   ❌ API call failed: ${response.status}`);
      }
      
      console.log(''); // Empty line
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}\n`);
    }
  }

  console.log('='.repeat(50));
  console.log('📋 DIRECT LOCATION TEST SUMMARY:');
  console.log('');
  console.log('✅ If locations show correctly above:');
  console.log('   - Direct location detection is working');
  console.log('   - No more Defence Colony for wrong locations');
  console.log('   - Nearby bins should be visible');
  console.log('');
  console.log('❌ If still showing Defence Colony:');
  console.log('   - Backend may not have restarted with new code');
  console.log('   - Check backend terminal for errors');
  console.log('   - Restart backend: cd backend && npm run dev');
}

testDirectLocation().catch(console.error);