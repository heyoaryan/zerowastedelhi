// Quick test for simple waste system
const API_BASE_URL = 'http://localhost:5000';

async function quickTest() {
  console.log('🧪 Quick Simple Waste System Test');
  console.log('='.repeat(40));

  // Test 1: Health check
  try {
    const response = await fetch(`${API_BASE_URL}/api/simple-waste/health`);
    if (response.ok) {
      console.log('✅ Simple waste system is running');
    } else {
      console.log('❌ Simple waste system not responding');
      console.log('🔧 Make sure backend is running: cd backend && npm run dev');
      return;
    }
  } catch (error) {
    console.log('❌ Cannot connect to backend');
    console.log('🔧 Start backend: cd backend && npm run dev');
    return;
  }

  // Test 2: Quick waste entry
  const testEntry = {
    userName: 'Test User',
    userEmail: 'test@example.com',
    wasteType: 'plastic',
    weight: 1.5,
    description: 'Quick test entry',
    userLocation: {
      latitude: 28.6315,
      longitude: 77.2167,
      address: 'Test Location'
    },
    sessionId: Date.now().toString()
  };

  try {
    const response = await fetch(`${API_BASE_URL}/api/simple-waste/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testEntry)
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Waste entry works!');
      console.log('🎯 Points:', data.data.pointsEarned);
      console.log('📍 Location:', data.data.location.detected);
      console.log('💾 Saved:', data.success);
    } else {
      console.log('❌ Waste entry failed');
      const error = await response.json();
      console.log('Error:', error.message);
    }
  } catch (error) {
    console.log('❌ Waste entry error:', error.message);
  }

  console.log('\n🎉 If both tests passed, your system is ready!');
  console.log('🌐 Open: http://localhost:5173');
  console.log('📝 Go to Add Waste page and test');
}

quickTest().catch(console.error);