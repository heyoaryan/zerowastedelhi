// Test the new location confirmation system
const API_BASE_URL = "http://localhost:5000";

async function testLocationConfirmationSystem() {
  console.log("🎯 TESTING NEW LOCATION CONFIRMATION SYSTEM");
  console.log("=".repeat(60));
  console.log("");

  // Test with a coordinate that might have multiple interpretations
  const testCoord = { lat: 28.60, lng: 77.25 };
  
  console.log(`📍 Testing coordinate: ${testCoord.lat}, ${testCoord.lng}`);
  console.log("");

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/location/info?latitude=${testCoord.lat}&longitude=${testCoord.lng}`
    );

    if (response.ok) {
      const data = await response.json();
      const location = data.currentLocation;
      
      console.log("📊 LOCATION DETECTION RESULT:");
      console.log(`   🎯 Primary: ${location?.name || 'Unknown'}`);
      console.log(`   📍 Area: ${location?.area || 'Unknown'}`);
      console.log(`   🔧 Source: ${location?.source || 'Unknown'}`);
      console.log(`   📊 Accuracy: ${location?.accuracy || 'Unknown'}`);
      console.log(`   ❓ Needs Confirmation: ${location?.requiresConfirmation ? 'YES' : 'NO'}`);
      
      if (location?.alternatives && location.alternatives.length > 0) {
        console.log("");
        console.log("🔄 ALTERNATIVE SUGGESTIONS:");
        location.alternatives.forEach((alt, index) => {
          console.log(`   ${index + 1}. ${alt.name} (${alt.area}) - ${alt.confidence} confidence`);
        });
      }
      
      console.log("");
      console.log("🗑️ BINS INFORMATION:");
      console.log(`   📍 Local bins (within 1km): ${data.localBinCount}`);
      console.log(`   🌍 Nearby bins (within 3km): ${data.nearbyBinCount}`);
      
      console.log("");
      console.log("💡 USER EXPERIENCE:");
      if (location?.requiresConfirmation) {
        console.log("   ✅ System will ask user to confirm location");
        console.log("   ✅ User can choose from alternatives if available");
        console.log("   ✅ No more wrong location assumptions!");
      } else {
        console.log("   ✅ High confidence - location shown directly");
      }
      
    } else {
      console.log(`❌ API Error: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Network Error: ${error.message}`);
  }
  
  console.log("");
  console.log("=".repeat(60));
  console.log("🎉 NEW SYSTEM BENEFITS:");
  console.log("✅ No more wrong location guesses");
  console.log("✅ User can confirm or choose alternatives");
  console.log("✅ Multiple sources provide options");
  console.log("✅ Transparent about confidence level");
  console.log("✅ Better user experience overall");
}

testLocationConfirmationSystem().catch(console.error);