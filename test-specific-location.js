// Test specific location detection
const API_BASE_URL = "http://localhost:5000";

async function testSpecificLocation() {
  console.log("🧪 Testing Specific Location Detection...\n");

  // Test with a very specific coordinate that should be Connaught Place
  const testCoord = { lat: 28.6315, lng: 77.2167, expected: "Connaught Place" };
  
  console.log(`📍 Testing: ${testCoord.expected} (${testCoord.lat}, ${testCoord.lng})`);

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/location/info?latitude=${testCoord.lat}&longitude=${testCoord.lng}`
    );

    if (response.ok) {
      const data = await response.json();
      console.log("Full API Response:", JSON.stringify(data, null, 2));
      
      console.log("\n🔍 Key Information:");
      console.log(`   Detected: ${data.currentLocation?.name}`);
      console.log(`   Area: ${data.currentLocation?.area}`);
      console.log(`   Source: ${data.currentLocation?.source}`);
      console.log(`   Accuracy: ${data.currentLocation?.accuracy}`);
      console.log(`   Expected: ${testCoord.expected}`);
      console.log(`   Match: ${data.currentLocation?.name === testCoord.expected ? '✅ YES' : '❌ NO'}`);
      
    } else {
      console.log("❌ API Error:", response.status);
    }
  } catch (error) {
    console.log("❌ Network Error:", error.message);
  }
}

testSpecificLocation().catch(console.error);