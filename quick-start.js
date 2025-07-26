// Quick start script for Zero Waste Delhi
const { spawn, exec } = require('child_process');
const os = require('os');

console.log('🚀 ZERO WASTE DELHI - QUICK START');
console.log('='.repeat(40));

// Kill processes on ports
console.log('\n1. 🔄 Cleaning up ports...');

if (os.platform() === 'win32') {
  // Windows
  exec('for /f "tokens=5" %a in (\'netstat -aon ^| findstr :5000\') do taskkill /f /pid %a', (error) => {
    if (!error) console.log('   ✅ Cleaned port 5000');
  });
  
  exec('for /f "tokens=5" %a in (\'netstat -aon ^| findstr :5173\') do taskkill /f /pid %a', (error) => {
    if (!error) console.log('   ✅ Cleaned port 5173');
  });
} else {
  // Unix/Linux/Mac
  exec('lsof -ti:5000 | xargs kill -9', () => {});
  exec('lsof -ti:5173 | xargs kill -9', () => {});
}

setTimeout(() => {
  console.log('\n2. 🖥️ Starting backend server...');
  
  // Start backend
  const backend = spawn('npm', ['run', 'dev'], {
    cwd: './backend',
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, PORT: '5000' }
  });

  backend.on('error', (error) => {
    console.error('❌ Backend start error:', error.message);
  });

  // Wait a bit then start frontend
  setTimeout(() => {
    console.log('\n3. 🌐 Starting frontend server...');
    
    const frontend = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      shell: true
    });

    frontend.on('error', (error) => {
      console.error('❌ Frontend start error:', error.message);
    });

    // Test connection after a delay
    setTimeout(async () => {
      console.log('\n4. 🧪 Testing connection...');
      
      try {
        const response = await fetch('http://localhost:5000/api/health');
        if (response.ok) {
          console.log('   ✅ Backend is running on port 5000');
          
          // Test location
          const locationResponse = await fetch('http://localhost:5000/api/location/info?latitude=28.6315&longitude=77.2167');
          if (locationResponse.ok) {
            const locationData = await locationResponse.json();
            console.log('   ✅ Location detection working');
            console.log('   📍 Detected:', locationData.currentLocation?.name || 'Unknown');
          }
        }
      } catch (error) {
        console.log('   ❌ Backend not responding yet, give it more time');
      }

      console.log('\n🎉 Setup complete!');
      console.log('📱 Frontend: http://localhost:5173');
      console.log('🔧 Backend: http://localhost:5000');
      console.log('\n💡 If location is wrong, try:');
      console.log('   - Clear browser cache');
      console.log('   - Use incognito mode');
      console.log('   - Check location permissions');
      
    }, 10000);

  }, 5000);

}, 3000);