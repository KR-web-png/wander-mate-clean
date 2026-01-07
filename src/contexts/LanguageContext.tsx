import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'si' | 'ta';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.discover': 'Discover',
    'nav.trips': 'Trips',
    'nav.matches': 'Matches',
    'nav.community': 'Community',
    'nav.profile': 'Profile',
    
    // Profile
    'profile.title': 'Profile',
    'profile.editProfile': 'Edit Profile',
    'profile.myInterests': 'My Interests',
    'profile.languages': 'Languages',
    'profile.safetyPrivacy': 'Safety & Privacy',
    'profile.logout': 'Log Out',
    'profile.verified': 'Verified',
    'profile.idVerified': 'ID Verified',
    'profile.joined': 'Joined',
    'profile.trips': 'Trips',
    'profile.rating': 'Rating',
    'profile.travelStyle': 'Travel Style',
    'profile.interests': 'Interests',
    
    // Languages
    'languages.title': 'Select Language',
    'languages.subtitle': 'Choose your preferred language',
    'languages.english': 'English',
    'languages.sinhala': 'Sinhala',
    'languages.tamil': 'Tamil',
    'languages.current': 'Current Language',
    
    // Auth
    'auth.welcomeBack': 'Welcome Back',
    'auth.signInSubtitle': 'Sign in to continue your journey and connect with fellow travelers',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.signIn': 'Sign In',
    'auth.forgotPassword': 'Forgot password?',
    'auth.orContinueWith': 'Or continue with',
    'auth.google': 'Google',
    'auth.facebook': 'Facebook',
    'auth.noAccount': "Don't have an account?",
    'auth.signUp': 'Sign up',
    
    // Common
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.done': 'Done',
    'common.search': 'Search',
  },
  si: {
    // Navigation
    'nav.home': 'මුල් පිටුව',
    'nav.discover': 'සොයන්න',
    'nav.trips': 'ගමන්',
    'nav.matches': 'ගැලපීම්',
    'nav.community': 'ප්‍රජාව',
    'nav.profile': 'පැතිකඩ',
    
    // Profile
    'profile.title': 'පැතිකඩ',
    'profile.editProfile': 'පැතිකඩ සංස්කරණය කරන්න',
    'profile.myInterests': 'මගේ උනන්දුව',
    'profile.languages': 'භාෂා',
    'profile.safetyPrivacy': 'ආරක්ෂාව සහ රහස්‍යතාව',
    'profile.logout': 'ඉවත් වන්න',
    'profile.verified': 'සත්‍යාපිත',
    'profile.idVerified': 'හැඳුනුම්පත සත්‍යාපිත',
    'profile.joined': 'සම්බන්ධ වූ',
    'profile.trips': 'ගමන්',
    'profile.rating': 'ශ්‍රේණිගත කිරීම',
    'profile.travelStyle': 'සංචාරක විලාසය',
    'profile.interests': 'උනන්දුව',
    
    // Languages
    'languages.title': 'භාෂාව තෝරන්න',
    'languages.subtitle': 'ඔබගේ කැමති භාෂාව තෝරන්න',
    'languages.english': 'ඉංග්‍රීසි',
    'languages.sinhala': 'සිංහල',
    'languages.tamil': 'දෙමළ',
    'languages.current': 'වත්මන් භාෂාව',
    
    // Auth
    'auth.welcomeBack': 'නැවත පැමිණීම සාදරයෙන් පිළිගනිමු',
    'auth.signInSubtitle': 'ඔබේ ගමන දිගටම කරගෙන යාමට සහ සෙසු සංචාරකයින් සමඟ සම්බන්ධ වීමට පුරන්න',
    'auth.email': 'විද්‍යුත් තැපෑල',
    'auth.password': 'මුරපදය',
    'auth.signIn': 'පුරන්න',
    'auth.forgotPassword': 'මුරපදය අමතකද?',
    'auth.orContinueWith': 'නැතහොත් මේවා සමඟ ඉදිරියට යන්න',
    'auth.google': 'ගූගල්',
    'auth.facebook': 'ෆේස්බුක්',
    'auth.noAccount': 'ගිණුමක් නැද්ද?',
    'auth.signUp': 'ලියාපදිංචි වන්න',
    
    // Common
    'common.loading': 'පූරණය වෙමින්...',
    'common.save': 'සුරකින්න',
    'common.cancel': 'අවලංගු කරන්න',
    'common.delete': 'මකන්න',
    'common.edit': 'සංස්කරණය',
    'common.done': 'අවසන්',
    'common.search': 'සොයන්න',
  },
  ta: {
    // Navigation
    'nav.home': 'முகப்பு',
    'nav.discover': 'கண்டுபிடி',
    'nav.trips': 'பயணங்கள்',
    'nav.matches': 'பொருத்தங்கள்',
    'nav.community': 'சமூகம்',
    'nav.profile': 'சுயவிவரம்',
    
    // Profile
    'profile.title': 'சுயவிவரம்',
    'profile.editProfile': 'சுயவிவரத்தைத் திருத்து',
    'profile.myInterests': 'எனது ஆர்வங்கள்',
    'profile.languages': 'மொழிகள்',
    'profile.safetyPrivacy': 'பாதுகாப்பு மற்றும் தனியுரிமை',
    'profile.logout': 'வெளியேறு',
    'profile.verified': 'சரிபார்க்கப்பட்டது',
    'profile.idVerified': 'அடையாளம் சரிபார்க்கப்பட்டது',
    'profile.joined': 'சேர்ந்தது',
    'profile.trips': 'பயணங்கள்',
    'profile.rating': 'மதிப்பீடு',
    'profile.travelStyle': 'பயண பாணி',
    'profile.interests': 'ஆர்வங்கள்',
    
    // Languages
    'languages.title': 'மொழியைத் தேர்ந்தெடு',
    'languages.subtitle': 'உங்கள் விருப்ப மொழியைத் தேர்வு செய்யவும்',
    'languages.english': 'ஆங்கிலம்',
    'languages.sinhala': 'சிங்களம்',
    'languages.tamil': 'தமிழ்',
    'languages.current': 'தற்போதைய மொழி',
    
    // Auth
    'auth.welcomeBack': 'மீண்டும் வரவேற்கிறோம்',
    'auth.signInSubtitle': 'உங்கள் பயணத்தைத் தொடரவும் சக பயணிகளுடன் இணையவும் உள்நுழைக',
    'auth.email': 'மின்னஞ்சல்',
    'auth.password': 'கடவுச்சொல்',
    'auth.signIn': 'உள்நுழைக',
    'auth.forgotPassword': 'கடவுச்சொல்லை மறந்துவிட்டீர்களா?',
    'auth.orContinueWith': 'அல்லது இவற்றுடன் தொடரவும்',
    'auth.google': 'கூகுள்',
    'auth.facebook': 'பேஸ்புக்',
    'auth.noAccount': 'கணக்கு இல்லையா?',
    'auth.signUp': 'பதிவு செய்யவும்',
    
    // Common
    'common.loading': 'ஏற்றுகிறது...',
    'common.save': 'சேமி',
    'common.cancel': 'ரத்துசெய்',
    'common.delete': 'நீக்கு',
    'common.edit': 'திருத்து',
    'common.done': 'முடிந்தது',
    'common.search': 'தேடு',
  },
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('app-language');
    return (saved as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app-language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
