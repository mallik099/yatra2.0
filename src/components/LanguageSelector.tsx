import React, { useState } from 'react';
import { Globe, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 hover:bg-white/20 rounded-xl transition-all duration-300"
      >
        <Globe className="w-5 h-5" />
        <span className="text-sm font-medium">
          {languages.find(lang => lang.code === language)?.flag}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 glass-card p-2 min-w-[150px] z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-between p-3 hover:bg-white/20 rounded-lg transition-all duration-300 group"
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{lang.flag}</span>
                <span className="font-medium text-gray-700 group-hover:text-purple-700">
                  {lang.name}
                </span>
              </div>
              {language === lang.code && (
                <Check className="w-4 h-4 text-green-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;