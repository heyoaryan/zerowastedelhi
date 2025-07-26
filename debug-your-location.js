// Debug your specific location issue
const API_BASE_URL = "https://zero-waste-delhi-backend-hsqb.onrender.com";

async function debugYourLocation() {
  console.log("🔍 DEBUGGING YOUR LOCATION ISSUE");
  console.log("=".repeat(50));
  console.log("");

  // Test the coordinate that might be showing as Defence Colony
  const testCoord = { lat: 28.6000, lng: 77.2500 }; // This showed Defence Colony in our test
  
  console.log(`📍 Testing coordinate that shows Defence Colony: ${testCoord.lat}, ${testCoord.lng}`);
  console.log("");

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/debug-location/location-debug?latitude=${testCoord.lat}&longitude=${testCoord.lng}`
    );

    if (response.ok) {
      const data = await response.json();
      
      console.log("🎯 FINAL RESULT:");
      console.log(`   Name: ${data.finalResult.name}`);
      console.log(`   Area: ${data.finalResult.area}`);
      console.log(`   Source: ${data.finalResult.source}`);
      console.log(`   Accuracy: ${data.finalResult.accuracy}`);
      console.log("");
      
      console.log("🌐 GEOCODING SERVICE RESULTS:");
      data.geocodingTests.forEach(test => {
        if (test.error) {
          console.log(`   ${test.service}: ERROR - ${test.error}`);
        } else {
          console.log(`   ${test.service}:`);
          console.log(`     Locality: ${test.parsed.locality || 'None'}`);
          console.log(`     City: ${test.parsed.city || 'None'}`);
          console.log(`     Area: ${test.parsed.area || 'None'}`);
        }
      });
      
      console.log("");
      console.log("🔧 TO FIX YOUR LOCATION:");
      console.log("1. Tell me what area you actually live in");
      console.log("2. I'll add precise coordinates for your area");
      console.log("3. Or provide your exact coordinates from your browser");
      
    } else {
      console.log("❌ Debug API Error:", response.status);
    }
  } catch (error) {
    console.log("❌ Network Error:", error.message);
  }
}

debugYourLocation().catch(console.error);