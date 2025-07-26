// Debug location detection issue
const API_BASE_URL = 'http://localhost:5000';

async function debugLocationIssue() {
  console.log('🔍 DEBUGGING LOCATION DETECTION ISSUE');
  console.log('='.repeat(60));

  // Test with your actual coordinates
  console.log('\n📍 Please provide your actual coordinates to test:');
  console.log('You can get them from: https://www.latlong.net/');
  console.log('Or use browser location in developer tools');
  
  // Test with common Delhi coordinates
  const testLocations = [
    { 
      name: 'Connaught Place Test',
      lat: 28.6315, 
      lng: 77.2167,
      description: 'Should show Connaught Place, Central Delhi'
    },
    { 
      name: 'India Gate Test',
      lat: 28.6129, 
      lng: 77.2295,
      description: 'Should show India Gate area'
    },
    { 
      name: 'Khan Market Test',
      lat: 28.5983, 
      lng: 77.2319,
      description: 'Should show Khan Market area'
    },
    { 
      name: 'Defence Colony Test',
      lat: 28.5729, 
      lng: 77.2294,
      description: 'Should show Defence Colony (if this is what you\'re seeing)'
    }
  ];

  for (const location of testLocations) {
    console.log(`\n🧪 ${location.name}`);
    console.log(`📍 Coordinates: ${location.lat}, ${location.lng}`);
    console.log(`📝 Expected: ${location.description}`);
    
    try {
      // Test the backend API
      const response = await fetch(
        `${API_BASE_URL}/api/location/info?latitude=${location.lat}&longitude=${location.lng}`
      );
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ API Response:`);
        console.log(`   Location: ${data.currentLocation?.name || 'Unknown'}`);
        console.log(`   Area: ${data.currentLocation?.area || 'Unknown'}`);
        console.log(`   Source: ${data.currentLocation?.source || 'Unknown'}`);
        console.log(`   Accuracy: ${data.currentLocation?.accuracy || 'Unknown'}`);
        console.log(`   Message: ${data.message}`);
        
        // Check if it's showing Defence Colony incorrectly
        if (data.currentLocation?.name === 'Defence Colony' && location.name !== 'Defence Colony Test') {
          console.log(`   ⚠️ WARNING: Showing Defence Colony for ${location.name}!`);
          console.log(`   🔍 This indicates a location detection problem`);
        }
      } else {
        console.log(`   ❌ API call failed: ${response.status}`);
      }
      
      // Test reverse geocoding directly
      console.log(`\n🌐 Testing reverse geocoding directly:`);
      
      try {
        const geocodingUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${location.lat}&longitude=${location.lng}&localityLanguage=en`;
        const geocodingResponse = await fetch(geocodingUrl);
        
        if (geocodingResponse.ok) {
          const geocodingData = await geocodingResponse.json();
          console.log(`   Locality: ${geocodingData.locality || 'N/A'}`);
          console.log(`   City: ${geocodingData.city || 'N/A'}`);
          console.log(`   Principal Subdivision: ${geocodingData.principalSubdivision || 'N/A'}`);
          
          if (geocodingData.locality === 'Defence Colony' && location.name !== 'Defence Colony Test') {
            console.log(`   ⚠️ Reverse geocoding also returns Defence Colony!`);
            console.log(`   🔍 This might be a geocoding service issue`);
          }
        } else {
          console.log(`   ❌ Reverse geocoding failed`);
        }
      } catch (geocodingError) {
        console.log(`   ❌ Reverse geocoding error: ${geocodingError.message}`);
      }
      
    } catch (error) {
      console.log(`   ❌ Test failed: ${error.message}`);
    }
    
    console.log('   ' + '-'.repeat(50));
  }

  // Test with user's browser location
  console.log('\n🌐 BROWSER LOCATION TEST:');
  console.log('To test with your actual location:');
  console.log('1. Open browser developer tools (F12)');
  console.log('2. Go to Console tab');
  console.log('3. Run: navigator.geolocation.getCurrentPosition(pos => console.log(pos.coords))');
  console.log('4. Use those coordinates to test manually');
  
  console.log('\n🔧 TROUBLESHOOTING STEPS:');
  console.log('If Defence Colony keeps showing for different locations:');
  console.log('1. Clear browser cache and cookies');
  console.log('2. Disable location caching in browser');
  console.log('3. Try incognito/private browsing mode');
  console.log('4. Check if VPN is affecting location');
  console.log('5. Test on different device/network');
  
  console.log('\n📋 MANUAL TEST:');
  console.log('Replace YOUR_LAT and YOUR_LNG with your actual coordinates:');
  console.log(`curl "${API_BASE_URL}/api/location/info?latitude=YOUR_LAT&longitude=YOUR_LNG"`);
}

debugLocationIssue().catch(console.error);