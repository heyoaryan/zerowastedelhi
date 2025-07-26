import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Moon, Sun, Globe, Plus } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import ProfileDropdown from './ProfileDropdown';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAppearance, setShowAppearance] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);

  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const publicNavigation = [
    { name: t('home'), href: '/' },
    { name: t('contact'), href: '/contact' },
  ];

  const privateNavigation = [
    { name: t('dashboard'), href: '/dashboard' },
    { name: t('binTracker'), href: '/bin-tracker' },
    { name: t('leaderboard'), href: '/leaderboard' },
  ];

  const navigation = isAuthenticated ? privateNavigation : publicNavigation;

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md z-50 border-b border-gray-200 dark:border-gray-700"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <motion.img
              whileHover={{ scale: 1.05 }}
              src="/src/assets/logo.png"
              alt="Zero Waste Delhi Logo"
              className="w-10 h-10 rounded-full object-cover shadow-md"
            />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {t('heroTitle')}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400'
                }`}
              >
                {item.name}
                {isActive(item.href) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 dark:bg-green-400"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Controls (Theme & Language Only on Desktop) */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleLanguage}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center space-x-1"
              >
                <Globe className="w-5 h-5" />
                <span className="text-lg">{language === 'en' ? '🇬🇧' : '🇮🇳'}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </motion.button>
            </div>

            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/add-waste">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-medium">Add Waste</span>
                  </motion.button>
                </Link>
                <ProfileDropdown />
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {t('signup')}
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 dark:border-gray-700"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                    isActive(item.href)
                      ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
                      : 'text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {/* Appearance Toggle */}
              <div className="mt-2">
                <button
                  onClick={() => setShowAppearance(!showAppearance)}
                  className="w-full text-left px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                >
                  Appearance
                </button>
                {showAppearance && (
                  <div className="pl-4 pt-1 space-y-1">
                    <button
                      onClick={() => {
                        toggleTheme();
                        setIsOpen(false);
                      }}
                      className="block w-full text-left text-sm px-2 py-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                    </button>
                  </div>
                )}
              </div>

              {/* Language Toggle */}
              <div>
                <button
                  onClick={() => setShowLanguage(!showLanguage)}
                  className="w-full text-left px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                >
                  Language
                </button>
                {showLanguage && (
                  <div className="pl-4 pt-1 space-y-1">
                    <button
                      onClick={() => {
                        toggleLanguage();
                        setIsOpen(false);
                      }}
                      className="block w-full text-left text-sm px-2 py-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      {language === 'en' ? 'हिन्दी' : 'English'}
                    </button>
                  </div>
                )}
              </div>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/add-waste"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 text-base font-medium bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors mt-2"
                  >
                    Add Waste
                  </Link>
                  <div className="px-3 py-2 text-base text-gray-700 dark:text-gray-300">
                    <ProfileDropdown mobile />
                  </div>
                </>
              ) : (
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                  >
                    {t('login')}
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 text-base font-medium bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors mt-2"
                  >
                    {t('signup')}
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
