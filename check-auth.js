// Quick Authentication Check
// Open browser console and run this to check auth status

console.log('=== Authentication Status ===');
console.log('Token exists:', !!localStorage.getItem('token'));
console.log('User exists:', !!localStorage.getItem('user'));

const token = localStorage.getItem('token');
const user = localStorage.getItem('user');

if (token) {
  console.log('Token length:', token.length);
  console.log('Token starts with:', token.substring(0, 20) + '...');
  
  // Try to decode JWT payload (just for debugging)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('Token payload:', payload);
    console.log('Token expires:', new Date(payload.exp * 1000));
    console.log('Token expired:', Date.now() > payload.exp * 1000);
  } catch (e) {
    console.log('Could not decode token:', e.message);
  }
} else {
  console.log('❌ No token found - user needs to login');
}

if (user) {
  console.log('User data:', JSON.parse(user));
} else {
  console.log('❌ No user data found');
}

// Test API call
if (token) {
  console.log('\n=== Testing API Call ===');
  fetch('http://localhost:5001/api/waste/stats', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log('API Response status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('API Response:', data);
  })
  .catch(error => {
    console.error('API Error:', error);
  });
}