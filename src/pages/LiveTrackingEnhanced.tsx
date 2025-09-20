import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Clock, Users, Navigation, Wifi, WifiOff, ArrowLeft, RefreshCw, Locate } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/leaflet-custom.css';
import { realTimeBusService, RealTimeBus, BusStop } from '../services/realTimeBusService';

// Using interfaces from the service

const LiveTrackingEnhanced: React.FC = () => {
  const navigate = useNavigate();
  const [buses, setBuses] = useState<RealTimeBus[]>([]);
  const [busStops, setBusStops] = useState<BusStop[]>([]);
  const [selectedBus, setSelectedBus] = useState<RealTimeBus | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const busMarkersRef = useRef<{[key: string]: L.Marker}>({});

  // Initialize map
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const hyderabadCenter: [number, number] = [17.3850, 78.4867];
      
      mapRef.current = L.map(mapContainerRef.current).setView(hyderabadCenter, 12);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current);
    }
    
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          
          if (mapRef.current) {
            L.marker([latitude, longitude])
              .addTo(mapRef.current)
              .bindPopup('Your Location')
              .openPopup();
          }
        },
        (error) => {
          console.log('Location access denied:', error);
          setUserLocation({ lat: 17.3850, lng: 78.4867 });
        }
      );
    }
  }, []);

  // Initialize data from real-time service
  useEffect(() => {
    setBusStops(realTimeBusService.getBusStops());
    
    // Subscribe to real-time updates
    const unsubscribe = realTimeBusService.subscribe((updatedBuses) => {
      setBuses(updatedBuses);
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  // Update bus markers on map
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    Object.values(busMarkersRef.current).forEach(marker => {
      mapRef.current?.removeLayer(marker);
    });
    busMarkersRef.current = {};

    // Add bus stop markers
    busStops.forEach(stop => {
      const stopIcon = L.divIcon({
        html: `<div class="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div>`,
        className: 'custom-div-icon',
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });
      
      L.marker([stop.lat, stop.lng], { icon: stopIcon })
        .addTo(mapRef.current!)
        .bindPopup(`<b>${stop.name}</b><br/>Routes: ${stop.routes.join(', ')}`);
    });

    // Add bus markers
    buses.forEach(bus => {
      const crowdColor = bus.crowdLevel === 'Low' ? '#10b981' : 
                        bus.crowdLevel === 'Medium' ? '#f59e0b' : '#ef4444';
      
      const busIcon = L.divIcon({
        html: `
          <div class="relative">
            <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg border-2 border-white" style="background-color: ${crowdColor}">
              🚌
            </div>
            <div class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          </div>
        `,
        className: 'custom-div-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
      
      const marker = L.marker([bus.lat, bus.lng], { icon: busIcon })
        .addTo(mapRef.current!)
        .bindPopup(`
          <div class="p-2">
            <h3 class="font-bold">${bus.number}</h3>
            <p class="text-sm">${bus.route}</p>
            <p class="text-sm">ETA: ${bus.eta} mins</p>
            <p class="text-sm">Next: ${bus.nextStop}</p>
            <p class="text-sm">Occupancy: ${bus.occupancy}/${bus.capacity}</p>
            <p class="text-sm">Speed: ${bus.speed} km/h</p>
          </div>
        `);
      
      busMarkersRef.current[bus.id] = marker;
      
      marker.on('click', () => {
        setSelectedBus(bus);
      });
    });
  }, [buses, busStops]);

  // Handle refresh indicator
  useEffect(() => {
    const interval = setInterval(() => {
      setIsRefreshing(true);
      setTimeout(() => setIsRefreshing(false), 500);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  const centerOnUser = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.setView([userLocation.lat, userLocation.lng], 15);
    }
  };

  const getCrowdColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCrowdIcon = (level: string) => {
    switch (level) {
      case 'Low': return '😊';
      case 'Medium': return '😐';
      case 'High': return '😰';
      default: return '❓';
    }
  };

  const getOccupancyPercentage = (occupancy: number, capacity: number) => {
    return Math.round((occupancy / capacity) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-teal-600 text-white p-3 sm:p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-teal-700 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg sm:text-xl font-bold">Live Bus Tracking</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={refreshData}
            className={`p-2 hover:bg-teal-700 rounded-full transition-colors ${isRefreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button 
            onClick={centerOnUser}
            className="p-2 hover:bg-teal-700 rounded-full transition-colors"
          >
            <Locate className="w-4 h-4" />
          </button>
          <div className="flex items-center space-x-1">
            {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            <span className="text-sm">Live</span>
          </div>
        </div>
      </div>

      {/* Real Map */}
      <div className="h-64 sm:h-80 relative">
        <div ref={mapContainerRef} className="w-full h-full" />
        
        {/* Live Status */}
        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse z-[1000]">
          🔴 LIVE
        </div>
        
        {/* Map Controls */}
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-2 z-[1000]">
          <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium">
            🗺️ OpenStreetMap
          </button>
        </div>
        
        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-95 backdrop-blur-sm p-3 rounded-lg shadow-lg border z-[1000]">
          <h4 className="font-bold text-xs mb-2 text-gray-800">🚌 Live Buses</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">Low Crowd</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-700">Medium Crowd</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-700">High Crowd</span>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span>Bus Stops</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-4 grid grid-cols-4 gap-3">
        <div className="bg-white rounded-xl p-3 text-center shadow-sm">
          <div className="text-2xl font-bold text-teal-600">{buses.length}</div>
          <div className="text-xs text-gray-500">Active</div>
        </div>
        <div className="bg-white rounded-xl p-3 text-center shadow-sm">
          <div className="text-2xl font-bold text-green-600">{buses.filter(b => b.crowdLevel === 'Low').length}</div>
          <div className="text-xs text-gray-500">Low Crowd</div>
        </div>
        <div className="bg-white rounded-xl p-3 text-center shadow-sm">
          <div className="text-2xl font-bold text-blue-600">{buses.length > 0 ? Math.min(...buses.map(b => b.eta)) : 0}</div>
          <div className="text-xs text-gray-500">Min ETA</div>
        </div>
        <div className="bg-white rounded-xl p-3 text-center shadow-sm">
          <div className="text-2xl font-bold text-purple-600">{Math.round(buses.reduce((acc, b) => acc + b.speed, 0) / buses.length)}</div>
          <div className="text-xs text-gray-500">Avg Speed</div>
        </div>
      </div>

      {/* Bus List */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Nearby Buses</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live Updates</span>
          </div>
        </div>
        
        {buses.map((bus) => (
          <div
            key={bus.id}
            className={`bg-white rounded-2xl p-4 shadow-sm border-l-4 cursor-pointer transition-all ${
              selectedBus?.id === bus.id ? 'border-teal-600 bg-teal-50 scale-105' : 'border-gray-200 hover:shadow-md'
            }`}
            onClick={() => setSelectedBus(bus)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                  bus.crowdLevel === 'Low' ? 'bg-green-500' :
                  bus.crowdLevel === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                }`}>
                  {bus.number.length > 3 ? bus.number.slice(0, 2) : bus.number}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{bus.number}</h3>
                  <p className="text-sm text-gray-500 truncate">{bus.route}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1 text-teal-600 font-semibold">
                  <Clock className="w-4 h-4" />
                  <span>{bus.eta} mins</span>
                </div>
                <p className="text-xs text-gray-500">ETA</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Navigation className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 truncate">Next: {bus.nextStop}</span>
              </div>
              
              <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getCrowdColor(bus.crowdLevel)}`}>
                <span>{getCrowdIcon(bus.crowdLevel)}</span>
                <span>{bus.crowdLevel}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Speed: {bus.speed} km/h</span>
              <span>Occupancy: {getOccupancyPercentage(bus.occupancy, bus.capacity)}%</span>
              <span>Updated: {bus.lastUpdated.toLocaleTimeString()}</span>
            </div>

            {selectedBus?.id === bus.id && (
              <div className="mt-3 pt-3 border-t border-gray-200 animate-fadeIn">
                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div>
                    <p className="text-gray-500">Capacity</p>
                    <p className="font-medium">{bus.occupancy}/{bus.capacity} passengers</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Speed</p>
                    <p className="font-medium">{bus.speed} km/h</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="flex-1 bg-teal-600 text-white py-2 rounded-xl text-sm font-medium">
                    🔔 Notify Me
                  </button>
                  <button className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-sm font-medium">
                    📍 Track Route
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveTrackingEnhanced;