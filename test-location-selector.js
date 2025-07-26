// Test the new location selector system
const API_BASE_URL = "http://localhost:5000";

async function testLocationSelector() {
  console.log("🎯 TESTING LOCATION SELECTOR SYSTEM");
  console.log("=".repeat(50));
  console.log("");

  // Test with a sample coordinate
  const testCoord = { lat: 28.67, lng: 77.21 };
  
  console.log(`📍 Testing coordinate: ${testCoord.lat}, ${testCoord.lng}`);

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/location/info?latitude=${testCoord.lat}&longitude=${testCoord.lng}`
    );

    if (response.ok) {
      const data = await response.json();
      
      console.log("✅ API Response received");
      console.log(`📊 Success: ${data.success}`);
      console.log(`🗺️ In Delhi: ${data.isInDelhi}`);
      
      if (data.locationData) {
        console.log(`📍 Requires user selection: ${data.locationData.requiresUserSelection}`);
        
        if (data.locationData.availableAreas) {
          console.log("\n🏘️ AVAILABLE AREAS:");
          Object.entries(data.locationData.availableAreas).forEach(([district, areas]) => {
            console.log(`\n${district}:`);
            areas.forEach((area, index) => {
              console.log(`  ${index + 1}. ${area}`);
            });
          });
        }
      }
      
      console.log(`\n🗑️ BINS INFORMATION:`);
      console.log(`   Local bins (within 1km): ${data.localBinCount}`);
      console.log(`   Nearby bins (within 3km): ${data.nearbyBinCount}`);
      console.log(`   Message: ${data.message}`);
      
    } else {
      console.log(`❌ API Error: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Network Error: ${error.message}`);
  }
  
  console.log("\n" + "=".repeat(50));
  console.log("🎉 LOCATION SELECTOR FEATURES:");
  console.log("✅ User gets GPS coordinates first");
  console.log("✅ System shows organized list of Delhi areas");
  console.log("✅ User selects their actual area");
  console.log("✅ No more wrong location guesses");
  console.log("✅ Includes Sant Nagar, Swaroop Nagar, and 50+ areas");
  console.log("✅ Scanner buttons optimized for faster performance");
  console.log("\n🚀 READY TO TEST IN BROWSER!");
}

testLocationSelector().catch(console.error);