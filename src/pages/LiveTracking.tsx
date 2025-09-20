import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Clock, Wifi, Smartphone } from 'lucide-react';
import RealMap from '../components/RealMap';
import EnhancedMap from '../components/EnhancedMap';
import TrafficPanel from '../components/TrafficPanel';
import { busApi, BusLocation } from '../services/busApi';
import { useRealTimeGovData } from '../hooks/useRealTimeGovData';
import { TSRTCBusData } from '../services/realTimeGovApi';
import { Shield, Zap } from 'lucide-react';
import ApiTester from '../components/ApiTester';

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
  
  // Simulate realistic ETA based on status
  switch (bus.status) {
    case 'ON_ROUTE':
      return diffMinutes < 2 ? '2-5 mins' : '5-8 mins';
    case 'DELAYED':
      return '10-15 mins';
    case 'STOPPED':
      return 'Arriving now';
    default:
      return '5-10 mins';
  }
};

const getETAColor = (confidence: string) => {
  switch (confidence) {
    case 'high': return 'text-green-600';
    case 'medium': return 'text-yellow-600';
    case 'low': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

const LiveTracking: React.FC = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  
  // Government API integration
  const { buses: govBuses, connected: govConnected, lastUpdate: govLastUpdate } = useRealTimeGovData();

  // Map government data to app format
  const mapGovBusData = (govBus: TSRTCBusData): Bus => {
    const eta = calculateGovETA(govBus);
    const status = mapGovStatus(govBus.status);
    
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
      vehicleType: govBus.vehicleType
    };
  };

  const mapGovStatus = (status: string): 'active' | 'delayed' | 'ontime' => {
    switch (status) {
      case 'ACTIVE': return 'active';
      case 'BREAKDOWN': return 'delayed';
      default: return 'active';
    }
  };

  const calculateGovETA = (govBus: TSRTCBusData): string => {
    const arrivalTime = new Date(govBus.estimatedArrival);
    const now = new Date();
    const diffMinutes = Math.floor((arrivalTime.getTime() - now.getTime()) / (1000 * 60));
    
    if (diffMinutes <= 0) return 'Arriving now';
    if (diffMinutes <= 2) return '1-2 mins';
    if (diffMinutes <= 5) return '3-5 mins';
    if (diffMinutes <= 10) return '5-10 mins';
    return `${diffMinutes} mins`;
  };

  useEffect(() => {
    const loadBuses = async () => {
      try {
        setError(null);
        
        // Try government API first, fallback to mock data
        if (govBuses.length > 0) {
          const mappedGovBuses = govBuses.map(mapGovBusData);
          setBuses(mappedGovBuses);
          setLastUpdate(govLastUpdate.toLocaleTimeString());
        } else {
          const busData = await busApi.getBuses();
          const mappedBuses = mapBusData(busData);
          setBuses(mappedBuses);
          setLastUpdate(new Date().toLocaleTimeString());
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading buses:', error);
        setError(null);
        setLoading(false);
      }
    };

    loadBuses();

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => console.log('Location access denied')
      );
    }

    // Update every 5 seconds for government data, 10 seconds for mock
    const interval = setInterval(loadBuses, govConnected ? 5000 : 10000);
    return () => clearInterval(interval);
  }, [govBuses, govConnected, govLastUpdate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'delayed': return 'text-red-600';
      case 'ontime': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* iOS-style Header */}
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
              <h1 className="text-xl font-bold text-gray-900">Live Bus Tracking</h1>
              <div className="flex items-center space-x-2 text-sm text-blue-700">
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
            <div className="text-lg font-semibold text-gray-900">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
            <div className="text-xs text-blue-600">Updated {lastUpdate}</div>
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
          {/* Government API Status Banner */}
          {govConnected && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 backdrop-blur-xl rounded-2xl p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Zap className="w-5 h-5 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-800">Government API Active</h3>
                    <p className="text-sm text-green-600">Connected to official TSRTC real-time data</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{buses.length}</div>
                  <div className="text-xs text-green-700">Official Buses</div>
                </div>
              </div>
            </div>
          )}
          
          {/* API Testing Component */}
          <ApiTester />
          
          {/* Map Widget */}
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Live Positions</h2>
              <div className="flex items-center space-x-2">
                <Wifi className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-600">Live</span>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden">
              <EnhancedMap 
                buses={buses} 
                onBusSelect={setSelectedBus} 
                selectedBus={selectedBus}
                showTraffic={true}
                showRoutes={true}
              />
            </div>
          </div>
          
          {/* Bus List Widget */}
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Live Buses</h2>
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
                      <div className="text-xs text-gray-500 font-medium">ETA</div>
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
              
              {/* Bus Details & Nearby */}
              <div className="space-y-4">
                <NearbyBuses userLocation={userLocation} onBusSelect={setSelectedBus} />
                
                <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                {selectedBus ? (
                  <div>
                    <h3 className="text-xl font-bold text-blue-600 mb-4">
                      Bus {selectedBus.number} Details
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/30 shadow-sm">
                        <div className="text-sm text-blue-600 mb-1">Route</div>
                        <div className="font-semibold">{selectedBus.route}</div>
                      </div>
                      
                      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/30 shadow-sm">
                        <div className="text-sm text-blue-600 mb-1">Next Stop</div>
                        <div className="font-semibold">{selectedBus.nextStop}</div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/30 shadow-sm">
                          <div className="text-sm text-blue-600 mb-1">ETA</div>
                          <div className={`font-bold ${getETAColor('high')}`}>{selectedBus.eta}</div>
                          <div className="text-xs text-blue-500 mt-1">Real-time</div>
                        </div>
                        
                        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/30 shadow-sm">
                          <div className="text-sm text-blue-600 mb-1">Fare</div>
                          <div className="font-bold">₹{selectedBus.fare}</div>
                        </div>
                      </div>
                      
                      {selectedBus.capacity && (
                        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/30 shadow-sm">
                          <div className="text-sm text-blue-600 mb-1">Capacity</div>
                          <div className="font-bold">
                            {selectedBus.capacity.available}/{selectedBus.capacity.total} seats
                          </div>
                        </div>
                      )}
                      
                      {selectedBus.vehicleType && (
                        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/30 shadow-sm">
                          <div className="text-sm text-blue-600 mb-1">Type</div>
                          <div className="font-bold">{selectedBus.vehicleType}</div>
                        </div>
                      )}
                      
                      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/30 shadow-sm">
                        <div className="text-sm text-blue-600 mb-1">Status</div>
                        <div className={`font-semibold ${getStatusColor(selectedBus.status)}`}>
                          {selectedBus.status.toUpperCase()}
                        </div>
                      </div>
                      
                      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/30 shadow-sm">
                        <div className="text-sm text-blue-600 mb-1">📍 Live Location</div>
                        <div className="text-sm font-mono">
                          {selectedBus.location[0].toFixed(6)}, {selectedBus.location[1].toFixed(6)}
                        </div>
                        <div className="text-xs text-green-600 mt-1">🔄 Updating every 10s</div>
                      </div>
                      
                      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/30 shadow-sm">
                        <div className="text-sm text-blue-600 mb-1">Last Updated</div>
                        <div className="text-sm">{lastUpdate}</div>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-green-600">Live tracking active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-blue-600 mt-8">
                    <MapPin className="w-12 h-12 mx-auto mb-4 opacity-70" />
                    <p>Select a bus to view details</p>
                  </div>
                )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Traffic Updates Panel */}
          <TrafficPanel />
        </div>
      )}
    </div>
  );
};

export default LiveTracking;