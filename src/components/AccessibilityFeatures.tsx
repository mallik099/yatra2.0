import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Type, Volume2, Eye } from 'lucide-react';

interface AccessibilityFeaturesProps {
  onVoiceSearch?: (text: string) => void;
}

const AccessibilityFeatures: React.FC<AccessibilityFeaturesProps> = ({ onVoiceSearch }) => {
  const [isListening, setIsListening] = useState(false);
  const [textSize, setTextSize] = useState('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  useEffect(() => {
    // Apply text size to document
    document.documentElement.style.fontSize = 
      textSize === 'large' ? '18px' : textSize === 'xlarge' ? '22px' : '16px';

    // Apply high contrast
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [textSize, highContrast]);

  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice search not supported in this browser');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onVoiceSearch?.(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN';
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed bottom-20 right-4 z-30">
      {/* Accessibility Panel Toggle */}
      <div className="bg-white rounded-2xl shadow-lg p-2 mb-2">
        <div className="grid grid-cols-2 gap-2">
          {/* Voice Search */}
          <button
            onClick={startVoiceSearch}
            disabled={isListening}
            className={`p-3 rounded-xl flex flex-col items-center space-y-1 ${
              isListening 
                ? 'bg-red-100 text-red-600' 
                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            <span className="text-xs">
              {isListening ? 'Listening...' : 'Voice'}
            </span>
          </button>

          {/* Text Size */}
          <button
            onClick={() => {
              const sizes = ['normal', 'large', 'xlarge'];
              const currentIndex = sizes.indexOf(textSize);
              const nextSize = sizes[(currentIndex + 1) % sizes.length];
              setTextSize(nextSize);
            }}
            className="p-3 rounded-xl bg-green-100 text-green-600 hover:bg-green-200 flex flex-col items-center space-y-1"
          >
            <Type className="w-5 h-5" />
            <span className="text-xs">
              {textSize === 'normal' ? 'A' : textSize === 'large' ? 'A+' : 'A++'}
            </span>
          </button>

          {/* High Contrast */}
          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`p-3 rounded-xl flex flex-col items-center space-y-1 ${
              highContrast 
                ? 'bg-gray-800 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Eye className="w-5 h-5" />
            <span className="text-xs">Contrast</span>
          </button>

          {/* Voice Feedback */}
          <button
            onClick={() => {
              setVoiceEnabled(!voiceEnabled);
              speak(voiceEnabled ? 'Voice feedback disabled' : 'Voice feedback enabled');
            }}
            className={`p-3 rounded-xl flex flex-col items-center space-y-1 ${
              voiceEnabled 
                ? 'bg-purple-100 text-purple-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Volume2 className="w-5 h-5" />
            <span className="text-xs">Voice</span>
          </button>
        </div>
      </div>

      {/* Voice Search Feedback */}
      {isListening && (
        <div className="bg-red-500 text-white p-3 rounded-xl mb-2 text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-sm">Say "From [location] to [destination]"</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessibilityFeatures;