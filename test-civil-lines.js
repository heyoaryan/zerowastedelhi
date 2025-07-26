// Test Civil Lines area detection
const API_BASE_URL = "http://localhost:5000";

async function testCivilLinesArea() {
  console.log("🧪 Testing Civil Lines Area Detection...\n");

  // Test coordinates around Civil Lines area
  const testCoords = [
    { lat: 28.6770, lng: 77.2230, name: "Civil Lines Center" },
    { lat: 28.6750, lng: 77.2240, name: "Civil Lines North" },
    { lat: 28.6780, lng: 77.2220, name: "Civil Lines South" },
    { lat: 28.6760, lng: 77.2250, name: "Civil Lines East" },
    { lat: 28.6790, lng: 77.2210, name: "Civil Lines West" }
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
        
        if (data.currentLocation?.name.includes('Tehsil') || data.currentLocation?.name.includes('tehsil')) {
          console.log(`   ⚠️  WARNING: Generic 'Tehsil' detected - this should be fixed!`);
        }
        
      } else {
        console.log("   ❌ API Error:", response.status);
      }
    } catch (error) {
      console.log("   ❌ Network Error:", error.message);
    }
    console.log("");
  }
}

testCivilLinesArea().catch(console.error);