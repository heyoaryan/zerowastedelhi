// Debug Location Detection Issue
// Run this with: node debug-location.js

const API_BASE_URL = 'http://localhost:5000';

async function debugLocation() {
  console.log('🔍 Debugging Location Detection Issue...\n');

  // Test with multiple Delhi coordinates to see which ones work
  const testLocations = [
    { name: 'Connaught Place', lat: 28.6315, lng: 77.2167 },
    { name: 'India Gate', lat: 28.6129, lng: 77.2295 },
    { name: 'Khan Market', lat: 28.5983, lng: 77.2319 },
    { name: 'Karol Bagh', lat: 28.6519, lng: 77.1909 },
    { name: 'Lajpat Nagar', lat: 28.5677, lng: 77.2436 },
    { name: 'Saket', lat: 28.5245, lng: 77.2066 },
    { name: 'Nehru Place', lat: 28.5494, lng: 77.2519 },
    { name: 'Model Town', lat: 28.7041, lng: 77.2025 }
  ];

  for (const location of testLocations) {
    console.log(`\n📍 Testing: ${location.name} (${location.lat}, ${location.lng})`);
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/location/info?latitude=${location.lat}&longitude=${location.lng}`
      );

      if (response.ok) {
        const data = await response.json();
        
        console.log('   Results:');
        console.log('   - Success:', data.success);
        console.log('   - In Delhi:', data.isInDelhi);
        console.log('   - Recognized Area:', data.isInRecognizedArea);
        
        if (data.currentLocation) {
          console.log('   - Detected Location:', data.currentLocation.name);
          console.log('   - Area:', data.currentLocation.area);
        } else {
          console.log('   - No specific location detected');
        }
        
        console.log('   - Local Bins (1km):', data.localBinCount || 0);
        console.log('   - Nearby Bins (3km):', data.nearbyBinCount || 0);
        console.log('   - All Nearby Bins:', data.allNearbyBins?.length || 0);
        console.log('   - Message:', data.message);
        
        if (data.allNearbyBins && data.allNearbyBins.length > 0) {
          console.log('   - First Bin:', data.allNearbyBins[0].binId, 
                     `(${data.allNearbyBins[0].distanceFromUser}km away)`);
        }
        
        // Show what condition it would fall into
        if (data.success && data.isInRecognizedArea) {
          console.log('   ✅ Would show: Specific location with bins');
        } else if (data.success && data.isInDelhi) {
          console.log('   ⚠️  Would show: Generic Delhi NCR');
        } else {
          console.log('   ❌ Would show: Outside Delhi or error');
        }
        
      } else {
        console.log('   ❌ API call failed:', response.status);
      }
    } catch (error) {
      console.log('   ❌ Network error:', error.message);
    }
  }

  console.log('\n🔧 Recommendations:');
  console.log('1. Check if backend location service has proper Delhi area data');
  console.log('2. Verify database has been seeded with location and bin data');
  console.log('3. Check if coordinates are being processed correctly');
  console.log('4. Ensure location service radius calculations are working');
}

debugLocation();