import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Eye, EyeOff, Type, Volume2, VolumeX } from 'lucide-react';

const AccessibilityControls = () => {
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState('normal');
  const [screenReader, setScreenReader] = useState(false);

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    document.documentElement.className = document.documentElement.className.replace(/font-size-\w+/, '');
    document.documentElement.classList.add(`font-size-${fontSize}`);
  }, [fontSize]);

  const speak = (text: string) => {
    if (screenReader && 'speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <Card className="fixed bottom-4 right-4 p-4 z-50 bg-background/95 backdrop-blur">
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setHighContrast(!highContrast)}
          aria-label={highContrast ? "Disable high contrast" : "Enable high contrast"}
        >
          {highContrast ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFontSize(fontSize === 'normal' ? 'large' : fontSize === 'large' ? 'xl' : 'normal')}
          aria-label="Change font size"
        >
          <Type className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setScreenReader(!screenReader)}
          aria-label={screenReader ? "Disable screen reader" : "Enable screen reader"}
        >
          {screenReader ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </Button>
      </div>
    </Card>
  );
};

export default AccessibilityControls;