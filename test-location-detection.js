// Test Location Detection
// Run this with: node test-location-detection.js

const API_BASE_URL = "http://localhost:5000";

async function testLocationDetection() {
  console.log("🧪 Testing Location Detection...\n");

  // Test coordinates for different Delhi locations
  const testLocations = [
    { name: "Connaught Place", lat: 28.6315, lng: 77.2167 },
    { name: "India Gate", lat: 28.6129, lng: 77.2295 },
    { name: "Khan Market", lat: 28.5983, lng: 77.2319 },
    { name: "Karol Bagh", lat: 28.6519, lng: 77.1909 },
    { name: "Random Delhi Location", lat: 28.65, lng: 77.2 },
  ];

  for (const location of testLocations) {
    console.log(
      `\n📍 Testing: ${location.name} (${location.lat}, ${location.lng})`
    );

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/location/info?latitude=${location.lat}&longitude=${location.lng}`
      );

      console.log(`   Response Status: ${response.status}`);

      if (response.ok) {
        const data = await response.json();
        console.log(`   Success: ${data.success}`);
        console.log(`   In Delhi: ${data.isInDelhi}`);
        console.log(`   Recognized Area: ${data.isInRecognizedArea}`);

        if (data.currentLocation) {
          console.log(
            `   ✅ Detected: ${data.currentLocation.name}, ${data.currentLocation.area}`
          );
        } else {
          console.log(`   ⚠️  No specific location detected`);
        }

        console.log(`   Local Bins: ${data.localBinCount || 0}`);
        console.log(`   Nearby Bins: ${data.nearbyBinCount || 0}`);
        console.log(`   Message: ${data.message}`);

        if (data.allNearbyBins && data.allNearbyBins.length > 0) {
          console.log(
            `   First Bin: ${data.allNearbyBins[0].binId} (${data.allNearbyBins[0].distanceFromUser}km)`
          );
        }
      } else {
        const errorData = await response.json();
        console.log(`   ❌ Error: ${errorData.message}`);
      }
    } catch (error) {
      console.log(`   ❌ Network Error: ${error.message}`);
    }
  }

  console.log("\n🏁 Location detection test completed!");
}

// Run the test
testLocationDetection().catch(console.error);
