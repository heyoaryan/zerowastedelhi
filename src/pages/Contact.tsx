import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Clock, Users, Award, Zap } from 'lucide-react';
import Footer from '../components/Footer';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // API integration or backend endpoint to handle form data goes here
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

 const stats = [
  { icon: Users, value: 'Community First', label: 'Designed for citizen engagement' },
  { icon: Award, value: 'Gamified Rewards', label: 'To boost eco-friendly actions' },
  { icon: Zap, value: 'Smart Bin Vision', label: 'Prototyping IoT-powered waste bins' },
  { icon: Clock, value: 'Scalable Future', label: 'Built to grow with the city' }
];




  const timeline = [
  {
    year: '2025',
    title: 'Prototype Development',
    description: 'Project initiated under IBM SkillsBuild as a prototype to promote sustainable waste management in Delhi.'
  },
  {
    year: '2025',
    title: 'Smart Bin Awareness Campaign',
    description: 'Initial community engagement and digital awareness campaign about the Zero Waste Delhi mission.'
  },
  {
    year: '2025',
    title: 'Gamification Introduced',
    description: 'Leaderboards and point-based reward systems added to motivate responsible waste disposal.'
  },
  {
    year: '2025',
    title: 'IoT Integration Begins',
    description: 'Pilot deployment of smart bins with real-time waste level tracking and overflow alerts.'
  },
  {
    year: '2025',
    title: 'Partnership Expansion',
    description: 'Collaboration with local municipalities, schools, and NGOs to scale impact and adoption.'
  },
  {
    year: '2026',
    title: 'AI & Data Insights',
    description: 'Integration of AI for waste pattern analysis, route optimization, and predictive maintenance.'
  },
  {
    year: '2026',
    title: 'Delhi-wide Rollout',
    description: 'Full-scale deployment of smart waste infrastructure across major zones in Delhi with citizen dashboard and analytics.'
  }
];


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-white mb-6"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-green-100 max-w-3xl mx-auto">
            <strong>This is a prototype developed under IBM SkillsBuild.</strong><br></br>
            We aim to transform waste management in Delhi through technology and community action.
            Want to report an issue or collaborate with us?<br></br>  
            We're here to help build a smarter, cleaner future together.
</motion.p>

        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Built for Tomorrow. Tested Today.
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl text-center hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-2xl bg-gradient-to-r from-green-500 to-blue-500">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
                <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {['name', 'email'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 capitalize">
                    {field}
                  </label>
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    required
                    value={formData[field as keyof typeof formData]}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                    placeholder={`Enter your ${field}`}
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                <select
                  required
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Choose subject</option>
                  <option value="bin-issue">Smart Bin Issue</option>
                  <option value="account">Account Support</option>
                  <option value="suggestion">Feature Suggestion</option>
                  <option value="partnership">Partnership Inquiry</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Type your message here..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-semibold flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
              >
                <Send className="w-5 h-5" />
                <span>Send Message</span>
              </motion.button>
            </form>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-10"
          >
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Contact Information
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                We're building a smart waste solution for Delhi. If supported by the right organizations, 
                we plan to expand to more Smart Bins and IoT tech in the near future.
              </p>
            </div>
            {[
              { icon: Mail, title: 'Email', value: 'support@zerowastedelhi.in' },
              { icon: Phone, title: 'Phone', value: '+91 11 4567 8900' },
              { icon: MapPin, title: 'Address', value: 'DTU Campus, Shahbad Daulatpur, Delhi 110042' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center rounded-xl">
                  <item.icon className="text-white w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h4>
                  <p className="text-gray-600 dark:text-gray-300">{item.value}</p>
                </div>
              </div>
            ))}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Office Hours</h3>
              <div className="space-y-1 text-gray-600 dark:text-gray-300 text-sm">
                <div className="flex justify-between"><span>Mon - Fri</span><span>9:00 AM - 6:00 PM</span></div>
                <div className="flex justify-between"><span>Saturday</span><span>10:00 AM - 4:00 PM</span></div>
                <div className="flex justify-between"><span>Sunday</span><span>Closed</span></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Visionary Roadmap</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto"></div>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-green-500 to-blue-500"></div>
            {timeline.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className={`relative flex items-center mb-12 ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                    <div className="text-green-600 text-2xl font-bold mb-2">{event.year}</div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{event.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{event.description}</p>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-full border-4 border-white dark:border-gray-900"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
