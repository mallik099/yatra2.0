import { useState, useEffect, useCallback } from 'react';
import { smartSearchService, SearchHistory } from '../services/smartSearchService';

interface UseSmartSearchReturn {
  recentSearches: SearchHistory[];
  frequentRoutes: SearchHistory[];
  isLocationEnabled: boolean;
  currentLocation: string | null;
  addToHistory: (source: string, destination: string) => void;
  clearHistory: () => void;
  refreshHistory: () => void;
  requestLocation: () => Promise<boolean>;
}

export const useSmartSearch = (): UseSmartSearchReturn => {
  const [recentSearches, setRecentSearches] = useState<SearchHistory[]>([]);
  const [frequentRoutes, setFrequentRoutes] = useState<SearchHistory[]>([]);
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<string | null>(null);

  const refreshHistory = useCallback(() => {
    setRecentSearches(smartSearchService.getRecentSearches(5));
    setFrequentRoutes(smartSearchService.getFrequentSearches(5));
  }, []);

  const addToHistory = useCallback((source: string, destination: string) => {
    smartSearchService.addToHistory(source, destination);
    refreshHistory();
  }, [refreshHistory]);

  const clearHistory = useCallback(() => {
    smartSearchService.clearHistory();
    refreshHistory();
  }, [refreshHistory]);

  const requestLocation = useCallback(async (): Promise<boolean> => {
    try {
      const location = await smartSearchService.getCurrentLocation();
      if (location) {
        setIsLocationEnabled(true);
        setCurrentLocation('Current Location'); // In real app, reverse geocode
        return true;
      }
      return false;
    } catch (error) {
      console.error('Location request failed:', error);
      return false;
    }
  }, []);

  useEffect(() => {
    refreshHistory();
    
    // Check if location is already available
    smartSearchService.getCurrentLocation().then(location => {
      if (location) {
        setIsLocationEnabled(true);
        setCurrentLocation('Current Location');
      }
    });
  }, [refreshHistory]);

  return {
    recentSearches,
    frequentRoutes,
    isLocationEnabled,
    currentLocation,
    addToHistory,
    clearHistory,
    refreshHistory,
    requestLocation
  };
};