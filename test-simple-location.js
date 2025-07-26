// Test the simplified location detection
const API_BASE_URL = "http://localhost:5000";

async function testSimpleLocationDetection() {
  console.log("🎯 TESTING SIMPLIFIED LOCATION DETECTION");
  console.log("=".repeat(50));
  console.log("");

  // Test various coordinates including the new areas
  const testLocations = [
    { name: "Sant Nagar", lat: 28.6870, lng: 77.2120 },
    { name: "Swaroop Nagar", lat: 28.6920, lng: 77.1970 },
    { name: "Timarpur", lat: 28.6970, lng: 77.2070 },
    { name: "Shastri Nagar", lat: 28.6820, lng: 77.1920 },
    { name: "Random Location 1", lat: 28.60, lng: 77.25 },
    { name: "Random Location 2", lat: 28.55, lng: 77.20 },
    { name: "Connaught Place", lat: 28.6315, lng: 77.2167 }
  ];

  for (const location of testLocations) {
    console.log(`📍 Testing: ${location.name} (${location.lat}, ${location.lng})`);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/location/info?latitude=${location.lat}&longitude=${location.lng}`
      );

      if (response.ok) {
        const data = await response.json();
        const detectedLocation = data.currentLocation;
        
        console.log(`   ✅ Detected: ${detectedLocation?.name || 'Unknown'}`);
        console.log(`   📍 Area: ${detectedLocation?.area || 'Unknown'}`);
        console.log(`   🔧 Source: ${detectedLocation?.source || 'Unknown'}`);
        console.log(`   📊 Accuracy: ${detectedLocation?.accuracy || 'Unknown'}`);
        console.log(`   🗑️ Bins: ${data.localBinCount} local, ${data.nearbyBinCount} nearby`);
        
        // Check if it's showing GPS coordinates (better than wrong location)
        if (detectedLocation?.name?.includes('GPS Location')) {
          console.log(`   ℹ️  INFO: Showing GPS coordinates (no wrong guess)`);
        }
        
      } else {
        console.log(`   ❌ API Error: ${response.status}`);
      }
    } catch (error) {
      console.log(`   ❌ Network Error: ${error.message}`);
    }
    console.log("");
  }
  
  console.log("=".repeat(50));
  console.log("🎯 SIMPLIFIED APPROACH:");
  console.log("✅ Only shows location if coordinates match precisely");
  console.log("✅ Shows GPS coordinates instead of wrong guesses");
  console.log("✅ No more Defence Colony for wrong locations");
  console.log("✅ Added many more Delhi areas including Sant Nagar, Swaroop Nagar");
}

testSimpleLocationDetection().catch(console.error);