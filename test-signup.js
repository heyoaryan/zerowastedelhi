// Test signup functionality
const testSignup = async () => {
  try {
    const testUser = {
      name: 'New Test User',
      email: 'newuser@test.com',
      phone: '9876543210',
      password: 'password123'
    };

    console.log('Testing signup with:', testUser);
    
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    const data = await response.json();
    console.log('Response data:', data);
    
    if (response.ok) {
      console.log('✅ Signup successful!');
      console.log('User:', data.user.name);
      console.log('Email:', data.user.email);
      console.log('Token received:', data.token ? 'Yes' : 'No');
    } else {
      console.log('❌ Signup failed:', data.message);
      if (data.error) {
        console.log('Error details:', data.error);
      }
    }
  } catch (error) {
    console.error('❌ Network/Parse Error:', error.message);
  }
};

// Test with duplicate email
const testDuplicateEmail = async () => {
  try {
    const duplicateUser = {
      name: 'Duplicate User',
      email: 'test@zerowastedelhi.com', // This already exists
      phone: '9876543210',
      password: 'password123'
    };

    console.log('Testing signup with duplicate email:', duplicateUser.email);
    
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(duplicateUser),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('⚠️ This should not succeed with duplicate email!');
    } else {
      console.log('✅ Correctly rejected duplicate email:', data.message);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

console.log('Testing signup functionality...');
console.log('');

console.log('1. Testing new user signup:');
await testSignup();

console.log('');
console.log('2. Testing duplicate email:');
await testDuplicateEmail();