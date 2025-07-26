// Test to help debug your specific location issue
const API_BASE_URL = "http://localhost:5000";

async function testYourLocationIssue() {
  console.log("🔍 DEBUGGING YOUR LOCATION ISSUE");
  console.log("=".repeat(50));
  console.log("");
  
  console.log("Please provide your approximate coordinates to test:");
  console.log("You can get them from:");
  console.log("1. Google Maps: Right-click and select coordinates");
  console.log("2. Your browser: Allow location and check console");
  console.log("3. GPS app on your phone");
  console.log("");
  
  // Test a few coordinates around Delhi to see the pattern
  const testCoords = [
    { name: "North Delhi Sample", lat: 28.70, lng: 77.20 },
    { name: "Central Delhi Sample", lat: 28.63, lng: 77.22 },
    { name: "South Delhi Sample", lat: 28.55, lng: 77.24 },
    { name: "East Delhi Sample", lat: 28.62, lng: 77.30 },
    { name: "West Delhi Sample", lat: 28.65, lng: 77.15 }
  ];
  
  console.log("Testing various Delhi locations to understand the pattern:\n");
  
  for (const coord of testCoords) {
    console.log(`📍 ${coord.name} (${coord.lat}, ${coord.lng})`);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/location/info?latitude=${coord.lat}&longitude=${coord.lng}`
      );

      if (response.ok) {
        const data = await response.json();
        const location = data.currentLocation;
        
        console.log(`   🎯 Detected: ${location?.name || 'Unknown'}`);
        console.log(`   📍 Area: ${location?.area || 'Unknown'}`);
        console.log(`   🔧 Source: ${location?.source || 'Unknown'}`);
        console.log(`   📊 Accuracy: ${location?.accuracy || 'Unknown'}`);
        
        if (location?.distance) {
          console.log(`   📏 Distance: ${location.distance}km from nearest known location`);
        }
        
        if (location?.nearestKnown) {
          console.log(`   🎯 Nearest known: ${location.nearestKnown}`);
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
  console.log("🔧 TO FIX YOUR SPECIFIC ISSUE:");
  console.log("1. Open browser developer tools (F12)");
  console.log("2. Go to Add Waste page");
  console.log("3. Click 'Get My Location'");
  console.log("4. Check console for logs like:");
  console.log("   - '🌐 Geocoding results:'");
  console.log("   - '✅ Found specific location from...'");
  console.log("   - '✅ Backend detected location:'");
  console.log("5. Share those logs to help debug further");
  console.log("");
  console.log("The system now prioritizes real geocoding over coordinate guessing!");
}

testYourLocationIssue().catch(console.error);