import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Navigation } from 'lucide-react';
import { busApi, BusLocation } from '../services/busApi';

interface Bus {
  id: string;
  number: string;
  location: [number, number];
  route: string;
  nextStop: string;
  status: string;
  eta: string;
}

interface NearbyBusesProps {
  userLocation: [number, number] | null;
  onBusSelect: (bus: Bus) => void;
}

const NearbyBuses: React.FC<NearbyBusesProps> = ({ userLocation, onBusSelect }) => {
  const [nearbyBuses, setNearbyBuses] = useState<BusLocation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userLocation) return;

    const loadNearbyBuses = async () => {
      setLoading(true);
      try {
        const buses = await busApi.getNearbyBuses(userLocation[0], userLocation[1], 2000);
        setNearbyBuses(buses);
      } catch (error) {
        console.error('Error loading nearby buses:', error);
      }
      setLoading(false);
    };

    loadNearbyBuses();
    const interval = setInterval(loadNearbyBuses, 15000);
    return () => clearInterval(interval);
  }, [userLocation]);

  const calculateDistance = (busLat: number, busLng: number): string => {
    if (!userLocation) return 'Unknown';
    
    const R = 6371; // Earth's radius in km
    const dLat = (busLat - userLocation[0]) * Math.PI / 180;
    const dLon = (busLng - userLocation[1]) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(userLocation[0] * Math.PI / 180) * Math.cos(busLat * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
  };

  if (!userLocation) {
    return (
      <div className="bg-gradient-to-br from-white/80 to-blue-50/60 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-white/30">
        <h3 className="text-lg font-semibold mb-2">📍 Nearby Buses</h3>
        <p className="text-blue-600 text-sm">Enable location to see nearby buses</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white/80 to-blue-50/60 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-white/30">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">📍 Nearby Buses</h3>
        <div className="text-xs text-blue-600">
          {loading ? 'Updating...' : `${nearbyBuses.length} found`}
        </div>
      </div>
      
      {nearbyBuses.length === 0 ? (
        <p className="text-blue-600 text-sm">No buses nearby</p>
      ) : (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {nearbyBuses.map((bus) => (
            <div
              key={bus._id}
              onClick={() => onBusSelect({
                id: bus._id,
                number: bus.busNumber,
                location: [bus.currentLocation.lat, bus.currentLocation.lng],
                route: `${bus.route.source} - ${bus.route.destination}`,
                nextStop: bus.route.nextStop,
                status: bus.status.toLowerCase(),
                eta: '5-10 mins'
              })}
              className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-xl cursor-pointer hover:from-blue-100/80 hover:to-indigo-100/80 border border-white/30 shadow-sm transition-all duration-200"
            >
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                  {bus.busNumber}
                </div>
                <div className="text-sm">
                  <div className="font-medium">{bus.route.source}</div>
                  <div className="text-blue-600 text-xs">→ {bus.route.destination}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-blue-600">
                  {calculateDistance(bus.currentLocation.lat, bus.currentLocation.lng)}
                </div>
                <div className="text-xs text-blue-600">away</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NearbyBuses;