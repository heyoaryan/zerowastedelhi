import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 text-gray-700 dark:text-gray-300 py-12 px-6 mt-10 border-t border-gray-200 dark:border-gray-700"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
        
        {/* Branding */}
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Zero Waste Delhi
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col space-y-2">
          <Link to="/" className="hover:text-green-600 dark:hover:text-green-400 transition">Home</Link>
          <Link to="/contact" className="hover:text-green-600 dark:hover:text-green-400 transition">Contact</Link>
          <a href="mailto:info@zerowastedelhi.org" className="hover:text-green-600 dark:hover:text-green-400 transition">Email Us</a>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center md:justify-end space-x-5">
          {[{
            icon: <Facebook className="w-5 h-5" />,
            href: "#",
            color: "hover:text-blue-600"
          }, {
            icon: <Twitter className="w-5 h-5" />,
            href: "#",
            color: "hover:text-sky-400"
          }, {
            icon: <Instagram className="w-5 h-5" />,
            href: "#",
            color: "hover:text-pink-500"
          }, {
            icon: <Mail className="w-5 h-5" />,
            href: "mailto:info@zerowastedelhi.org",
            color: "hover:text-green-500"
          }].map((item, index) => (
            <motion.a
              key={index}
              href={item.href}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.95 }}
              className={`transition ${item.color}`}
            >
              {item.icon}
            </motion.a>
          ))}
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
