// Test Authentication Status
// Run this in browser console to check auth status

console.log('=== Authentication Status Check ===');

// Check localStorage
const token = localStorage.getItem('token');
const user = localStorage.getItem('user');

console.log('Token exists:', !!token);
console.log('User exists:', !!user);

if (token) {
  console.log('Token length:', token.length);
  console.log('Token preview:', token.substring(0, 50) + '...');
  
  // Try to decode JWT payload
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('Token payload:', payload);
    console.log('Token expires:', new Date(payload.exp * 1000));
    console.log('Token expired:', Date.now() > payload.exp * 1000);
  } catch (e) {
    console.log('Could not decode token');
  }
} else {
  console.log('❌ No token found - user needs to login');
}

if (user) {
  const userData = JSON.parse(user);
  console.log('User data:', userData);
} else {
  console.log('❌ No user data found');
}

// Test API call with current token
if (token) {
  console.log('\n=== Testing API Call ===');
  fetch('http://localhost:5000/api/waste/stats', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log('API Response status:', response.status);
    if (response.status === 401) {
      console.log('❌ Token is invalid or expired');
    } else if (response.ok) {
      console.log('✅ Token is valid');
      return response.json();
    }
  })
  .then(data => {
    if (data) {
      console.log('API Response:', data);
    }
  })
  .catch(error => {
    console.error('API Error:', error);
  });
}