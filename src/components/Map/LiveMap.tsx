import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, RefreshCw } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = '6f29c1730f38480781df0b18a3214140';
mapboxgl.accessToken = MAPBOX_TOKEN;

interface Bus {
  busNumber: string;
  route: string;
  currentLocation: { lat: number; lng: number };
  currentPassengers: number;
  capacity: number;
  status: string;
}

const LiveMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [selectedBus, setSelectedBus] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [78.4867, 17.3850], // Hyderabad, Telangana
      zoom: 11
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true
    }), 'top-right');

    fetchBuses();
    const interval = setInterval(fetchBuses, 30000);

    return () => {
      clearInterval(interval);
      clearMarkers();
      map.current?.remove();
    };
  }, []);

  const clearMarkers = () => {
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
  };

  const fetchBuses = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3002/api/buses');
      if (response.ok) {
        const data = await response.json();
        setBuses(data);
        updateBusMarkers(data);
      }
    } catch (error) {
      console.error('Error fetching buses:', error);
      // Fallback to mock data for Telangana
      const mockBuses = [
        {
          busNumber: 'TS07UA1234',
          route: 'Secunderabad - Gachibowli',
          currentLocation: { lat: 17.4399, lng: 78.5014 },
          currentPassengers: 32,
          capacity: 50,
          status: 'active'
        },
        {
          busNumber: 'TS09UB5678',
          route: 'Kukatpally - Dilsukhnagar',
          currentLocation: { lat: 17.4851, lng: 78.4089 },
          currentPassengers: 18,
          capacity: 45,
          status: 'active'
        },
        {
          busNumber: 'TS12UC9012',
          route: 'Ameerpet - HITEC City',
          currentLocation: { lat: 17.4374, lng: 78.4482 },
          currentPassengers: 28,
          capacity: 50,
          status: 'active'
        }
      ];
      setBuses(mockBuses);
      updateBusMarkers(mockBuses);
    } finally {
      setLoading(false);
    }
  };

  const updateBusMarkers = (busData: Bus[]) => {
    if (!map.current) return;

    clearMarkers();

    busData.forEach(bus => {
      const el = document.createElement('div');
      el.className = 'bus-marker';
      el.innerHTML = `
        <div style="
          background: #3b82f6;
          color: white;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: bold;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          cursor: pointer;
          transition: transform 0.2s;
        " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
          🚌
        </div>
      `;

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="padding: 8px;">
          <h3 style="margin: 0 0 4px 0; font-weight: bold;">${bus.busNumber}</h3>
          <p style="margin: 2px 0; font-size: 14px;">Route: ${bus.route}</p>
          <p style="margin: 2px 0; font-size: 14px;">Passengers: ${bus.currentPassengers}/${bus.capacity}</p>
          <p style="margin: 2px 0; font-size: 14px;">Status: ${bus.status}</p>
        </div>
      `);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([bus.currentLocation.lng, bus.currentLocation.lat])
        .setPopup(popup)
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  };

  const trackBus = (busNumber: string) => {
    const bus = buses.find(b => b.busNumber === busNumber);
    if (bus && map.current) {
      map.current.flyTo({
        center: [bus.currentLocation.lng, bus.currentLocation.lat],
        zoom: 15,
        duration: 2000
      });
      setSelectedBus(busNumber);
    }
  };

  return (
    <div className="h-screen flex">
      <div className="w-80 bg-background border-r p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center">
            <MapPin className="mr-2" />
            Live Tracking
          </h2>
          <Button
            size="sm"
            variant="outline"
            onClick={fetchBuses}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        
        <div className="space-y-2">
          {buses.length === 0 ? (
            <Card className="p-4 text-center text-muted-foreground">
              No buses available
            </Card>
          ) : (
            buses.map(bus => (
              <Card 
                key={bus.busNumber} 
                className={`p-3 cursor-pointer transition-colors ${
                  selectedBus === bus.busNumber ? 'bg-primary/10 border-primary' : 'hover:bg-muted'
                }`}
                onClick={() => trackBus(bus.busNumber)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{bus.busNumber}</h3>
                    <p className="text-sm text-muted-foreground">Route: {bus.route}</p>
                    <p className="text-sm text-muted-foreground">
                      {bus.currentPassengers}/{bus.capacity} passengers
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs ${
                    bus.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {bus.status}
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    trackBus(bus.busNumber);
                  }}
                >
                  <Navigation className="w-4 h-4 mr-1" />
                  Track Bus
                </Button>
              </Card>
            ))
          )}
        </div>
      </div>
      
      <div className="flex-1 relative">
        <div ref={mapContainer} className="w-full h-full" />
      </div>
    </div>
  );
};

export default LiveMap;