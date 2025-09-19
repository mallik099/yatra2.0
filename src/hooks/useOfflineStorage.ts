import { useState, useEffect } from 'react';

interface OfflineData {
  buses: any[];
  routes: any[];
  lastUpdated: number;
}

export const useOfflineStorage = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineData, setOfflineData] = useState<OfflineData | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load cached data on mount
    loadOfflineData();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadOfflineData = async () => {
    try {
      const cached = localStorage.getItem('smartcommute-offline');
      if (cached) {
        setOfflineData(JSON.parse(cached));
      }
    } catch (error) {
      console.error('Failed to load offline data:', error);
    }
  };

  const saveOfflineData = (data: Partial<OfflineData>) => {
    try {
      const existing = offlineData || { buses: [], routes: [], lastUpdated: 0 };
      const updated = { ...existing, ...data, lastUpdated: Date.now() };
      localStorage.setItem('smartcommute-offline', JSON.stringify(updated));
      setOfflineData(updated);
    } catch (error) {
      console.error('Failed to save offline data:', error);
    }
  };

  const fetchWithCache = async (url: string, options?: RequestInit) => {
    try {
      if (isOnline) {
        const response = await fetch(url, options);
        const data = await response.json();
        
        // Cache successful responses
        if (response.ok && url.includes('/api/')) {
          if (url.includes('/buses')) {
            saveOfflineData({ buses: data });
          } else if (url.includes('/routes')) {
            saveOfflineData({ routes: data });
          }
        }
        
        return data;
      } else {
        // Return cached data when offline
        if (url.includes('/buses') && offlineData?.buses) {
          return offlineData.buses;
        } else if (url.includes('/routes') && offlineData?.routes) {
          return offlineData.routes;
        }
        throw new Error('No cached data available');
      }
    } catch (error) {
      console.error('Fetch with cache failed:', error);
      throw error;
    }
  };

  return {
    isOnline,
    offlineData,
    fetchWithCache,
    saveOfflineData
  };
};