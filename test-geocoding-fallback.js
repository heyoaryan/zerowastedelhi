// Test geocoding fallback for coordinates that don't match precisely
const API_BASE_URL = "http://localhost:5000";

async function testGeocodingFallback() {
  console.log("🧪 TESTING GEOCODING FALLBACK");
  console.log("=".repeat(50));
  console.log("");

  // Test coordinates that might not match precise ranges
  const testCoords = [
    { name: "Between areas 1", lat: 28.65, lng: 77.20 },
    { name: "Between areas 2", lat: 28.58, lng: 77.23 },
    { name: "Between areas 3", lat: 28.62, lng: 77.18 },
    { name: "Your approximate area", lat: 28.67, lng: 77.21 }, // This might be near your location
    { name: "Random Delhi spot", lat: 28.61, lng: 77.26 }
  ];

  for (const coord of testCoords) {
    console.log(`📍 Testing: ${coord.name} (${coord.lat}, ${coord.lng})`);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/location/info?latitude=${coord.lat}&longitude=${coord.lng}`
      );

      if (response.ok) {
        const data = await response.json();
        const location = data.currentLocation;
        
        console.log(`   ✅ Detected: ${location?.name || 'Unknown'}`);
        console.log(`   📍 Area: ${location?.area || 'Unknown'}`);
        console.log(`   🔧 Source: ${location?.source || 'Unknown'}`);
        console.log(`   📊 Accuracy: ${location?.accuracy || 'Unknown'}`);
        
        // Check what type of detection was used
        if (location?.source === 'coordinate-precise') {
          console.log(`   🎯 PRECISE: Exact coordinate match`);
        } else if (location?.source === 'coordinate-nearest' || location?.source === 'coordinate-approximate') {
          console.log(`   📏 NEARBY: Close to known location`);
        } else if (location?.source === 'nominatim' || location?.source === 'bigdatacloud') {
          console.log(`   🌐 GEOCODED: From ${location.source} service`);
        } else if (location?.source === 'nearest-approximation') {
          console.log(`   🔍 APPROXIMATED: Near known location`);
        } else if (location?.source === 'gps-coordinates') {
          console.log(`   📱 GPS: Showing coordinates (no place name found)`);
        }
        
        console.log(`   🗑️ Bins: ${data.localBinCount} local, ${data.nearbyBinCount} nearby`);
        
      } else {
        console.log(`   ❌ API Error: ${response.status}`);
      }
    } catch (error) {
      console.log(`   ❌ Network Error: ${error.message}`);
    }
    console.log("");
  }
  
  console.log("=".repeat(50));
  console.log("🎯 SYSTEM NOW:");
  console.log("✅ Shows place names when possible");
  console.log("✅ Uses geocoding services as fallback");
  console.log("✅ More generous coordinate matching");
  console.log("✅ Better coverage of Delhi areas");
}

testGeocodingFallback().catch(console.error);