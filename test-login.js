// Test login functionality
const testLogin = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@zerowastedelhi.com',
        password: 'password123'
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Login successful!');
      console.log('User:', data.user.name);
      console.log('Email:', data.user.email);
      console.log('Token received:', data.token ? 'Yes' : 'No');
    } else {
      console.log('❌ Login failed:', data.message);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

// Test with wrong password
const testWrongPassword = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@zerowastedelhi.com',
        password: 'wrongpassword'
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('⚠️ This should not succeed with wrong password!');
    } else {
      console.log('✅ Correctly rejected wrong password:', data.message);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

console.log('Testing authentication...');
console.log('');

console.log('1. Testing correct credentials:');
await testLogin();

console.log('');
console.log('2. Testing wrong password:');
await testWrongPassword();