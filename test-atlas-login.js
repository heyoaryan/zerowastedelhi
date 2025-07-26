// Test login with Atlas database
const testAtlasLogin = async () => {
  try {
    console.log('🔐 Testing login with Atlas database...');
    
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@zerowastedelhi.com',
        password: 'Password123'  // Correct password
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Atlas login successful!');
      console.log('User:', data.user.name);
      console.log('Email:', data.user.email);
      console.log('Token received:', data.token ? 'Yes' : 'No');
      console.log('');
      console.log('🎉 Your backend is successfully using MongoDB Atlas!');
    } else {
      console.log('❌ Login failed:', data.message);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

await testAtlasLogin();