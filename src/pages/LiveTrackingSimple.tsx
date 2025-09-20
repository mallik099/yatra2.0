import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Clock, Users, Navigation, Wifi, WifiOff, ArrowLeft, RefreshCw, Locate } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Bus {
  id: string;
  number: string;
  route: string;
  eta: string;
  crowdLevel: 'Low' | 'Medium' | 'High';
  nextStop: string;
  lat: number;
  lng: number;
  speed: number;
  direction: number;
  lastUpdated: Date;
  capacity: number;
  occupancy: number;
}

interface BusStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  routes: string[];
}

const LiveTrackingSimple: React.FC = () => {
  const navigate = useNavigate();
  const [buses, setBuses] = useState<Bus[]>([]);
  const [busStops, setBusStops] = useState<BusStop[]>([]);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const busMarkersRef = useRef<{[key: string]: L.Marker}>({});

  useEffect(() => {
    const mockBuses: Bus[] = [
      {
        id: '1',
        number: '100K',
        route: 'Secunderabad ↔ Koti',
        eta: '3 mins',
        crowdLevel: 'Medium',
        nextStop: 'Paradise Circle'
      },
      {
        id: '2',
        number: '156',
        route: 'Mehdipatnam ↔ KPHB',
        eta: '7 mins',
        crowdLevel: 'High',
        nextStop: 'Ameerpet Metro'
      },
      {
        id: '3',
        number: '290U',
        route: 'LB Nagar ↔ Gachibowli',
        eta: '5 mins',
        crowdLevel: 'Low',
        nextStop: 'Dilsukhnagar'
      },
      {
        id: '4',
        number: '218',
        route: 'Ameerpet ↔ Uppal',
        eta: '12 mins',
        crowdLevel: 'Medium',
        nextStop: 'Tarnaka'
      },
      {
        id: '5',
        number: '5K',
        route: 'Secunderabad ↔ Afzalgunj',
        eta: '2 mins',
        crowdLevel: 'High',
        nextStop: 'Clock Tower'
      },
      {
        id: '6',
        number: '49M',
        route: 'Mehdipatnam ↔ Secunderabad',
        eta: '15 mins',
        crowdLevel: 'Low',
        nextStop: 'Lakdi Ka Pul'
      },
      {
        id: '7',
        number: '10H',
        route: 'Imlibun ↔ Jubilee Hills',
        eta: '9 mins',
        crowdLevel: 'Medium',
        nextStop: 'Panjagutta'
      },
      {
        id: '8',
        number: '72',
        route: 'Charminar ↔ Kondapur',
        eta: '6 mins',
        crowdLevel: 'High',
        nextStop: 'Hi-Tech City'
      }
    ];

    setBuses(mockBuses);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setBuses(prev => prev.map(bus => {
        const currentEta = parseInt(bus.eta);
        const newEta = currentEta > 1 ? currentEta - 1 : Math.floor(Math.random() * 15) + 2;
        const crowdLevels: ('Low' | 'Medium' | 'High')[] = ['Low', 'Medium', 'High'];
        const newCrowd = Math.random() > 0.8 ? crowdLevels[Math.floor(Math.random() * 3)] : bus.crowdLevel;
        
        return {
          ...bus,
          eta: newEta + ' mins',
          crowdLevel: newCrowd
        };
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
          <Wifi className="w-4 h-4" />
          <span className="text-sm">Live</span>
        </div>
      </div>

      {/* Live Map */}
      <div className="h-64 sm:h-80 bg-gray-900 relative overflow-hidden">
        {/* OpenStreetMap Style Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100">
          {/* Map Tiles Pattern */}
          <div className="absolute inset-0 opacity-40">
            <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
              {Array.from({ length: 48 }, (_, i) => (
                <div key={i} className={`border border-gray-300 ${
                  Math.random() > 0.7 ? 'bg-green-200' : 
                  Math.random() > 0.5 ? 'bg-blue-100' : 'bg-gray-50'
                }`}></div>
              ))}
            </div>
          </div>
          
          {/* Street Network */}
          <svg className="absolute inset-0 w-full h-full">
            {/* Main Roads */}
            <path d="M0,80 Q160,60 320,80 T640,80" stroke="#fbbf24" strokeWidth="3" fill="none" opacity="0.8"/>
            <path d="M0,160 L640,160" stroke="#fbbf24" strokeWidth="3" fill="none" opacity="0.8"/>
            <path d="M0,240 Q160,220 320,240 T640,240" stroke="#fbbf24" strokeWidth="3" fill="none" opacity="0.8"/>
            
            {/* Cross Streets */}
            <path d="M160,0 L160,320" stroke="#f59e0b" strokeWidth="2" fill="none" opacity="0.6"/>
            <path d="M320,0 L320,320" stroke="#f59e0b" strokeWidth="2" fill="none" opacity="0.6"/>
            <path d="M480,0 L480,320" stroke="#f59e0b" strokeWidth="2" fill="none" opacity="0.6"/>
            
            {/* Landmarks */}
            <circle cx="160" cy="80" r="8" fill="#dc2626" opacity="0.7"/>
            <text x="170" y="85" fontSize="10" fill="#dc2626" className="font-bold">Secunderabad</text>
            
            <circle cx="320" cy="160" r="8" fill="#dc2626" opacity="0.7"/>
            <text x="330" y="165" fontSize="10" fill="#dc2626" className="font-bold">Ameerpet</text>
            
            <circle cx="480" cy="240" r="8" fill="#dc2626" opacity="0.7"/>
            <text x="490" y="245" fontSize="10" fill="#dc2626" className="font-bold">Gachibowli</text>
          </svg>
        </div>
        
        {/* Live Status */}
        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
          🔴 LIVE
        </div>
        
        {/* Bus Markers */}
        {buses.map((bus, index) => {
          const positions = [
            { left: '25%', top: '25%' },
            { left: '50%', top: '50%' },
            { left: '75%', top: '75%' },
            { left: '40%', top: '30%' },
            { left: '60%', top: '40%' },
            { left: '30%', top: '60%' },
            { left: '70%', top: '35%' },
            { left: '45%', top: '65%' }
          ];
          const pos = positions[index % positions.length];
          
          return (
            <div
              key={bus.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110"
              style={{ left: pos.left, top: pos.top }}
              onClick={() => setSelectedBus(bus)}
            >
              <div className={`relative w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg border-2 border-white ${
                bus.crowdLevel === 'Low' ? 'bg-green-500' :
                bus.crowdLevel === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
              }`}>
                🚌
                {/* Moving indicator */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>
              </div>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                {bus.number} - {bus.eta}
              </div>
              {selectedBus?.id === bus.id && (
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-teal-600 text-white px-3 py-1 rounded-lg text-xs whitespace-nowrap">
                  Next: {bus.nextStop}
                </div>
              )}
            </div>
          );
        })}
        
        {/* Map Controls */}
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-2">
          <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium">
            🗺️ OpenStreetMap
          </button>
        </div>
        
        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-95 backdrop-blur-sm p-3 rounded-lg shadow-lg border">
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
              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
              <span>Major Stops</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-4 grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-3 text-center shadow-sm">
          <div className="text-2xl font-bold text-teal-600">{buses.length}</div>
          <div className="text-xs text-gray-500">Active Buses</div>
        </div>
        <div className="bg-white rounded-xl p-3 text-center shadow-sm">
          <div className="text-2xl font-bold text-green-600">{buses.filter(b => b.crowdLevel === 'Low').length}</div>
          <div className="text-xs text-gray-500">Low Crowd</div>
        </div>
        <div className="bg-white rounded-xl p-3 text-center shadow-sm">
          <div className="text-2xl font-bold text-blue-600">{Math.min(...buses.map(b => parseInt(b.eta)))}</div>
          <div className="text-xs text-gray-500">Min ETA (mins)</div>
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
        
        {buses.slice(0, 6).map((bus) => (
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
                  <span>{bus.eta}</span>
                </div>
                <p className="text-xs text-gray-500">ETA</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Navigation className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 truncate">Next: {bus.nextStop}</span>
              </div>
              
              <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getCrowdColor(bus.crowdLevel)}`}>
                <span>{getCrowdIcon(bus.crowdLevel)}</span>
                <span>{bus.crowdLevel}</span>
              </div>
            </div>

            {selectedBus?.id === bus.id && (
              <div className="mt-3 pt-3 border-t border-gray-200 animate-fadeIn">
                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div>
                    <p className="text-gray-500">Next Stop</p>
                    <p className="font-medium">{bus.nextStop}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Crowd Level</p>
                    <p className="font-medium">{bus.crowdLevel}</p>
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
        
        {buses.length > 6 && (
          <div className="text-center py-4">
            <button className="text-teal-600 font-medium text-sm">
              View {buses.length - 6} More Buses →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveTrackingSimple;