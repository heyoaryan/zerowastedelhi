// Simple Location API Test
// Run this with: node test-location-simple.js

const API_BASE_URL = 'http://localhost:5001';

async function testLocationAPI() {
  console.log('🧪 Testing Location API...\n');

  // Test with Connaught Place coordinates (should work)
  const testLat = 28.6315;
  const testLng = 77.2167;

  try {
    console.log(`Testing coordinates: ${testLat}, ${testLng}`);
    
    const response = await fetch(
      `${API_BASE_URL}/api/location/info?latitude=${testLat}&longitude=${testLng}`
    );

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (response.ok) {
      const data = await response.json();
      console.log('\n✅ API Response:');
      console.log('Success:', data.success);
      console.log('In Delhi:', data.isInDelhi);
      console.log('Recognized Area:', data.isInRecognizedArea);
      
      if (data.currentLocation) {
        console.log('Location:', data.currentLocation.name);
        console.log('Area:', data.currentLocation.area);
      }
      
      console.log('Message:', data.message);
      console.log('Nearby bins:', data.allNearbyBins?.length || 0);
    } else {
      console.log('❌ API call failed');
      const errorText = await response.text();
      console.log('Error response:', errorText);
    }

  } catch (error) {
    console.log('❌ Network error:', error.message);
    console.log('\nPossible issues:');
    console.log('- Backend not running on port 5001');
    console.log('- Database not connected');
    console.log('- Location service not working');
  }
}

testLocationAPI();