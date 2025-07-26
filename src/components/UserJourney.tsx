import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, BarChart3, QrCode, Scale, Trash2, Trophy } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const UserJourney: React.FC = () => {
  const { t } = useLanguage();

  const steps = [
    {
      icon: UserPlus,
      title: t('step1Title'),
      description: t('step1Description'),
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: BarChart3,
      title: t('step2Title'),
      description: t('step2Description'),
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: QrCode,
      title: t('step3Title'),
      description: t('step3Description'),
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      icon: Scale,
      title: t('step4Title'),
      description: t('step4Description'),
      color: 'from-orange-500 to-orange-600',
    },
    {
      icon: Trash2,
      title: t('step5Title'),
      description: t('step5Description'),
      color: 'from-red-500 to-red-600',
    },
    {
      icon: Trophy,
      title: t('step6Title'),
      description: t('step6Description'),
      color: 'from-green-500 to-green-600',
    },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('userJourneyTitle')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="relative bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute -top-6 left-8">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-12 h-12 bg-gradient-to-r ${step.color} rounded-xl flex items-center justify-center shadow-lg`}
                >
                  <step.icon className="w-6 h-6 text-white" />
                </motion.div>
              </div>
              
              <div className="pt-8">
                <div className="flex items-center mb-4">
                  <span className="text-2xl font-bold text-gray-300 dark:text-gray-600 mr-3">
                    0{index + 1}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {step.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connecting line for larger screens */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 -right-4 w-8 h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-600 dark:to-gray-700"></div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Mobile connecting lines */}
        <div className="lg:hidden mt-8 flex justify-center">
          <div className="flex flex-col space-y-4">
            {Array.from({ length: steps.length - 1 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (index + 1) * 0.1 }}
                className="w-0.5 h-8 bg-gradient-to-b from-green-500 to-blue-500 mx-auto"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserJourney;