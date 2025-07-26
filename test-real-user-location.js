// Test real user location detection
const API_BASE_URL = "http://localhost:5000";

async function testRealUserLocation() {
  console.log("🧪 Testing Real User Location Detection...\n");

  // Test coordinates that are NOT Defence Colony but might be detected as such
  const testCoords = [
    { name: "Random Delhi Location 1", lat: 28.60, lng: 77.25, shouldNOTBe: "Defence Colony" },
    { name: "Random Delhi Location 2", lat: 28.55, lng: 77.20, shouldNOTBe: "Defence Colony" },
    { name: "Random Delhi Location 3", lat: 28.65, lng: 77.18, shouldNOTBe: "Defence Colony" },
    { name: "Random Delhi Location 4", lat: 28.58, lng: 77.28, shouldNOTBe: "Defence Colony" },
    { name: "Actual Defence Colony", lat: 28.5730, lng: 77.2295, shouldBe: "Defence Colony" }
  ];
  
  for (const coord of testCoords) {
    console.log(`📍 Testing: ${coord.name} (${coord.lat}, ${coord.lng})`);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/location/info?latitude=${coord.lat}&longitude=${coord.lng}`
      );

      if (response.ok) {
        const data = await response.json();
        const detectedName = data.currentLocation?.name || 'Unknown';
        const detectedArea = data.currentLocation?.area || 'Unknown';
        const source = data.currentLocation?.source || 'Unknown';
        const accuracy = data.currentLocation?.accuracy || 'Unknown';
        
        console.log(`   ✅ Detected: ${detectedName}, ${detectedArea}`);
        console.log(`   📊 Source: ${source}, Accuracy: ${accuracy}`);
        
        // Check if it's incorrectly showing Defence Colony
        if (coord.shouldNOTBe && detectedName.includes(coord.shouldNOTBe)) {
          console.log(`   ❌ ERROR: Incorrectly detected as ${coord.shouldNOTBe}!`);
        } else if (coord.shouldBe && detectedName.includes(coord.shouldBe)) {
          console.log(`   ✅ CORRECT: Properly detected as ${coord.shouldBe}`);
        } else if (coord.shouldNOTBe) {
          console.log(`   ✅ GOOD: Not incorrectly detected as ${coord.shouldNOTBe}`);
        }
        
        // Check for generic GPS coordinates (better than wrong location)
        if (detectedName.includes('GPS Location')) {
          console.log(`   ℹ️  INFO: Using GPS coordinates (better than wrong location)`);
        }
        
      } else {
        console.log("   ❌ API Error:", response.status);
      }
    } catch (error) {
      console.log("   ❌ Network Error:", error.message);
    }
    console.log("");
  }
  
  console.log("🎯 KEY POINT: It's better to show 'GPS Location' than wrong location!");
  console.log("📍 Only specific, accurate locations should be shown by name.");
}

testRealUserLocation().catch(console.error);