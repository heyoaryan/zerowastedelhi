// Test Authentication and Waste Submission
// Run this with: node test-auth-and-waste.js

const API_BASE_URL = 'http://localhost:5000';

async function testAuthAndWaste() {
  console.log('🧪 Testing Authentication and Waste Submission...\n');

  try {
    // Step 1: Test Login
    console.log('1. Testing Login...');
    const loginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'rahul@example.com',
        password: 'password123'
      })
    });

    if (!loginResponse.ok) {
      console.log('❌ Login failed:', loginResponse.status);
      const errorData = await loginResponse.json();
      console.log('Login error:', errorData);
      return;
    }

    const loginData = await loginResponse.json();
    console.log('✅ Login successful!');
    console.log('User:', loginData.user.name);
    console.log('Token length:', loginData.token.length);

    const token = loginData.token;

    // Step 2: Test Waste Submission
    console.log('\n2. Testing Waste Submission...');
    
    const wasteData = {
      binId: 'BIN001',
      wasteType: 'plastic',
      weight: 2.5,
      description: 'Test plastic waste',
      userLocation: {
        latitude: 28.6315,
        longitude: 77.2167,
        address: 'Connaught Place, New Delhi'
      }
    };

    console.log('Submitting waste data:', wasteData);

    const wasteResponse = await fetch(`${API_BASE_URL}/api/waste`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(wasteData)
    });

    console.log('Waste submission status:', wasteResponse.status);

    if (wasteResponse.ok) {
      const wasteResult = await wasteResponse.json();
      console.log('✅ Waste entry submitted successfully!');
      console.log('Entry ID:', wasteResult.wasteEntry._id);
      console.log('Points earned:', wasteResult.pointsEarned);
      console.log('Message:', wasteResult.message);
    } else {
      const wasteError = await wasteResponse.json();
      console.log('❌ Waste submission failed');
      console.log('Status:', wasteResponse.status);
      console.log('Error:', wasteError);
    }

    // Step 3: Verify Data in Database
    console.log('\n3. Checking User Stats...');
    const statsResponse = await fetch(`${API_BASE_URL}/api/waste/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      console.log('✅ User stats retrieved:');
      console.log('Total entries:', statsData.stats.overall.totalEntries);
      console.log('Total weight:', statsData.stats.overall.totalWeight, 'kg');
      console.log('Total points:', statsData.stats.overall.totalPoints);
    } else {
      console.log('❌ Failed to get user stats');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\nPossible issues:');
    console.log('- Backend not running on port 5001');
    console.log('- Database not connected');
    console.log('- Authentication service not working');
  }

  console.log('\n🏁 Test completed!');
}

testAuthAndWaste();