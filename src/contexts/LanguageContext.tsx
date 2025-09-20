import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    home: 'Home',
    liveTracking: 'Live Tracking',
    routeSearch: 'Route Search',
    profile: 'Profile',
    tickets: 'My Tickets',
    wallet: 'Wallet',
    settings: 'Settings',
    support: 'Support',
    emergency: 'Emergency SOS',
    busArriving: 'Bus arriving in',
    minutes: 'minutes',
    crowdLevel: 'Crowd Level',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    fareCalculator: 'Fare Calculator',
    from: 'From',
    to: 'To',
    bookTicket: 'Book Ticket',
    feedback: 'Feedback',
    rating: 'Rating',
    offline: 'Offline Mode'
  },
  hi: {
    home: 'होम',
    liveTracking: 'लाइव ट्रैकिंग',
    routeSearch: 'रूट खोजें',
    profile: 'प्रोफाइल',
    tickets: 'मेरे टिकट',
    wallet: 'वॉलेट',
    settings: 'सेटिंग्स',
    support: 'सहायता',
    emergency: 'आपातकालीन SOS',
    busArriving: 'बस आ रही है',
    minutes: 'मिनट में',
    crowdLevel: 'भीड़ का स्तर',
    low: 'कम',
    medium: 'मध्यम',
    high: 'अधिक',
    fareCalculator: 'किराया कैलकुलेटर',
    from: 'से',
    to: 'तक',
    bookTicket: 'टिकट बुक करें',
    feedback: 'फीडबैक',
    rating: 'रेटिंग',
    offline: 'ऑफलाइन मोड'
  },
  te: {
    home: 'హోమ్',
    liveTracking: 'లైవ్ ట్రాకింగ్',
    routeSearch: 'రూట్ వెతకండి',
    profile: 'ప్రొఫైల్',
    tickets: 'నా టిక్కెట్లు',
    wallet: 'వాలెట్',
    settings: 'సెట్టింగ్స్',
    support: 'సపోర్ట్',
    emergency: 'అత్యవసర SOS',
    busArriving: 'బస్ వస్తోంది',
    minutes: 'నిమిషాల్లో',
    crowdLevel: 'రద్దీ స్థాయి',
    low: 'తక్కువ',
    medium: 'మధ్యమ',
    high: 'ఎక్కువ',
    fareCalculator: 'ఛార్జీ కాలిక్యులేటర్',
    from: 'నుండి',
    to: 'వరకు',
    bookTicket: 'టిక్కెట్ బుక్ చేయండి',
    feedback: 'ఫీడ్‌బ్యాక్',
    rating: 'రేటింగ్',
    offline: 'ఆఫ్‌లైన్ మోడ్'
  }
};

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  languages: { code: string; name: string; flag: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' }
  ];

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages }}>
      {children}
    </LanguageContext.Provider>
  );
};