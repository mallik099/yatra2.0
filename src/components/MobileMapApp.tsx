import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Navigation, Search, Menu, X, Clock, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mobileBusService, type MobileBus } from '@/services/mobileBusService';

declare global {
  interface Window {
    L: any;
  }
}

const MobileMapApp = () => {
  const [buses, setBuses] = useState<MobileBus[]>([]);
  const [selectedBus, setSelectedBus] = useState<MobileBus | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const busMarkers = useRef<{ [key: string]: any }>({});
  const { toast } = useToast();

  // Initialize map on component mount
  useEffect(() => {
    initializeMap();
    getUserLocation();
    fetchBuses();
    
    // Update buses every 3 seconds
    const interval = setInterval(fetchBuses, 3000);
    return () => clearInterval(interval);
  }, []);

  const initializeMap = () => {
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
    if (!mapRef.current || mapInstance.current) return;

    mapInstance.current = window.L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false
    }).setView([17.3850, 78.4867], 13);

    // Google Maps style tiles
    window.L.tileLayer('https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }).addTo(mapInstance.current);

    // Add mobile-friendly styles
    if (!document.querySelector('#mobile-map-styles')) {
      const style = document.createElement('style');
      style.id = 'mobile-map-styles';
      style.textContent = `
        .leaflet-container { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .leaflet-popup-content-wrapper { border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); }
        .leaflet-popup-content { margin: 12px; font-size: 14px; }
        .bus-marker { background: transparent !important; border: none !important; }
        .user-marker { background: transparent !important; border: none !important; }
      `;
      document.head.appendChild(style);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
          setUserLocation(coords);
          
          if (mapInstance.current) {
            // Add user location marker
            const userIcon = window.L.divIcon({
              html: `<div style="
                width: 20px; height: 20px; background: #4285f4; border: 3px solid white;
                border-radius: 50%; box-shadow: 0 2px 8px rgba(66,133,244,0.4);
              "></div>`,
              iconSize: [20, 20],
              className: 'user-marker'
            });
            
            window.L.marker(coords, { icon: userIcon })
              .addTo(mapInstance.current)
              .bindPopup('Your Location');
          }
        },
        (error) => console.log('Location error:', error)
      );
    }
  };

  const fetchBuses = async () => {
    try {
      const liveBuses = await mobileBusService.getAllBuses();
      setBuses(liveBuses);
      updateBusMarkers(liveBuses);
    } catch (error) {
      console.error('Error fetching buses:', error);
    }
  };

  const updateBusMarkers = (buses: MobileBus[]) => {
    if (!mapInstance.current) return;

    // Clear existing markers
    Object.values(busMarkers.current).forEach(marker => {
      mapInstance.current.removeLayer(marker);
    });
    busMarkers.current = {};

    // Add new markers
    buses.forEach(bus => {
      const statusColor = bus.status === 'active' ? '#34a853' : bus.status === 'delayed' ? '#fbbc04' : '#ea4335';
      const busIcon = window.L.divIcon({
        html: `
          <div style="position: relative;">
            <div style="
              width: 32px; height: 32px; background: ${statusColor}; border-radius: 50%;
              display: flex; align-items: center; justify-content: center;
              box-shadow: 0 2px 8px rgba(52,168,83,0.4); border: 2px solid white;
              transform: rotate(${bus.direction}deg);
            ">
              <span style="color: white; font-size: 16px;">🚌</span>
            </div>
            <div style="
              position: absolute; top: -4px; right: -4px; width: 12px; height: 12px;
              background: #4285f4; border-radius: 50%; border: 2px solid white;
              animation: pulse 2s infinite;
            "></div>
          </div>
        `,
        iconSize: [32, 32],
        className: 'bus-marker'
      });

      const marker = window.L.marker([bus.lat, bus.lng], { icon: busIcon })
        .addTo(mapInstance.current)
        .bindPopup(`
          <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
            <div style="font-weight: 600; margin-bottom: 8px;">Bus ${bus.number}</div>
            <div style="font-size: 12px; color: #666; margin-bottom: 4px;">${bus.route}</div>
            <div style="display: flex; justify-content: space-between; font-size: 12px;">
              <span>👥 ${bus.passengers}</span>
              <span>⚡ ${bus.speed} km/h</span>
            </div>
            <div style="margin-top: 8px; padding: 4px 8px; background: #e8f5e8; border-radius: 4px; font-size: 11px;">
              Next: ${bus.nextStop} (${bus.eta} min)
            </div>
          </div>
        `);

      marker.on('click', () => setSelectedBus(bus));
      busMarkers.current[bus.id] = marker;
    });
  };

  const searchBus = async (query: string) => {
    try {
      const filtered = await mobileBusService.searchBuses(query);
      if (filtered.length > 0) {
        const bus = filtered[0];
        mapInstance.current?.setView([bus.lat, bus.lng], 16);
        setSelectedBus(bus);
        busMarkers.current[bus.id]?.openPopup();
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  return (
    <div className="h-screen w-full relative bg-white">
      {/* Map Container */}
      <div ref={mapRef} className="absolute inset-0 z-0" />

      {/* Top Search Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center p-4">
          {!showSearch ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSearch(true)}
                className="flex-1 justify-start text-gray-600 bg-gray-100"
              >
                <Search className="w-4 h-4 mr-2" />
                Search buses, routes...
              </Button>
              <Button variant="ghost" size="sm" className="ml-2">
                <Menu className="w-5 h-5" />
              </Button>
            </>
          ) : (
            <div className="flex items-center w-full">
              <Input
                placeholder="Enter bus number or route..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchBus(searchQuery)}
                className="flex-1 border-none bg-transparent"
                autoFocus
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowSearch(false);
                  setSearchQuery('');
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Live Buses Counter */}
      <div className="absolute top-20 left-4 z-10 bg-white/95 backdrop-blur-sm rounded-full px-3 py-2 shadow-sm border border-gray-200">
        <div className="flex items-center text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
          <span className="font-medium">{buses.length} buses live</span>
        </div>
      </div>

      {/* My Location Button */}
      <div className="absolute bottom-24 right-4 z-10">
        <Button
          size="sm"
          className="w-12 h-12 rounded-full bg-white text-gray-700 shadow-lg border border-gray-200 hover:bg-gray-50"
          onClick={() => {
            if (userLocation && mapInstance.current) {
              mapInstance.current.setView(userLocation, 15);
            } else {
              getUserLocation();
            }
          }}
        >
          <Navigation className="w-5 h-5" />
        </Button>
      </div>

      {/* Bottom Sheet - Selected Bus */}
      {selectedBus && (
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-white rounded-t-3xl shadow-2xl border-t border-gray-200 transform transition-transform duration-300">
          <div className="p-4">
            {/* Handle */}
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
            
            {/* Bus Info */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold">Bus {selectedBus.number}</h3>
                <p className="text-gray-600 text-sm">{selectedBus.route}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedBus(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-blue-50 rounded-xl">
                <div className="text-lg font-bold text-blue-600">{selectedBus.speed}</div>
                <div className="text-xs text-gray-600">km/h</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-xl">
                <div className="text-lg font-bold text-green-600">{selectedBus.passengers}</div>
                <div className="text-xs text-gray-600">passengers</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-xl">
                <div className="text-lg font-bold text-orange-600">{selectedBus.eta}</div>
                <div className="text-xs text-gray-600">min ETA</div>
              </div>
            </div>

            {/* Next Stop */}
            <div className="bg-gray-50 rounded-xl p-3 mb-4">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                <div>
                  <div className="font-medium">Next Stop</div>
                  <div className="text-sm text-gray-600">{selectedBus.nextStop}</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                Track This Bus
              </Button>
              <Button variant="outline" className="flex-1">
                Get Directions
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Search Results */}
      {showSearch && searchQuery && (
        <div className="absolute top-16 left-4 right-4 z-10 bg-white rounded-xl shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
          {buses
            .filter(bus => 
              bus.number.includes(searchQuery) || 
              bus.route.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map(bus => (
              <div
                key={bus.id}
                className="p-3 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50"
                onClick={async () => {
                  await searchBus(bus.number);
                  setShowSearch(false);
                  setSearchQuery('');
                }}
              >
                <div className="font-medium">Bus {bus.number}</div>
                <div className="text-sm text-gray-600">{bus.route}</div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default MobileMapApp;