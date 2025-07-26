// Test signup with proper password
const testProperSignup = async () => {
  try {
    const testUser = {
      name: 'New Test User',
      email: 'newuser2@test.com',
      phone: '9876543210',
      password: 'Password123' // Proper format: uppercase, lowercase, number
    };

    console.log('Testing signup with proper password:', testUser);
    
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);
    
    if (response.ok) {
      console.log('✅ Signup successful!');
      console.log('User:', data.user.name);
      console.log('Email:', data.user.email);
      console.log('Token received:', data.token ? 'Yes' : 'No');
    } else {
      console.log('❌ Signup failed:', data.message);
      if (data.errors) {
        console.log('Validation errors:');
        data.errors.forEach(error => {
          console.log(`- ${error.path}: ${error.msg}`);
        });
      }
    }
  } catch (error) {
    console.error('❌ Network/Parse Error:', error.message);
  }
};

console.log('Testing signup with proper password format...');
await testProperSignup();