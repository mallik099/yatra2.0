import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Navigation } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface RouteStop {
  name: string;
  lat: number;
  lng: number;
  order: number;
}

const RouteView: React.FC = () => {
  const { busNumber } = useParams<{ busNumber: string }>();
  const [route, setRoute] = useState<RouteStop[]>([]);
  const mapRef = React.useRef<HTMLDivElement>(null);
  const mapInstanceRef = React.useRef<L.Map | null>(null);

  // Sample route data based on bus number
  const getRouteStops = (busNum: string): RouteStop[] => {
    const routes: { [key: string]: RouteStop[] } = {
      '100K': [
        { name: 'Secunderabad Railway Station', lat: 17.4416, lng: 78.5009, order: 1 },
        { name: 'Paradise Circle', lat: 17.4239, lng: 78.4738, order: 2 },
        { name: 'Begumpet', lat: 17.4435, lng: 78.4677, order: 3 },
        { name: 'Ameerpet', lat: 17.4065, lng: 78.4482, order: 4 },
        { name: 'Koti', lat: 17.3753, lng: 78.4804, order: 5 }
      ],
      '156': [
        { name: 'Mehdipatnam', lat: 17.3616, lng: 78.4747, order: 1 },
        { name: 'Tolichowki', lat: 17.3895, lng: 78.4067, order: 2 },
        { name: 'Jubilee Hills', lat: 17.4239, lng: 78.4065, order: 3 },
        { name: 'Kukatpally', lat: 17.4847, lng: 78.4138, order: 4 },
        { name: 'KPHB Colony', lat: 17.4969, lng: 78.3912, order: 5 }
      ],
      '290U': [
        { name: 'LB Nagar', lat: 17.3510, lng: 78.5532, order: 1 },
        { name: 'Dilsukhnagar', lat: 17.3687, lng: 78.5244, order: 2 },
        { name: 'Malakpet', lat: 17.3731, lng: 78.5077, order: 3 },
        { name: 'Hitech City', lat: 17.4475, lng: 78.3563, order: 4 },
        { name: 'Gachibowli', lat: 17.4399, lng: 78.3489, order: 5 }
      ],
      '218': [
        { name: 'Ameerpet', lat: 17.4065, lng: 78.4482, order: 1 },
        { name: 'SR Nagar', lat: 17.4239, lng: 78.4482, order: 2 },
        { name: 'Habsiguda', lat: 17.4239, lng: 78.5563, order: 3 },
        { name: 'Nagole', lat: 17.3850, lng: 78.5850, order: 4 },
        { name: 'Uppal', lat: 17.4067, lng: 78.5569, order: 5 }
      ]
    };
    return routes[busNum] || [];
  };

  useEffect(() => {
    if (busNumber) {
      const stops = getRouteStops(busNumber);
      setRoute(stops);
    }
  }, [busNumber]);

  useEffect(() => {
    if (!mapRef.current || route.length === 0) return;

    // Initialize map
    mapInstanceRef.current = L.map(mapRef.current).setView([17.3850, 78.4867], 12);

    // Add tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstanceRef.current);

    // Add route markers and line
    const routeCoords: [number, number][] = [];
    
    route.forEach((stop, index) => {
      // Add marker for each stop
      const isFirst = index === 0;
      const isLast = index === route.length - 1;
      
      const markerIcon = L.divIcon({
        html: `
          <div style="
            background: ${isFirst ? '#10b981' : isLast ? '#ef4444' : '#3b82f6'};
            color: white;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            border: 3px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          ">
            ${stop.order}
          </div>
        `,
        className: 'route-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      L.marker([stop.lat, stop.lng], { icon: markerIcon })
        .addTo(mapInstanceRef.current!)
        .bindPopup(`
          <div style="text-align: center;">
            <strong>${stop.name}</strong><br>
            <small>Stop ${stop.order}</small>
          </div>
        `);

      routeCoords.push([stop.lat, stop.lng]);
    });

    // Draw route line
    L.polyline(routeCoords, {
      color: '#3b82f6',
      weight: 4,
      opacity: 0.8,
      dashArray: '10, 5'
    }).addTo(mapInstanceRef.current);

    // Fit map to route bounds
    const group = new L.FeatureGroup(
      route.map(stop => L.marker([stop.lat, stop.lng]))
    );
    mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, [route]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/80 border-b border-white/20 p-4 sticky top-0 z-50">
        <div className="flex items-center space-x-4">
          <Link 
            to="/search"
            className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center hover:bg-white/80 transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Bus Route {busNumber}</h1>
            <p className="text-sm text-gray-600">{route.length} stops • Complete route map</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Route Map */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Route Map</h2>
            <div className="flex items-center space-x-2">
              <Navigation className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-600">Full Route</span>
            </div>
          </div>
          <div ref={mapRef} className="h-96 rounded-2xl overflow-hidden" />
        </div>

        {/* Route Stops */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Route Stops</h2>
          <div className="space-y-3">
            {route.map((stop, index) => (
              <div key={stop.order} className="flex items-center space-x-4 p-3 bg-white/50 rounded-2xl">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                  index === 0 ? 'bg-green-500' : 
                  index === route.length - 1 ? 'bg-red-500' : 'bg-blue-500'
                }`}>
                  {stop.order}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{stop.name}</div>
                  <div className="text-sm text-gray-600">
                    {index === 0 ? 'Starting Point' : 
                     index === route.length - 1 ? 'Destination' : 'Intermediate Stop'}
                  </div>
                </div>
                <div className="text-right">
                  <MapPin className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Route Actions */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20">
          <div className="flex space-x-3">
            <Link
              to="/live"
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-2xl font-semibold text-center hover:shadow-lg transition-all duration-200"
            >
              Track Live
            </Link>
            <Link
              to="/search"
              className="flex-1 bg-white/80 text-gray-700 py-3 px-4 rounded-2xl font-semibold text-center hover:bg-white transition-all duration-200"
            >
              New Search
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteView;