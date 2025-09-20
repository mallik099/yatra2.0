import { useState, useEffect, useCallback } from 'react';
import { busApi, getLiveETA } from '../services/busApi';

interface ETAData {
  eta: string;
  confidence: string;
  nextStop: string;
  busLocation: {
    lat: number;
    lng: number;
  };
}

export const useRealTimeETA = (busNumber: string, refreshInterval: number = 30000) => {
  const [etaData, setETAData] = useState<ETAData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchETA = useCallback(async () => {
    if (!busNumber) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await getLiveETA(busNumber);
      if (data) {
        setETAData(data);
      }
    } catch (err) {
      setError('Failed to fetch ETA');
      console.error('ETA fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [busNumber]);

  useEffect(() => {
    fetchETA();
    
    const interval = setInterval(fetchETA, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchETA, refreshInterval]);

  return {
    etaData,
    loading,
    error,
    refresh: fetchETA
  };
};

export const useMultipleBusETAs = (busNumbers: string[], refreshInterval: number = 30000) => {
  const [etaData, setETAData] = useState<Record<string, ETAData>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllETAs = useCallback(async () => {
    if (busNumbers.length === 0) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const etaPromises = busNumbers.map(async (busNumber) => {
        const data = await getLiveETA(busNumber);
        return { busNumber, data };
      });
      
      const results = await Promise.all(etaPromises);
      const newETAData: Record<string, ETAData> = {};
      
      results.forEach(({ busNumber, data }) => {
        if (data) {
          newETAData[busNumber] = data;
        }
      });
      
      setETAData(newETAData);
    } catch (err) {
      setError('Failed to fetch ETAs');
      console.error('Multiple ETA fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [busNumbers]);

  useEffect(() => {
    fetchAllETAs();
    
    const interval = setInterval(fetchAllETAs, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchAllETAs, refreshInterval]);

  return {
    etaData,
    loading,
    error,
    refresh: fetchAllETAs
  };
};