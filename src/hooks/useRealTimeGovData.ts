import { useState, useEffect, useCallback } from 'react';
import { realTimeGovApi, TSRTCBusData } from '../services/realTimeGovApi';

export const useRealTimeGovData = () => {
  const [buses, setBuses] = useState<TSRTCBusData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Handle real-time bus updates
  const handleBusUpdate = useCallback((data: TSRTCBusData | TSRTCBusData[]) => {
    const busArray = Array.isArray(data) ? data : [data];
    setBuses(prevBuses => {
      const updatedBuses = [...prevBuses];
      
      busArray.forEach(newBus => {
        const existingIndex = updatedBuses.findIndex(bus => bus.vehicleId === newBus.vehicleId);
        if (existingIndex >= 0) {
          updatedBuses[existingIndex] = newBus;
        } else {
          updatedBuses.push(newBus);
        }
      });
      
      return updatedBuses;
    });
    setLastUpdate(new Date());
  }, []);

  // Initialize real-time connection
  useEffect(() => {
    const initializeRealTime = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Connect to real-time tracking
        await realTimeGovApi.connectRealTimeTracking();
        setConnected(true);
        
        // Subscribe to bus updates
        realTimeGovApi.subscribe('busUpdate', handleBusUpdate);
        
        // Get initial data
        const initialBuses = await realTimeGovApi.getLiveBuses();
        setBuses(initialBuses);
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to initialize real-time data:', err);
        setError('Failed to connect to real-time tracking');
        setConnected(false);
        setLoading(false);
      }
    };

    initializeRealTime();

    // Cleanup on unmount
    return () => {
      realTimeGovApi.disconnect();
    };
  }, [handleBusUpdate]);

  // Refresh data manually
  const refreshData = useCallback(async () => {
    try {
      setError(null);
      const freshBuses = await realTimeGovApi.getLiveBuses();
      setBuses(freshBuses);
      setLastUpdate(new Date());
    } catch (err) {
      setError('Failed to refresh data');
    }
  }, []);

  // Get nearby buses
  const getNearbyBuses = useCallback(async (lat: number, lng: number, radius?: number) => {
    try {
      return await realTimeGovApi.getNearbyBuses(lat, lng, radius);
    } catch (err) {
      console.error('Failed to get nearby buses:', err);
      return [];
    }
  }, []);

  // Get specific bus details
  const getBusDetails = useCallback(async (vehicleId: string) => {
    try {
      return await realTimeGovApi.getBusDetails(vehicleId);
    } catch (err) {
      console.error('Failed to get bus details:', err);
      return null;
    }
  }, []);

  return {
    buses,
    loading,
    error,
    connected,
    lastUpdate,
    refreshData,
    getNearbyBuses,
    getBusDetails
  };
};