import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MapPin, Search, Navigation, Users, Clock, Zap } from 'lucide-react';
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
  passengers: number;
  speed: number;
  route: string;
  nextStop: string;
  eta: number;
}

const YatraMap = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [nearestStop, setNearestStop] = useState<string>('');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
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
    
    const interval = setInterval(() => {
      if (mapInstance.current) {
        fetchBuses();
      }
    }, 3000);
    
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
      }).setView([17.3850, 78.4867], 12);

    // Yellow themed map
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(mapInstance.current);

    // Add custom styles
    if (!document.querySelector('#yatra-map-styles')) {
      const style = document.createElement('style');
      style.id = 'yatra-map-styles';
      style.textContent = `
        .leaflet-container {
          background: #f9fafb !important;
        }
        .leaflet-popup-content-wrapper {
          background: white !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 8px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
        }
        .leaflet-popup-tip {
          background: white !important;
          border: 1px solid #e5e7eb !important;
        }
        .bus-marker { background: transparent !important; border: none !important; }
        .yatra-zoom-control {
          background: white !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 6px !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
        }
        .yatra-zoom-control button {
          background: white !important;
          border: none !important;
          color: #374151 !important;
          font-weight: 500 !important;
          width: 32px !important;
          height: 32px !important;
          cursor: pointer !important;
        }
        .yatra-zoom-control button:hover {
          background: #f3f4f6 !important;
        }
      `;
      document.head.appendChild(style);
    }

    // Custom zoom control
    const zoomControl = window.L.control({position: 'bottomright'});
    zoomControl.onAdd = function() {
      const div = window.L.DomUtil.create('div', 'yatra-zoom-control');
      div.innerHTML = `
        <button onclick="window.yatraMap.zoomIn()">+</button>
        <button onclick="window.yatraMap.zoomOut()">−</button>
      `;
      return div;
    };
    zoomControl.addTo(mapInstance.current);
    (window as any).yatraMap = mapInstance.current;
    
    console.log('Map initialized successfully');
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
        },
        (error) => console.log('Location error:', error)
      );
    }
  };

  const findNearestStop = (userCoords: [number, number]) => {
    const stops = [
      { name: 'Ameerpet Metro', coords: [17.4374, 78.4482] },
      { name: 'HITEC City', coords: [17.4485, 78.3684] },
      { name: 'Gachibowli', coords: [17.4399, 78.3648] },
      { name: 'Secunderabad', coords: [17.4399, 78.5014] },
      { name: 'JBS', coords: [17.3850, 78.4867] }
    ];
    
    let nearest = stops[0];
    let minDistance = getDistance(userCoords, nearest.coords as [number, number]);
    
    stops.forEach(stop => {
      const distance = getDistance(userCoords, stop.coords as [number, number]);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = stop;
      }
    });
    
    setNearestStop(nearest.name);
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
        passengers: Math.floor(Math.random() * 40) + 10,
        speed: Math.floor(Math.random() * 30) + 20,
        route: 'Secunderabad - Gachibowli',
        nextStop: 'Ameerpet',
        eta: Math.floor(Math.random() * 15) + 5
      },
      {
        id: '2', number: '290U',
        lat: 17.4485 + (Math.random() - 0.5) * 0.02,
        lng: 78.3684 + (Math.random() - 0.5) * 0.02,
        passengers: Math.floor(Math.random() * 35) + 15,
        speed: Math.floor(Math.random() * 35) + 25,
        route: 'JBS - Gachibowli Express',
        nextStop: 'HITEC City',
        eta: Math.floor(Math.random() * 12) + 3
      },
      {
        id: '3', number: '219',
        lat: 17.4374 + (Math.random() - 0.5) * 0.02,
        lng: 78.4482 + (Math.random() - 0.5) * 0.02,
        passengers: Math.floor(Math.random() * 45) + 5,
        speed: Math.floor(Math.random() * 25) + 15,
        route: 'JBS - Gachibowli',
        nextStop: 'Panjagutta',
        eta: Math.floor(Math.random() * 18) + 7
      },
      {
        id: '4', number: '251',
        lat: 17.3687 + (Math.random() - 0.5) * 0.02,
        lng: 78.5242 + (Math.random() - 0.5) * 0.02,
        passengers: Math.floor(Math.random() * 50) + 10,
        speed: Math.floor(Math.random() * 20) + 10,
        route: 'Secunderabad - Ibrahimpatnam',
        nextStop: 'LB Nagar',
        eta: Math.floor(Math.random() * 20) + 10
      },
      {
        id: '5', number: '10',
        lat: 17.4851 + (Math.random() - 0.5) * 0.02,
        lng: 78.4089 + (Math.random() - 0.5) * 0.02,
        passengers: Math.floor(Math.random() * 38) + 12,
        speed: Math.floor(Math.random() * 28) + 18,
        route: 'Secunderabad - Kukatpally',
        nextStop: 'Erragadda',
        eta: Math.floor(Math.random() * 14) + 6
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
            width: 28px; height: 28px; background: #1f2937; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            border: 2px solid white; position: relative;
          ">
            <span style="color: white; font-size: 14px;">🚌</span>
            <div style="
              position: absolute; top: -2px; right: -2px;
              width: 8px; height: 8px; background: #10b981;
              border-radius: 50%; border: 1px solid white;
            "></div>
          </div>
        `,
        iconSize: [36, 36],
        className: 'bus-marker'
      });

      try {
        const marker = window.L.marker([bus.lat, bus.lng], { icon: busIcon })
          .addTo(mapInstance.current)
        .bindPopup(`
          <div style="font-family: system-ui; color: #374151;">
            <div style="font-weight: 600; font-size: 14px; margin-bottom: 6px;">
              Bus ${bus.number}
            </div>
            <div style="font-size: 12px; margin-bottom: 6px; color: #6b7280;">
              ${bus.route}
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 11px; color: #6b7280;">
              <span>${bus.passengers} passengers</span>
              <span>${bus.speed} km/h</span>
            </div>
            <div style="
              background: #f3f4f6; padding: 4px 6px; border-radius: 4px;
              font-size: 11px; color: #374151;
            ">
              Next: ${bus.nextStop} (${bus.eta} min)
            </div>
          </div>
        `);

        marker.on('click', () => setSelectedBus(bus));
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
      busMarkers.current[bus.id]?.openPopup();
      toast({
        title: `Found Bus ${bus.number}`,
        description: bus.route
      });
    } else {
      toast({
        title: "No buses found",
        description: "Try searching with bus number or route",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="h-screen w-full bg-white">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-lg">🚌</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Yatra</h1>
            </div>
          </div>
          <div className="bg-gray-100 px-3 py-1 rounded-full">
            <div className="flex items-center text-gray-700 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              {buses.length} live
            </div>
          </div>
        </div>
      </div>

      {/* Nearest Stop & Search */}
      <div className="p-3 bg-gray-50 border-b">
        {nearestStop && (
          <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
            <span className="text-blue-700">📍 Nearest stop: {nearestStop}</span>
          </div>
        )}
        <div className="flex gap-2">
          <Input
            placeholder="Search bus number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchBus(searchQuery)}
            className="flex-1 text-sm"
          />
          <Button 
            onClick={() => searchBus(searchQuery)}
            size="sm"
            className="bg-gray-900 hover:bg-gray-800"
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Map */}
      <div className="relative flex-1">
        <div 
          ref={mapRef} 
          className="absolute inset-0" 
          style={{ minHeight: '400px', background: '#f9fafb' }}
        />
        
        {/* My Location Button */}
        <Button
          className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white border shadow-lg hover:bg-gray-50"
          onClick={() => {
            if (userLocation && mapInstance.current) {
              mapInstance.current.setView(userLocation, 15);
            } else {
              getUserLocation();
            }
          }}
        >
          <Navigation className="w-4 h-4 text-gray-700" />
        </Button>
      </div>

      {/* Selected Bus Info */}
      {selectedBus && (
        <Card className="absolute bottom-4 left-4 right-4 bg-white border shadow-lg">
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">Bus {selectedBus.number}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedBus(null)}
                className="text-gray-500 hover:bg-gray-100 h-6 w-6 p-0"
              >
                ✕
              </Button>
            </div>
            
            {/* ETA Countdown */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700">{selectedBus.eta} min</div>
                <div className="text-sm text-green-600">Bus arriving in {selectedBus.eta} minutes</div>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-2">{selectedBus.route}</p>
            <p className="text-gray-500 text-xs">Next: {selectedBus.nextStop}</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default YatraMap;