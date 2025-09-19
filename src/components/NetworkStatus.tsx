import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, Signal } from 'lucide-react';

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState('unknown');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check connection type if available
    const connection = (navigator as any).connection;
    if (connection) {
      setConnectionType(connection.effectiveType || 'unknown');
      connection.addEventListener('change', () => {
        setConnectionType(connection.effectiveType || 'unknown');
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getConnectionColor = () => {
    if (!isOnline) return 'bg-red-100 text-red-800';
    if (connectionType === 'slow-2g' || connectionType === '2g') return 'bg-orange-100 text-orange-800';
    if (connectionType === '3g') return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getConnectionIcon = () => {
    if (!isOnline) return <WifiOff className="w-3 h-3" />;
    if (connectionType === 'slow-2g' || connectionType === '2g') return <Signal className="w-3 h-3" />;
    return <Wifi className="w-3 h-3" />;
  };

  return (
    <Badge className={`${getConnectionColor()} flex items-center gap-1`}>
      {getConnectionIcon()}
      <span className="text-xs">
        {isOnline ? (connectionType === 'unknown' ? 'Online' : connectionType.toUpperCase()) : 'Offline'}
      </span>
    </Badge>
  );
};

export default NetworkStatus;