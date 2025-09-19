import { useState, useEffect } from 'react';

interface Bus {
  busNumber: string;
  route: string;
  currentLocation: { lat: number; lng: number };
  currentPassengers: number;
  capacity: number;
  status: string;
  nextStop?: string;
  eta?: number;
}

export const useBusData = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBuses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3002/api/buses');
      if (response.ok) {
        const data = await response.json();
        setBuses(data);
      } else {
        throw new Error('Failed to fetch buses');
      }
    } catch (err) {
      setError('Unable to fetch bus data');
      // Fallback data for Telangana
      setBuses([
        {
          busNumber: 'TS07UA1234',
          route: 'Secunderabad - Gachibowli',
          currentLocation: { lat: 17.4399, lng: 78.5014 },
          currentPassengers: 32,
          capacity: 50,
          status: 'active',
          nextStop: 'Ameerpet Metro',
          eta: 8
        },
        {
          busNumber: 'TS09UB5678',
          route: 'Kukatpally - Dilsukhnagar',
          currentLocation: { lat: 17.4851, lng: 78.4089 },
          currentPassengers: 18,
          capacity: 45,
          status: 'active',
          nextStop: 'Miyapur',
          eta: 12
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const trackBus = async (busNumber: string) => {
    const bus = buses.find(b => b.busNumber === busNumber);
    return bus || null;
  };

  const getNearbyBuses = (location: { lat: number; lng: number }) => {
    return buses.filter(bus => {
      const distance = Math.sqrt(
        Math.pow(bus.currentLocation.lat - location.lat, 2) +
        Math.pow(bus.currentLocation.lng - location.lng, 2)
      );
      return distance < 0.05; // Roughly 5km radius
    });
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  return { buses, loading, error, fetchBuses, trackBus, getNearbyBuses };
};