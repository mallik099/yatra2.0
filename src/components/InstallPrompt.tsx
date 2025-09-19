import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, X } from 'lucide-react';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('install-prompt-dismissed', 'true');
  };

  if (!showPrompt || localStorage.getItem('install-prompt-dismissed')) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg z-50">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center">
          <Download className="w-5 h-5 mr-2" />
          <h3 className="font-semibold">Install SmartCommute</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="text-white hover:bg-white/20 p-1"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      <p className="text-sm mb-3 text-blue-100">
        Install our app for faster access and offline features!
      </p>
      <div className="flex gap-2">
        <Button
          onClick={handleInstall}
          className="bg-white text-blue-600 hover:bg-blue-50 flex-1"
          size="sm"
        >
          Install
        </Button>
        <Button
          onClick={handleDismiss}
          variant="ghost"
          className="text-white hover:bg-white/20"
          size="sm"
        >
          Later
        </Button>
      </div>
    </Card>
  );
};

export default InstallPrompt;