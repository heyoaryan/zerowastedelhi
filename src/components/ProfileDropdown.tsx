import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Settings, Award, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfileDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const avatars = ['👨‍💻', '👩‍💼', '👨‍⚕️', '👩‍🎓', '👨‍🎨', '👩‍🏫', '👨‍🔬', '👩‍⚖️', '👤', '🧑‍💼', '👨‍🌾', '👩‍🍳'];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowAvatarPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const handleAvatarChange = (newAvatar: string) => {
    updateProfile({ avatar: newAvatar });
    setShowAvatarPicker(false);
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
          {user.avatar}
        </div>
        <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
          {user.name.split(' ')[0]}
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 z-50"
          >
            {/* Profile Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                  className="relative w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl hover:shadow-lg transition-shadow"
                >
                  {user.avatar}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <Settings className="w-3 h-3 text-white" />
                  </div>
                </motion.button>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                    {user.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {user.email}
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1">
                      <Trash2 className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-green-600">
                        {user.totalWaste} kg
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Award className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium text-blue-600">
                        {user.rewardPoints} pts
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Avatar Picker */}
              <AnimatePresence>
                {showAvatarPicker && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                  >
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Choose Avatar:
                    </p>
                    <div className="grid grid-cols-6 gap-2">
                      {avatars.map((avatar, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleAvatarChange(avatar)}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-colors ${
                            user.avatar === avatar
                              ? 'bg-green-100 dark:bg-green-900 ring-2 ring-green-500'
                              : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {avatar}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <motion.button
                whileHover={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
                onClick={() => {
                  navigate('/profile');
                  setIsOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-xl transition-colors text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400"
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Profile Settings</span>
              </motion.button>

              <motion.button
                whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-xl transition-colors text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;