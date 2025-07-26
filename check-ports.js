// Check if ports are properly configured and running
const { exec } = require('child_process');

async function checkPorts() {
  console.log('🔍 CHECKING PORT CONFIGURATION');
  console.log('='.repeat(50));

  // Check if port 5000 is in use
  console.log('\n1. 🔌 Checking port 5000 status...');
  
  exec('netstat -an | findstr :5000', (error, stdout, stderr) => {
    if (stdout) {
      console.log('   ✅ Port 5000 is in use:');
      console.log('   ' + stdout.trim());
    } else {
      console.log('   ❌ Port 5000 is not in use');
      console.log('   🔧 Backend server is not running');
    }
  });

  // Check if port 5173 (Vite default) is in use
  console.log('\n2. 🌐 Checking frontend port...');
  
  exec('netstat -an | findstr :5173', (error, stdout, stderr) => {
    if (stdout) {
      console.log('   ✅ Port 5173 is in use (Vite frontend):');
      console.log('   ' + stdout.trim());
    } else {
      console.log('   ❌ Port 5173 is not in use');
      console.log('   🔧 Frontend server is not running');
    }
  });

  // Test backend health endpoint
  console.log('\n3. 🏥 Testing backend health endpoint...');
  
  setTimeout(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/health');
      if (response.ok) {
        const data = await response.json();
        console.log('   ✅ Backend health check passed');
        console.log('   📊 Response:', data.message);
      } else {
        console.log('   ❌ Backend health check failed');
        console.log('   📊 Status:', response.status);
      }
    } catch (error) {
      console.log('   ❌ Cannot connect to backend on port 5000');
      console.log('   🔧 Make sure backend is running: cd backend && npm run dev');
    }

    // Test location endpoint
    console.log('\n4. 📍 Testing location detection endpoint...');
    
    try {
      const locationResponse = await fetch('http://localhost:5000/api/location/info?latitude=28.6315&longitude=77.2167');
      if (locationResponse.ok) {
        const locationData = await locationResponse.json();
        console.log('   ✅ Location detection working');
        console.log('   📍 Detected:', locationData.currentLocation?.name || 'Unknown');
        console.log('   🗑️ Nearby bins:', locationData.allNearbyBins?.length || 0);
      } else {
        console.log('   ❌ Location detection failed');
        console.log('   📊 Status:', locationResponse.status);
      }
    } catch (error) {
      console.log('   ❌ Location endpoint not accessible');
      console.log('   🔧 Backend may not be running properly');
    }

    // Test simple waste endpoint
    console.log('\n5. 🗑️ Testing simple waste endpoint...');
    
    try {
      const wasteResponse = await fetch('http://localhost:5000/api/simple-waste/health');
      if (wasteResponse.ok) {
        const wasteData = await wasteResponse.json();
        console.log('   ✅ Simple waste system working');
        console.log('   📊 Response:', wasteData.message);
      } else {
        console.log('   ❌ Simple waste system failed');
        console.log('   📊 Status:', wasteResponse.status);
      }
    } catch (error) {
      console.log('   ❌ Simple waste endpoint not accessible');
      console.log('   🔧 Backend routes may not be configured properly');
    }

    console.log('\n' + '='.repeat(50));
    console.log('📋 PORT CONFIGURATION SUMMARY:');
    console.log('   Backend should run on: http://localhost:5000');
    console.log('   Frontend should run on: http://localhost:5173');
    console.log('   Location API: http://localhost:5000/api/location/info');
    console.log('   Simple Waste API: http://localhost:5000/api/simple-waste');
    console.log('\n🔧 If any tests failed:');
    console.log('   1. Stop all servers (Ctrl+C)');
    console.log('   2. Start backend: cd backend && npm run dev');
    console.log('   3. Start frontend: npm run dev');
    console.log('   4. Run this test again: node check-ports.js');
  }, 2000);
}

checkPorts().catch(console.error);