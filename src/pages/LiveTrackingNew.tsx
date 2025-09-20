import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Clock, Wifi, Smartphone } from 'lucide-react';
import RealMap from '../components/RealMap';
import { busApi, BusLocation } from '../services/busApi';

interface Bus {
  id: string;
  number: string;
  route: string;
  location: [number, number];
  eta: string;
  nextStop: string;
  fare: number;
  status: 'active' | 'delayed' | 'ontime';
  capacity?: {
    total: number;
    available: number;
  };
  vehicleType?: string;
}

const mapBusData = (busData: BusLocation[]): Bus[] => {
  return busData.map((bus) => ({
    id: bus._id,
    number: bus.busNumber,
    route: `${bus.route.source} - ${bus.route.destination}`,
    location: [bus.currentLocation.lat, bus.currentLocation.lng],
    eta: calculateETA(bus),
    nextStop: bus.route.nextStop || 'Unknown',
    fare: bus.fare?.regular || 0,
    status: mapStatus(bus.status),
    capacity: bus.capacity,
    vehicleType: bus.vehicleType
  }));
};

const mapStatus = (status: string): 'active' | 'delayed' | 'ontime' => {
  switch (status) {
    case 'ON_ROUTE': return 'active';
    case 'DELAYED': return 'delayed';
    case 'STOPPED': return 'ontime';
    default: return 'active';
  }
};

const calculateETA = (bus: BusLocation): string => {
  const now = new Date();
  const updated = new Date(bus.lastUpdated);
  const diffMinutes = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60));
  
  switch (bus.status) {
    case 'ON_ROUTE':
      return diffMinutes < 2 ? '2–5 mins' : '5–8 mins';
    case 'DELAYED':
      return '10–15 mins';
    case 'STOPPED':
      return 'Arriving now';
    default:
      return '5–10 mins';
  }
};

const LiveTracking: React.FC = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    const loadBuses = async () => {
      try {
        const busData = await busApi.getBuses();
        const mappedBuses = mapBusData(busData);
        setBuses(mappedBuses);
        setLastUpdate(new Date().toLocaleTimeString());
        setLoading(false);
      } catch (error) {
        console.error('Error loading buses:', error);
        setLoading(false);
      }
    };

    loadBuses();
    const interval = setInterval(loadBuses, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      {/* iOS-style Header */}
      <div className="backdrop-blur-xl bg-gradient-to-r from-slate-800/95 to-slate-900/95 border-b border-white/10 p-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => window.history.back()} 
              className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center hover:bg-white/80 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">Live Bus Tracking</h1>
              <div className="flex items-center space-x-2 text-sm text-blue-300">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live Data</span>
                </div>
                <span>•</span>
                <span>Real-time updates</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-white">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
            <div className="text-xs text-blue-300">Updated {lastUpdate}</div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 text-center shadow-xl">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 animate-pulse"></div>
            <p className="text-blue-700 font-medium">Loading live buses...</p>
          </div>
        </div>
      ) : buses.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 text-center shadow-xl">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 animate-spin">
              <div className="w-full h-full rounded-full border-4 border-white border-t-transparent animate-spin"></div>
            </div>
            <p className="text-blue-700 font-medium">Initializing live tracking...</p>
          </div>
        </div>
      ) : (
        <div className="p-4 space-y-4">
          {/* Map Widget */}
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Live Positions</h2>
              <div className="flex items-center space-x-2">
                <Wifi className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-600">Live</span>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden">
              <RealMap buses={buses} onBusSelect={setSelectedBus} selectedBus={selectedBus} />
            </div>
          </div>
          
          {/* Bus List Widget */}
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Live Buses</h2>
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {buses.length} active
              </div>
            </div>
            
            <div className="grid gap-4">
              {buses.map((bus) => (
                <div 
                  key={bus.id} 
                  onClick={() => setSelectedBus(bus)}
                  className={`group relative bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl border border-white/30 ${
                    selectedBus?.id === bus.id 
                      ? 'ring-2 ring-blue-500 shadow-2xl scale-[1.02]' 
                      : 'hover:bg-white/60'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1.5 rounded-full font-bold text-sm">
                        {bus.number}
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        bus.status === 'active' ? 'bg-green-100 text-green-700' :
                        bus.status === 'delayed' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {bus.status === 'active' ? 'Active' : bus.status === 'delayed' ? 'Delayed' : 'On-time'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent animate-pulse">
                        {bus.eta}
                      </div>
                      <div className="text-xs text-green-600 font-medium">ETA</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-blue-800">
                      <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                      <span className="font-medium">{bus.route}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-purple-700">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>Next: {bus.nextStop}</span>
                      </div>
                      <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        ₹{bus.fare}
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Sidebar Widget */}
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20">
            {selectedBus ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Bus {selectedBus.number}</h3>
                    <p className="text-sm text-gray-600">Live Details</p>
                  </div>
                </div>
                
                <div className="grid gap-3">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4">
                    <div className="text-xs text-blue-600 mb-1">Route</div>
                    <div className="font-bold text-blue-900">{selectedBus.route}</div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4">
                    <div className="text-xs text-green-600 mb-1">ETA</div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {selectedBus.eta}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4">
                      <div className="text-xs text-purple-600 mb-1">Next Stop</div>
                      <div className="font-bold text-purple-900 text-sm">{selectedBus.nextStop}</div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4">
                      <div className="text-xs text-amber-600 mb-1">Fare</div>
                      <div className="font-bold text-amber-900">₹{selectedBus.fare}</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-teal-600 mb-1">Status</div>
                        <div className={`font-bold ${
                          selectedBus.status === 'active' ? 'text-green-600' :
                          selectedBus.status === 'delayed' ? 'text-red-600' :
                          'text-blue-600'
                        }`}>
                          {selectedBus.status.charAt(0).toUpperCase() + selectedBus.status.slice(1)}
                        </div>
                      </div>
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-200 to-purple-300 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <Smartphone className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-blue-900 mb-2">Select a Bus</h3>
                <p className="text-sm text-blue-600">Tap on any bus to view live details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveTracking;