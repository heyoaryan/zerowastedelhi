// Test user's actual location detection
const API_BASE_URL = "http://localhost:5000";

async function testUserLocation() {
  console.log("🧪 Testing User's Actual Location Detection...\n");

  // Let's test a few coordinates around Delhi to see what's happening
  const testCoords = [
    { name: "Test Location 1", lat: 28.6500, lng: 77.2000 },
    { name: "Test Location 2", lat: 28.6000, lng: 77.2500 },
    { name: "Test Location 3", lat: 28.7000, lng: 77.1500 },
    { name: "Test Location 4", lat: 28.5500, lng: 77.2000 },
    { name: "Test Location 5", lat: 28.6800, lng: 77.2200 }
  ];
  
  for (const coord of testCoords) {
    console.log(`📍 Testing: ${coord.name} (${coord.lat}, ${coord.lng})`);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/location/info?latitude=${coord.lat}&longitude=${coord.lng}`
      );

      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ Detected: ${data.currentLocation?.name}, ${data.currentLocation?.area}`);
        console.log(`   📊 Source: ${data.currentLocation?.source}, Accuracy: ${data.currentLocation?.accuracy}`);
        console.log(`   🗑️ Local bins: ${data.localBinCount}, Nearby bins: ${data.nearbyBinCount}`);
        
        // Show raw geocoding data if available
        if (data.currentLocation?.rawData) {
          console.log(`   🔍 Raw geocoding data:`, data.currentLocation.rawData);
        }
        
      } else {
        console.log("   ❌ API Error:", response.status);
      }
    } catch (error) {
      console.log("   ❌ Network Error:", error.message);
    }
    console.log("");
  }
  
  console.log("🔧 PLEASE PROVIDE YOUR ACTUAL COORDINATES:");
  console.log("1. Go to https://www.latlong.net/");
  console.log("2. Allow location access");
  console.log("3. Copy your latitude and longitude");
  console.log("4. Tell me the coordinates so I can test with your exact location");
}

testUserLocation().catch(console.error);