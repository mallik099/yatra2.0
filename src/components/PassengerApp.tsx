import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MapPin, Search, Navigation, Clock, Bell, Settings, User, ChevronUp, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window {
    L: any;
  }
}

interface Bus {
  id: string;
  number: string;
  lat: number;
  lng: number;
  eta: number;
  route: string;
  nextStop: string;
  stopsAway: number;
}

interface BusStop {
  name: string;
  coords: [number, number];
  buses: { number: string; eta: number }[];
}

const PassengerApp = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [nearestStop, setNearestStop] = useState<string>('');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [bottomSheetExpanded, setBottomSheetExpanded] = useState(false);
  const [currentView, setCurrentView] = useState<'map' | 'search' | 'stops' | 'settings'>('map');
  const [nearbyStops, setNearbyStops] = useState<BusStop[]>([]);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const busMarkers = useRef<{ [key: string]: any }>({});
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      initMap();
      fetchBuses();
      getUserLocation();
    }, 100);
    
    const interval = setInterval(fetchBuses, 3000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  const initMap = () => {
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    if (!window.L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = createMap;
      document.head.appendChild(script);
    } else {
      createMap();
    }
  };

  const createMap = () => {
    if (!mapRef.current || mapInstance.current || !window.L) return;

    try {
      mapInstance.current = window.L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([17.3850, 78.4867], 13);

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(mapInstance.current);

      if (!document.querySelector('#rapido-map-styles')) {
        const style = document.createElement('style');
        style.id = 'rapido-map-styles';
        style.textContent = `
          .leaflet-container { background: #f8fafc !important; }
          .leaflet-popup-content-wrapper { 
            background: white !important; border: none !important; border-radius: 12px !important; 
            box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important;
          }
          .bus-marker { background: transparent !important; border: none !important; }
          .user-marker { background: transparent !important; border: none !important; }
        `;
        document.head.appendChild(style);
      }
    } catch (error) {
      console.error('Map creation error:', error);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
          setUserLocation(coords);
          findNearestStop(coords);
          addUserMarker(coords);
        },
        (error) => console.log('Location error:', error)
      );
    }
  };

  const addUserMarker = (coords: [number, number]) => {
    if (!mapInstance.current || !window.L) return;
    
    const userIcon = window.L.divIcon({
      html: `<div style="
        width: 16px; height: 16px; background: #3b82f6; border: 3px solid white;
        border-radius: 50%; box-shadow: 0 2px 8px rgba(59,130,246,0.4);
      "></div>`,
      iconSize: [16, 16],
      className: 'user-marker'
    });
    
    window.L.marker(coords, { icon: userIcon }).addTo(mapInstance.current);
  };

  const findNearestStop = (userCoords: [number, number]) => {
    const stops: BusStop[] = [
      { 
        name: 'Ameerpet Metro', 
        coords: [17.4374, 78.4482],
        buses: [{ number: '218', eta: 6 }, { number: '219', eta: 12 }]
      },
      { 
        name: 'HITEC City', 
        coords: [17.4485, 78.3684],
        buses: [{ number: '290U', eta: 4 }, { number: '218', eta: 8 }]
      },
      { 
        name: 'Gachibowli', 
        coords: [17.4399, 78.3648],
        buses: [{ number: '218', eta: 15 }, { number: '290U', eta: 10 }]
      },
      { 
        name: 'Secunderabad', 
        coords: [17.4399, 78.5014],
        buses: [{ number: '218', eta: 5 }, { number: '10', eta: 7 }]
      }
    ];
    
    let nearest = stops[0];
    let minDistance = getDistance(userCoords, nearest.coords);
    
    stops.forEach(stop => {
      const distance = getDistance(userCoords, stop.coords);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = stop;
      }
    });
    
    setNearestStop(nearest.name);
    setNearbyStops(stops.slice(0, 3));
  };

  const getDistance = (coord1: [number, number], coord2: [number, number]) => {
    const [lat1, lng1] = coord1;
    const [lat2, lng2] = coord2;
    return Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lng2 - lng1, 2));
  };

  const fetchBuses = () => {
    const hyderabadBuses: Bus[] = [
      {
        id: '1', number: '218', 
        lat: 17.4399 + (Math.random() - 0.5) * 0.02,
        lng: 78.5014 + (Math.random() - 0.5) * 0.02,
        eta: Math.floor(Math.random() * 15) + 3,
        route: 'Secunderabad → Gachibowli',
        nextStop: 'Ameerpet',
        stopsAway: Math.floor(Math.random() * 5) + 1
      },
      {
        id: '2', number: '290U',
        lat: 17.4485 + (Math.random() - 0.5) * 0.02,
        lng: 78.3684 + (Math.random() - 0.5) * 0.02,
        eta: Math.floor(Math.random() * 12) + 2,
        route: 'JBS → Gachibowli Express',
        nextStop: 'HITEC City',
        stopsAway: Math.floor(Math.random() * 3) + 1
      },
      {
        id: '3', number: '219',
        lat: 17.4374 + (Math.random() - 0.5) * 0.02,
        lng: 78.4482 + (Math.random() - 0.5) * 0.02,
        eta: Math.floor(Math.random() * 18) + 5,
        route: 'JBS → Gachibowli',
        nextStop: 'Panjagutta',
        stopsAway: Math.floor(Math.random() * 4) + 2
      }
    ];

    setBuses(hyderabadBuses);
    updateBusMarkers(hyderabadBuses);
  };

  const updateBusMarkers = (buses: Bus[]) => {
    if (!mapInstance.current || !window.L) return;

    Object.values(busMarkers.current).forEach(marker => {
      mapInstance.current.removeLayer(marker);
    });
    busMarkers.current = {};

    buses.forEach(bus => {
      const busIcon = window.L.divIcon({
        html: `
          <div style="
            width: 32px; height: 32px; background: #10b981; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 3px 12px rgba(16,185,129,0.4);
            border: 2px solid white; position: relative;
          ">
            <span style="color: white; font-size: 14px;">🚌</span>
            <div style="
              position: absolute; top: -2px; right: -2px;
              width: 8px; height: 8px; background: #3b82f6;
              border-radius: 50%; border: 1px solid white;
            "></div>
          </div>
        `,
        iconSize: [32, 32],
        className: 'bus-marker'
      });

      try {
        const marker = window.L.marker([bus.lat, bus.lng], { icon: busIcon })
          .addTo(mapInstance.current);
        
        marker.on('click', () => {
          setSelectedBus(bus);
          setBottomSheetExpanded(true);
        });
        busMarkers.current[bus.id] = marker;
      } catch (error) {
        console.error('Marker creation error:', error);
      }
    });
  };

  const searchBus = (query: string) => {
    const filtered = buses.filter(bus => 
      bus.number.includes(query) || 
      bus.route.toLowerCase().includes(query.toLowerCase())
    );
    
    if (filtered.length > 0) {
      const bus = filtered[0];
      mapInstance.current?.setView([bus.lat, bus.lng], 15);
      setSelectedBus(bus);
      setBottomSheetExpanded(true);
    }
  };

  const renderMapView = () => (
    <div className="h-screen w-full bg-white relative">
      {/* Top Search Bar */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="bg-white rounded-full shadow-lg border p-2">
          <div className="flex items-center">
            <Search className="w-5 h-5 text-gray-400 ml-2" />
            <Input
              placeholder="Search bus number or route..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchBus(searchQuery)}
              className="border-none bg-transparent text-sm"
            />
          </div>
        </div>
      </div>

      {/* Map */}
      <div ref={mapRef} className="absolute inset-0" style={{ background: '#f8fafc' }} />

      {/* My Location Button */}
      <Button
        className="absolute bottom-32 right-4 w-12 h-12 rounded-full bg-white border shadow-lg hover:bg-gray-50"
        onClick={() => {
          if (userLocation && mapInstance.current) {
            mapInstance.current.setView(userLocation, 15);
          } else {
            getUserLocation();
          }
        }}
      >
        <Navigation className="w-5 h-5 text-gray-700" />
      </Button>

      {/* Bottom Sheet */}
      <div className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl transition-all duration-300 ${
        bottomSheetExpanded ? 'h-80' : 'h-24'
      }`}>
        <div className="p-4">
          {/* Handle */}
          <div 
            className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4 cursor-pointer"
            onClick={() => setBottomSheetExpanded(!bottomSheetExpanded)}
          />
          
          {selectedBus ? (
            <div>
              {/* Collapsed View */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 font-bold">#{selectedBus.number}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      Bus #{selectedBus.number} → Arriving in {selectedBus.eta} min
                    </div>
                    <div className="text-sm text-gray-600">
                      {selectedBus.stopsAway} stops away
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setBottomSheetExpanded(!bottomSheetExpanded)}
                >
                  {bottomSheetExpanded ? <ChevronDown /> : <ChevronUp />}
                </Button>
              </div>

              {/* Expanded View */}
              {bottomSheetExpanded && (
                <div className="mt-4 space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-700">{selectedBus.eta} min</div>
                      <div className="text-sm text-green-600">Estimated arrival time</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Route:</span>
                      <span className="font-medium">{selectedBus.route}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Next Stop:</span>
                      <span className="font-medium">{selectedBus.nextStop}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Stops Away:</span>
                      <span className="font-medium">{selectedBus.stopsAway}</span>
                    </div>
                  </div>

                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <Bell className="w-4 h-4 mr-2" />
                    Notify When Close
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center">
              <div className="text-gray-500 mb-2">Select a bus to see details</div>
              {nearestStop && (
                <div className="text-sm text-blue-600">📍 Nearest stop: {nearestStop}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderSearchView = () => (
    <div className="h-screen bg-gray-50 p-4">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Search Routes</h2>
        <Input
          placeholder="Enter bus number or destination..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4"
        />
      </div>

      <div className="space-y-3">
        {buses.map(bus => (
          <Card key={bus.id} className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => {
                  setSelectedBus(bus);
                  setCurrentView('map');
                  setBottomSheetExpanded(true);
                }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 font-bold">#{bus.number}</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{bus.route}</div>
                  <div className="text-sm text-gray-600">Next: {bus.nextStop}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">{bus.eta} min</div>
                <div className="text-xs text-gray-500">{bus.stopsAway} stops</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderStopsView = () => (
    <div className="h-screen bg-gray-50 p-4">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Nearby Stops</h2>
        <p className="text-gray-600 text-sm">Based on your current location</p>
      </div>

      <div className="space-y-4">
        {nearbyStops.map((stop, index) => (
          <Card key={index} className="p-4">
            <div className="mb-3">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                {stop.name}
              </h3>
            </div>
            <div className="space-y-2">
              {stop.buses.map((bus, busIndex) => (
                <div key={busIndex} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                      <span className="text-green-600 font-bold text-xs">#{bus.number}</span>
                    </div>
                    <span className="text-sm font-medium">Bus {bus.number}</span>
                  </div>
                  <div className="text-sm font-bold text-green-600">{bus.eta} min</div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSettingsView = () => (
    <div className="h-screen bg-gray-50 p-4">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Settings</h2>
      </div>

      <div className="space-y-4">
        <Card className="p-4">
          <div className="flex items-center">
            <User className="w-5 h-5 text-gray-600 mr-3" />
            <div>
              <div className="font-medium">Profile</div>
              <div className="text-sm text-gray-600">Manage your account</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <Bell className="w-5 h-5 text-gray-600 mr-3" />
            <div>
              <div className="font-medium">Notifications</div>
              <div className="text-sm text-gray-600">Bus alerts and updates</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <Settings className="w-5 h-5 text-gray-600 mr-3" />
            <div>
              <div className="font-medium">Language</div>
              <div className="text-sm text-gray-600">English</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="relative">
      {currentView === 'map' && renderMapView()}
      {currentView === 'search' && renderSearchView()}
      {currentView === 'stops' && renderStopsView()}
      {currentView === 'settings' && renderSettingsView()}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
        <div className="flex justify-around">
          <Button
            variant={currentView === 'map' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentView('map')}
            className="flex-col h-12"
          >
            <MapPin className="w-4 h-4 mb-1" />
            <span className="text-xs">Map</span>
          </Button>
          <Button
            variant={currentView === 'search' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentView('search')}
            className="flex-col h-12"
          >
            <Search className="w-4 h-4 mb-1" />
            <span className="text-xs">Search</span>
          </Button>
          <Button
            variant={currentView === 'stops' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentView('stops')}
            className="flex-col h-12"
          >
            <Clock className="w-4 h-4 mb-1" />
            <span className="text-xs">Stops</span>
          </Button>
          <Button
            variant={currentView === 'settings' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentView('settings')}
            className="flex-col h-12"
          >
            <Settings className="w-4 h-4 mb-1" />
            <span className="text-xs">Settings</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PassengerApp;