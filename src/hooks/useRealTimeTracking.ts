import { useState, useEffect, useRef } from 'react';
import { busService } from '@/services/busService';

interface BusPosition {
  busNumber: string;
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  timestamp: number;
}

interface ETAData {
  busNumber: string;
  stopName: string;
  estimatedArrival: number;
  distance: number;
  confidence: number;
}

export const useRealTimeTracking = (busNumber?: string) => {
  const [position, setPosition] = useState<BusPosition | null>(null);
  const [eta, setEta] = useState<ETAData[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const calculateETA = (busPos: BusPosition, stopCoords: { lat: number; lng: number }) => {
    const distance = Math.sqrt(
      Math.pow(busPos.lat - stopCoords.lat, 2) + 
      Math.pow(busPos.lng - stopCoords.lng, 2)
    ) * 111000; // Convert to meters

    const avgSpeed = busPos.speed || 25; // km/h default
    const etaMinutes = (distance / 1000) / (avgSpeed / 60);
    
    return {
      distance: distance / 1000,
      eta: Math.max(1, Math.round(etaMinutes)),
      confidence: busPos.speed > 0 ? 0.9 : 0.6
    };
  };

  const updateBusPosition = async () => {
    if (!busNumber) return;

    try {
      setError(null);
      const bus = await busService.getBusByNumber(busNumber);
      
      if (bus) {
        const busPosition: BusPosition = {
          busNumber: bus.busNumber,
          lat: bus.currentLocation.lat,
          lng: bus.currentLocation.lng,
          speed: 25 + Math.random() * 15, // Simulated speed
          heading: Math.random() * 360,
          timestamp: Date.now()
        };

        setPosition(busPosition);

        // Calculate ETA for upcoming stops
        const upcomingStops = [
          { name: 'Ameerpet Metro', lat: 17.4374, lng: 78.4482 },
          { name: 'HITEC City', lat: 17.4485, lng: 78.3684 },
          { name: 'Gachibowli', lat: 17.4399, lng: 78.3648 }
        ];

        const etaData = upcomingStops.map(stop => {
          const calc = calculateETA(busPosition, stop);
          return {
            busNumber,
            stopName: stop.name,
            estimatedArrival: calc.eta,
            distance: calc.distance,
            confidence: calc.confidence
          };
        });

        setEta(etaData);
      } else {
        setError(`Bus ${busNumber} not found`);
      }
    } catch (error) {
      console.error('Error updating position:', error);
      setError('Failed to fetch bus data');
    }
  };

  const startTracking = (targetBus: string) => {
    setIsTracking(true);
    updateBusPosition();
    intervalRef.current = setInterval(updateBusPosition, 5000); // Update every 5 seconds
  };

  const stopTracking = () => {
    setIsTracking(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    if (busNumber) {
      startTracking(busNumber);
    }
    return () => stopTracking();
  }, [busNumber]);

  return {
    position,
    eta,
    isTracking,
    error,
    startTracking,
    stopTracking,
    updateBusPosition
  };
};