// Immediate location fix script
const API_BASE_URL = 'http://localhost:5000';

async function fixLocationNow() {
  console.log('🔧 IMMEDIATE LOCATION FIX');
  console.log('='.repeat(50));

  // Step 1: Test if backend is running
  console.log('\n1. 🏥 Checking backend status...');
  try {
    const healthResponse = await fetch(`${API_BASE_URL}/api/health`);
    if (healthResponse.ok) {
      console.log('   ✅ Backend is running');
    } else {
      console.log('   ❌ Backend health check failed');
      console.log('   🔧 Fix: cd backend && npm run dev');
      return;
    }
  } catch (error) {
    console.log('   ❌ Backend is not running');
    console.log('   🔧 Fix: cd backend && npm run dev');
    return;
  }

  // Step 2: Test current location detection
  console.log('\n2. 📍 Testing current location detection...');
  
  const testCoords = [
    { lat: 28.6315, lng: 77.2167, expected: 'Connaught Place' },
    { lat: 28.6129, lng: 77.2295, expected: 'India Gate' },
    { lat: 28.5983, lng: 77.2319, expected: 'Khan Market' }
  ];

  let allShowingDefenceColony = true;
  
  for (const coord of testCoords) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/location/info?latitude=${coord.lat}&longitude=${coord.lng}`
      );
      
      if (response.ok) {
        const data = await response.json();
        const detectedName = data.currentLocation?.name || 'Unknown';
        
        console.log(`   📍 ${coord.lat}, ${coord.lng} → ${detectedName}`);
        
        if (detectedName !== 'Defence Colony') {
          allShowingDefenceColony = false;
        }
        
        if (detectedName === 'Defence Colony' && coord.expected !== 'Defence Colony') {
          console.log(`   ⚠️ ISSUE: Expected ${coord.expected}, got Defence Colony`);
        }
      }
    } catch (error) {
      console.log(`   ❌ Test failed for ${coord.lat}, ${coord.lng}`);
    }
  }

  // Step 3: Diagnose the issue
  console.log('\n3. 🔍 Diagnosing the issue...');
  
  if (allShowingDefenceColony) {
    console.log('   🚨 PROBLEM IDENTIFIED: All locations showing Defence Colony');
    console.log('   🔍 Possible causes:');
    console.log('      - Cached location data');
    console.log('      - Geocoding service returning wrong data');
    console.log('      - Browser location permissions');
    console.log('      - VPN or network issues');
  }

  // Step 4: Test reverse geocoding directly
  console.log('\n4. 🌐 Testing reverse geocoding directly...');
  
  try {
    const testLat = 28.6315;
    const testLng = 77.2167;
    const geocodingUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${testLat}&longitude=${testLng}&localityLanguage=en&timestamp=${Date.now()}`;
    
    const response = await fetch(geocodingUrl);
    if (response.ok) {
      const data = await response.json();
      console.log('   📍 Direct geocoding result:');
      console.log(`      Locality: ${data.locality || 'N/A'}`);
      console.log(`      City: ${data.city || 'N/A'}`);
      console.log(`      Principal Subdivision: ${data.principalSubdivision || 'N/A'}`);
      
      if (data.locality === 'Defence Colony') {
        console.log('   🚨 ISSUE: Geocoding service returning Defence Colony for Connaught Place!');
        console.log('   🔧 This is a geocoding service issue, not our code');
      } else {
        console.log('   ✅ Geocoding service working correctly');
      }
    }
  } catch (error) {
    console.log('   ❌ Direct geocoding test failed');
  }

  // Step 5: Test with new real-time detection
  console.log('\n5. 🔄 Testing new real-time detection...');
  
  try {
    const testResponse = await fetch(`${API_BASE_URL}/api/test-location/test/28.6315/77.2167`);
    if (testResponse.ok) {
      const testData = await testResponse.json();
      console.log('   📍 New detection result:');
      console.log(`      Name: ${testData.detectedLocation?.name || 'N/A'}`);
      console.log(`      Area: ${testData.detectedLocation?.area || 'N/A'}`);
      console.log(`      Source: ${testData.detectedLocation?.source || 'N/A'}`);
      console.log(`      Accuracy: ${testData.detectedLocation?.accuracy || 'N/A'}`);
    }
  } catch (error) {
    console.log('   ❌ New detection test failed - make sure backend is restarted');
  }

  // Step 6: Provide immediate solutions
  console.log('\n6. 🛠️ IMMEDIATE SOLUTIONS:');
  console.log('');
  
  console.log('   A. RESTART BACKEND WITH NEW CODE:');
  console.log('      1. Stop current backend (Ctrl+C)');
  console.log('      2. cd backend && npm run dev');
  console.log('      3. Test again');
  console.log('');
  
  console.log('   B. CLEAR BROWSER CACHE:');
  console.log('      1. Open browser settings');
  console.log('      2. Clear browsing data');
  console.log('      3. Include cached images and files');
  console.log('      4. Restart browser');
  console.log('');
  
  console.log('   C. TEST IN INCOGNITO MODE:');
  console.log('      1. Open incognito/private window');
  console.log('      2. Go to your app');
  console.log('      3. Test location detection');
  console.log('');
  
  console.log('   D. FORCE LOCATION FOR TESTING:');
  console.log('      Run this in browser console:');
  console.log('      localStorage.setItem("forcedLocation", JSON.stringify({');
  console.log('        name: "Your Actual Location",');
  console.log('        area: "Your Area"');
  console.log('      }));');
  console.log('');
  
  console.log('   E. CHECK NETWORK/VPN:');
  console.log('      1. Disable VPN if using one');
  console.log('      2. Try different network');
  console.log('      3. Check if ISP is affecting location');

  console.log('\n🎯 MOST LIKELY FIX:');
  console.log('Restart backend server with the new real-time location code!');
}

fixLocationNow().catch(console.error);