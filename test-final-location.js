// Final comprehensive location detection test
const API_BASE_URL = "http://localhost:5000";

async function testFinalLocationDetection() {
  console.log("🎯 FINAL LOCATION DETECTION TEST");
  console.log("=".repeat(50));
  console.log("");

  // Test various Delhi locations to ensure accuracy
  const testLocations = [
    { name: "Connaught Place", lat: 28.6315, lng: 77.2167, expected: "Connaught Place" },
    { name: "India Gate", lat: 28.6129, lng: 77.2295, expected: "India Gate" },
    { name: "Khan Market", lat: 28.5983, lng: 77.2319, expected: "Khan Market" },
    { name: "Civil Lines", lat: 28.6770, lng: 77.2230, expected: "Civil Lines" },
    { name: "Karol Bagh", lat: 28.6519, lng: 77.1909, expected: "Karol Bagh" },
    { name: "Lajpat Nagar", lat: 28.5680, lng: 77.2435, expected: "Lajpat Nagar" },
    { name: "Defence Colony", lat: 28.5730, lng: 77.2295, expected: "Defence Colony" },
    { name: "Rohini", lat: 28.7040, lng: 77.1025, expected: "Rohini" }
  ];

  let passedTests = 0;
  let totalTests = testLocations.length;

  for (const location of testLocations) {
    console.log(`📍 Testing: ${location.name} (${location.lat}, ${location.lng})`);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/location/info?latitude=${location.lat}&longitude=${location.lng}`
      );

      if (response.ok) {
        const data = await response.json();
        
        const detectedName = data.currentLocation?.name || 'Unknown';
        const detectedArea = data.currentLocation?.area || 'Unknown';
        const source = data.currentLocation?.source || 'Unknown';
        const accuracy = data.currentLocation?.accuracy || 'Unknown';
        
        console.log(`   ✅ Detected: ${detectedName}, ${detectedArea}`);
        console.log(`   📊 Source: ${source}, Accuracy: ${accuracy}`);
        console.log(`   🗑️ Local bins: ${data.localBinCount}, Nearby bins: ${data.nearbyBinCount}`);
        
        // Check if detection is accurate
        const isAccurate = detectedName.toLowerCase().includes(location.expected.toLowerCase()) ||
                          location.expected.toLowerCase().includes(detectedName.toLowerCase());
        
        if (isAccurate) {
          console.log(`   ✅ PASS: Correctly detected ${location.expected}`);
          passedTests++;
        } else {
          console.log(`   ❌ FAIL: Expected ${location.expected}, got ${detectedName}`);
        }
        
        // Check for problematic generic terms
        if (detectedName.includes('Tehsil') || detectedName.includes('tehsil')) {
          console.log(`   ⚠️  WARNING: Generic 'Tehsil' detected - this should be fixed!`);
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
  console.log(`🏁 TEST RESULTS: ${passedTests}/${totalTests} tests passed`);
  console.log(`📊 Success Rate: ${((passedTests/totalTests) * 100).toFixed(1)}%`);
  
  if (passedTests === totalTests) {
    console.log("🎉 ALL TESTS PASSED! Location detection is working perfectly!");
  } else if (passedTests >= totalTests * 0.8) {
    console.log("✅ Most tests passed. Location detection is working well!");
  } else {
    console.log("⚠️  Some tests failed. Location detection needs improvement.");
  }
  
  console.log("");
  console.log("🔧 NEXT STEPS:");
  console.log("1. Clear your browser cache completely");
  console.log("2. Refresh the frontend application");
  console.log("3. Test location detection in the browser");
  console.log("4. The backend should now provide accurate location names");
}

testFinalLocationDetection().catch(console.error);