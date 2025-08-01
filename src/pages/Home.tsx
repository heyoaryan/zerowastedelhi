import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Leaf, Recycle, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import UserJourney from '../components/UserJourney';
import Footer from '../components/Footer';


const Home: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Recycle,
      title: 'Smart IoT Integration',
      description: 'Real-time waste tracking with IoT sensors and automated verification',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Award,
      title: 'Gamified Rewards',
      description: 'Earn points, badges, and rewards for contributing to a cleaner Delhi',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: Leaf,
      title: 'Environmental Impact',
      description: 'Track your positive impact on the environment and see real-time statistics',
      color: 'from-purple-500 to-pink-600'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6"
              >
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  {t('heroTitle')}
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl text-gray-600 dark:text-gray-300 mb-4"
              >
                {t('heroSubtitle')}
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-2xl"
              >
                {t('heroDescription')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
                  >
                    <span>{t('getStarted')}</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:border-green-500 dark:hover:border-green-400 transition-all duration-300 flex items-center space-x-2"
                >
                  <Play className="w-5 h-5" />
                  <span>{t('learnMore')}</span>
                </motion.button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="relative w-full h-96 lg:h-[500px]">
                <motion.div
                  animate={{ 
                    y: [0, -20, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-3xl shadow-2xl"
                ></motion.div>
                
                <div className="absolute inset-8 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center"
                    >
                      <Recycle className="w-16 h-16 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Smart Waste Tracking
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      IoT-powered bins with real-time monitoring
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Marquee for IBM SkillsBuild Prototype */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 py-2 overflow-hidden">
        <div className="whitespace-nowrap animate-marquee text-white font-semibold text-lg tracking-wide">
        🚀This is a prototype project developed for 🧠Aryan Singh Thakur. &nbsp; 
        🚀This is a prototype project developed for 🧠Aryan Singh Thakur. &nbsp;
        🚀This is a prototype project developed for 🧠Aryan Singh Thakur. &nbsp;
        🚀This is a prototype project developed for 🧠Aryan Singh Thakur. &nbsp;
        🚀This is a prototype project developed for 🧠Aryan Singh Thakur. &nbsp;
        </div>
      </div>


      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Zero Waste Delhi?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>
                
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* User Journey Section */}
      <UserJourney />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Make Delhi Cleaner?
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Join thousands of Delhi residents who are already making a difference. Start your zero waste journey today!
            </p>
            
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-white text-green-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
              >
                Join Zero Waste Delhi
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Home;