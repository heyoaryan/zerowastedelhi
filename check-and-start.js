const { spawn } = require('child_process');
const fetch = require('node-fetch');

async function checkMongoDB() {
  console.log('🔍 Checking MongoDB...');
  try {
    const { MongoClient } = require('mongodb');
    const client = new MongoClient('mongodb://localhost:27017');
    await client.connect();
    await client.close();
    console.log('✅ MongoDB is running');
    return true;
  } catch (error) {
    console.log('❌ MongoDB is not running. Please start MongoDB first.');
    console.log('   Windows: Start MongoDB service');
    console.log('   Mac: brew services start mongodb/brew/mongodb-community');
    console.log('   Linux: sudo systemctl start mongod');
    return false;
  }
}

async function checkBackend() {
  console.log('🔍 Checking Backend Server...');
  try {
    const response = await fetch('http://localhost:5000/api/health');
    if (response.ok) {
      console.log('✅ Backend server is running');
      return true;
    }
  } catch (error) {
    console.log('❌ Backend server is not running');
    return false;
  }
  return false;
}

async function startBackend() {
  console.log('🚀 Starting Backend Server...');
  return new Promise((resolve) => {
    const backend = spawn('npm', ['run', 'dev'], {
      cwd: './backend',
      stdio: 'inherit',
      shell: true
    });

    // Give it time to start
    setTimeout(async () => {
      const isRunning = await checkBackend();
      resolve(isRunning);
    }, 5000);
  });
}

async function main() {
  console.log('🧪 Zero Waste Delhi - System Check & Start\n');

  // Check MongoDB
  const mongoRunning = await checkMongoDB();
  if (!mongoRunning) {
    console.log('\n❌ Please start MongoDB first, then run this script again.');
    process.exit(1);
  }

  // Check Backend
  const backendRunning = await checkBackend();
  if (!backendRunning) {
    console.log('🚀 Starting backend server...');
    const started = await startBackend();
    if (!started) {
      console.log('❌ Failed to start backend server');
      process.exit(1);
    }
  }

  console.log('\n✅ All systems ready!');
  console.log('📋 Next steps:');
  console.log('1. Open new terminal and run: npm run dev');
  console.log('2. Open browser to: http://localhost:5173');
  console.log('3. Test login and waste entry features');
  console.log('\n🔗 Useful URLs:');
  console.log('   Backend Health: http://localhost:5000/api/health');
  console.log('   Frontend: http://localhost:5173');
}

main().catch(console.error);