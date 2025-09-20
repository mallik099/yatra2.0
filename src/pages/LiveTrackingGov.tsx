import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Clock, Wifi, Smartphone, Zap, Shield } from 'lucide-react';
import RealMap from '../components/RealMap';
import { useRealTimeGovData } from '../hooks/useRealTimeGovData';
import { TSRTCBusData } from '../services/realTimeGovApi';

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
  speed?: number;
  occupancy?: string;
}

const mapGovBusData = (govBus: TSRTCBusData): Bus => {
  const eta = calculateETA(govBus);
  const status = mapStatus(govBus.status);
  
  return {
    id: govBus.vehicleId,
    number: govBus.routeNumber,
    route: govBus.routeName,
    location: [govBus.currentLat, govBus.currentLng],
    eta,
    nextStop: govBus.nextStopName,
    fare: govBus.fare,
    status,
    capacity: {
      total: 40,
      available: govBus.occupancyStatus === 'LOW' ? 35 : 
                govBus.occupancyStatus === 'MEDIUM' ? 20 :
                govBus.occupancyStatus === 'HIGH' ? 8 : 0
    },
    vehicleType: govBus.vehicleType,
    speed: govBus.speed,
    occupancy: govBus.occupancyStatus
  };
};

const mapStatus = (status: string): 'active' | 'delayed' | 'ontime' => {
  switch (status) {
    case 'ACTIVE': return 'active';
    case 'BREAKDOWN': return 'delayed';
    default: return 'active';
  }
};

const calculateETA = (govBus: TSRTCBusData): string => {
  const arrivalTime = new Date(govBus.estimatedArrival);
  const now = new Date();
  const diffMinutes = Math.floor((arrivalTime.getTime() - now.getTime()) / (1000 * 60));
  
  if (diffMinutes <= 0) return 'Arriving now';
  if (diffMinutes <= 2) return '1-2 mins';
  if (diffMinutes <= 5) return '3-5 mins';
  if (diffMinutes <= 10) return '5-10 mins';
  return `${diffMinutes} mins`;
};

const LiveTrackingGov: React.FC = () => {
  const { buses: govBuses, loading, error, connected, lastUpdate, refreshData } = useRealTimeGovData();
  const [buses, setBuses] = useState<Bus[]>([]);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  // Convert government data to app format
  useEffect(() => {
    const mappedBuses = govBuses.map(mapGovBusData);
    setBuses(mappedBuses);
  }, [govBuses]);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => console.log('Location access denied')
      );
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'delayed': return 'text-red-600';
      case 'ontime': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getOccupancyColor = (occupancy: string) => {
    switch (occupancy) {
      case 'LOW': return 'bg-green-100 text-green-700';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-700';
      case 'HIGH': return 'bg-orange-100 text-orange-700';
      case 'FULL': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Government API Header */}
      <div className="backdrop-blur-xl bg-white/80 border-b border-white/20 p-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => window.history.back()} 
              className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center hover:bg-white/80 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Government Live Tracking
              </h1>
              <div className="flex items-center space-x-2 text-sm">
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                  <span className={connected ? 'text-green-700' : 'text-red-700'}>
                    {connected ? 'TSRTC API Connected' : 'Offline Mode'}
                  </span>
                </div>
                <span>•</span>
                <span className="text-blue-700">Real-time Government Data</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-900">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
            <div className="text-xs text-blue-600">Updated {lastUpdate.toLocaleTimeString()}</div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 text-center shadow-xl">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mx-auto mb-4 animate-pulse flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <p className="text-blue-700 font-medium">Connecting to TSRTC Government API...</p>
            <p className="text-sm text-gray-600 mt-2">Fetching real-time bus data</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 text-center shadow-xl">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Wifi className="w-8 h-8 text-white" />
            </div>
            <p className="text-red-700 font-medium">{error}</p>
            <button 
              onClick={refreshData}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 space-y-4">
          {/* Government Data Status */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 backdrop-blur-xl rounded-2xl p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Zap className="w-5 h-5 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-800">Government API Status</h3>
                  <p className="text-sm text-green-600">Connected to official TSRTC data sources</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{buses.length}</div>
                <div className="text-xs text-green-700">Live Buses</div>
              </div>
            </div>
          </div>

          {/* Map Widget */}
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Government Live Positions</h2>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-600">Official Data</span>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden">
              <RealMap buses={buses} onBusSelect={setSelectedBus} selectedBus={selectedBus} />
            </div>
          </div>
          
          {/* Government Bus List */}
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Government Live Buses</h2>
              <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                <Shield className="w-3 h-3" />
                {buses.length} official
              </div>
            </div>
            
            <div className="grid gap-4">
              {buses.map((bus) => (
                <div 
                  key={bus.id} 
                  onClick={() => setSelectedBus(bus)}
                  className={`group relative bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl border border-white/30 ${
                    selectedBus?.id === bus.id 
                      ? 'ring-2 ring-green-500 shadow-2xl scale-[1.02]' 
                      : 'hover:bg-white/60'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-3 py-1.5 rounded-full font-bold text-sm flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        {bus.number}
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        bus.status === 'active' ? 'bg-green-100 text-green-700' :
                        bus.status === 'delayed' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {bus.status === 'active' ? 'Active' : bus.status === 'delayed' ? 'Delayed' : 'On-time'}
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getOccupancyColor(bus.occupancy || 'LOW')}`}>
                        {bus.occupancy}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent animate-pulse">
                        {bus.eta}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">Gov ETA</div>
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
                      <div className="flex items-center space-x-2">
                        {bus.speed && (
                          <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold">
                            {bus.speed} km/h
                          </div>
                        )}
                        <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          ₹{bus.fare}
                        </div>
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

          {/* Government Bus Details */}
          {selectedBus && (
            <div className="bg-gradient-to-br from-green-50/80 to-blue-50/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-green-600 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Government Bus {selectedBus.number} Details
                </h3>
                <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  Official TSRTC Data
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/30 shadow-sm">
                  <div className="text-sm text-green-600 mb-1">Vehicle ID</div>
                  <div className="font-semibold">{selectedBus.id}</div>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/30 shadow-sm">
                  <div className="text-sm text-green-600 mb-1">Vehicle Type</div>
                  <div className="font-semibold">{selectedBus.vehicleType}</div>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/30 shadow-sm">
                  <div className="text-sm text-green-600 mb-1">Current Speed</div>
                  <div className="font-semibold">{selectedBus.speed} km/h</div>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/30 shadow-sm">
                  <div className="text-sm text-green-600 mb-1">Occupancy</div>
                  <div className="font-semibold">{selectedBus.occupancy}</div>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/30 shadow-sm col-span-2">
                  <div className="text-sm text-green-600 mb-1">📍 Government GPS Location</div>
                  <div className="text-sm font-mono">
                    {selectedBus.location[0].toFixed(6)}, {selectedBus.location[1].toFixed(6)}
                  </div>
                  <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Official TSRTC tracking data
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LiveTrackingGov;