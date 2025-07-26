import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const QuickAuth: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { login, signup } = useAuth();

  const handleQuickLogin = async () => {
    if (!name || !email) {
      alert('Please enter name and email');
      return;
    }

    // Try login first, if fails, try signup
    const loginSuccess = await login(email, 'dummy-password');
    if (!loginSuccess) {
      const signupSuccess = await signup(name, email, '9876543210', 'dummy-password');
      if (signupSuccess) {
        alert('Account created and logged in!');
      } else {
        alert('Failed to create account');
      }
    } else {
      alert('Logged in successfully!');
    }
  };

  const handleSkipAuth = () => {
    // Create a temporary user for testing
    const tempUser = {
      id: Date.now().toString(),
      name: name || 'Test User',
      email: email || 'test@example.com',
      phone: '+91 98765 43210',
      avatar: '👤',
      totalWaste: 0,
      rewardPoints: 0,
      joinedDate: new Date().toISOString().split('T')[0]
    };

    localStorage.setItem('user', JSON.stringify(tempUser));
    localStorage.setItem('sessionId', Date.now().toString());
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Quick Access
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Enter your details to get started
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter your email"
            />
          </div>

          <button
            onClick={handleQuickLogin}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Quick Login/Signup
          </button>

          <div className="text-center">
            <span className="text-gray-500">or</span>
          </div>

          <button
            onClick={handleSkipAuth}
            className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Skip Authentication (Test Mode)
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This is a simplified authentication for testing purposes
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuickAuth;