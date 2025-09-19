import { useOfflineStorage } from '@/hooks/useOfflineStorage';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WifiOff, Wifi } from 'lucide-react';

const OfflineIndicator = () => {
  const { isOnline, offlineData } = useOfflineStorage();

  if (isOnline) return null;

  return (
    <Alert className="mb-4 border-orange-200 bg-orange-50">
      <WifiOff className="h-4 w-4 text-orange-600" />
      <AlertDescription className="text-orange-800">
        You're offline. Showing cached data from {offlineData?.lastUpdated ? 
          new Date(offlineData.lastUpdated).toLocaleTimeString() : 'earlier'}.
      </AlertDescription>
    </Alert>
  );
};

export default OfflineIndicator;