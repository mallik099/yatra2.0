import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      home: "Home",
      features: "Features",
      impact: "Impact",
      howItWorks: "How It Works",
      contact: "Contact",
      
      // Hero Section
      heroTitle: "Never Miss Your Bus Again",
      heroSubtitle: "📍 Track your bus in real-time, reduce pollution by choosing public transport, and never miss your ride again.",
      startYatra: "🚀 Start Your Yatra",
      learnMore: "📈 Learn More",
      liveTracking: "Live Tracking",
      routePlanning: "Route Planning",
      ecoFriendly: "🌱 Eco-Friendly",
      
      // Language Selector
      language: "Language",
      english: "English",
      hindi: "हिंदी",
      tamil: "தமிழ்"
    }
  },
  hi: {
    translation: {
      // Navigation
      home: "होम",
      features: "विशेषताएं",
      impact: "प्रभाव",
      howItWorks: "यह कैसे काम करता है",
      contact: "संपर्क",
      
      // Hero Section
      heroTitle: "अपनी बस को फिर कभी न चूकें",
      heroSubtitle: "📍 अपनी बस को रियल-टाइम में ट्रैक करें, सार्वजनिक परिवहन चुनकर प्रदूषण कम करें, और अपनी सवारी को फिर कभी न चूकें।",
      startYatra: "🚀 अपनी यात्रा शुरू करें",
      learnMore: "📈 और जानें",
      liveTracking: "लाइव ट्रैकिंग",
      routePlanning: "रूट प्लानिंग",
      ecoFriendly: "🌱 पर्यावरण-अनुकूल",
      
      // Language Selector
      language: "भाषा",
      english: "English",
      hindi: "हिंदी",
      tamil: "தமிழ்"
    }
  },
  ta: {
    translation: {
      // Navigation
      home: "முகப்பு",
      features: "அம்சங்கள்",
      impact: "தாக்கம்",
      howItWorks: "இது எப்படி வேலை செய்கிறது",
      contact: "தொடர்பு",
      
      // Hero Section
      heroTitle: "உங்கள் பேருந்தை மீண்டும் தவறவிடாதீர்கள்",
      heroSubtitle: "📍 உங்கள் பேருந்தை நேரடியாக கண்காணிக்கவும், பொதுப் போக்குவரத்தைத் தேர்ந்தெடுத்து மாசுபாட்டைக் குறைக்கவும், உங்கள் பயணத்தை மீண்டும் தவறவிடாதீர்கள்.",
      startYatra: "🚀 உங்கள் யாத்திரையைத் தொடங்குங்கள்",
      learnMore: "📈 மேலும் அறிக",
      liveTracking: "நேரடி கண்காணிப்பு",
      routePlanning: "வழித் திட்டமிடல்",
      ecoFriendly: "🌱 சுற்றுச்சூழல் நட்பு",
      
      // Language Selector
      language: "மொழி",
      english: "English",
      hindi: "हिंदी",
      tamil: "தமிழ்"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;