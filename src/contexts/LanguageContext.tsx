import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    home: 'Home',
    dashboard: 'Dashboard',
    binTracker: 'Bin Tracker',
    leaderboard: 'Leaderboard',
    contact: 'Contact',
    login: 'Login',
    signup: 'Sign Up',
    
    // Homepage
    heroTitle: 'Zero Waste Delhi',
    heroSubtitle: 'Smart Waste Management with IoT & Gamification',
    heroDescription: 'Track your waste, earn rewards, and make Delhi cleaner with our smart bin technology',
    getStarted: 'Get Started',
    learnMore: 'Learn More',
    
    // User Journey
    userJourneyTitle: 'How It Works - Your Journey to Zero Waste',
    step1Title: 'Sign Up or Login',
    step1Description: 'Create your account to start your eco-friendly journey',
    step2Title: 'Access Your Dashboard',
    step2Description: 'View your progress, rewards, and waste contribution stats',
    step3Title: 'Scan Smart Bin QR',
    step3Description: 'Find a nearby smart bin and scan its QR code',
    step4Title: 'Enter Waste Details',
    step4Description: 'Input weight and type of waste you\'re disposing',
    step5Title: 'Drop Waste into Bin',
    step5Description: 'IoT sensors automatically verify your input',
    step6Title: 'Earn Rewards',
    step6Description: 'Get points and badges for contributing to a cleaner Delhi',
    
    // Dashboard
    totalWaste: 'Total Waste Contributed',
    weeklyContribution: 'This Week',
    rewardPoints: 'Reward Points',
    achievements: 'Achievements',
    recentActivity: 'Recent Activity',
    
    // Common
    loading: 'Loading...',
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    close: 'Close'
  },
  hi: {
    // Navigation
    home: 'होम',
    dashboard: 'डैशबोर्ड',
    binTracker: 'बिन ट्रैकर',
    leaderboard: 'लीडरबोर्ड',
    contact: 'संपर्क',
    login: 'लॉग इन',
    signup: 'साइन अप',
    
    // Homepage
    heroTitle: 'जीरो वेस्ट दिल्ली',
    heroSubtitle: 'IoT और गेमिफिकेशन के साथ स्मार्ट वेस्ट मैनेजमेंट',
    heroDescription: 'अपने कचरे को ट्रैक करें, रिवार्ड कमाएं, और हमारी स्मार्ट बिन तकनीक से दिल्ली को साफ बनाएं',
    getStarted: 'शुरू करें',
    learnMore: 'और जानें',
    
    // User Journey
    userJourneyTitle: 'यह कैसे काम करता है - जीरो वेस्ट की आपकी यात्रा',
    step1Title: 'साइन अप या लॉग इन करें',
    step1Description: 'अपनी पर्यावरण-अनुकूल यात्रा शुरू करने के लिए खाता बनाएं',
    step2Title: 'अपना डैशबोर्ड एक्सेस करें',
    step2Description: 'अपनी प्रगति, रिवार्ड और वेस्ट कंट्रिब्यूशन स्टेट्स देखें',
    step3Title: 'स्मार्ट बिन QR स्कैन करें',
    step3Description: 'पास का स्मार्ट बिन खोजें और उसका QR कोड स्कैन करें',
    step4Title: 'वेस्ट विवरण दर्ज करें',
    step4Description: 'कचरे का वजन और प्रकार इनपुट करें जिसे आप फेंक रहे हैं',
    step5Title: 'बिन में कचरा डालें',
    step5Description: 'IoT सेंसर आपके इनपुट को स्वचालित रूप से सत्यापित करते हैं',
    step6Title: 'रिवार्ड कमाएं',
    step6Description: 'दिल्ली को साफ बनाने में योगदान के लिए पॉइंट्स और बैज पाएं',
    
    // Dashboard
    totalWaste: 'कुल योगदान किया गया कचरा',
    weeklyContribution: 'इस सप्ताह',
    rewardPoints: 'रिवार्ड पॉइंट्स',
    achievements: 'उपलब्धियां',
    recentActivity: 'हाल की गतिविधि',
    
    // Common
    loading: 'लोड हो रहा है...',
    submit: 'जमा करें',
    cancel: 'रद्द करें',
    save: 'सेव करें',
    delete: 'डिलीट करें',
    edit: 'एडिट करें',
    view: 'देखें',
    close: 'बंद करें'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};