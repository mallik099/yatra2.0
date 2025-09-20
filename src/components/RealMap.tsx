import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default markers with error handling
try {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
} catch (error) {
  console.warn('Leaflet icon setup failed:', error);
}

interface Bus {
  id: string;
  number: string;
  location: [number, number];
  route: string;
  nextStop: string;
  status?: string;
  eta?: string;
}

interface RealMapProps {
  buses: Bus[];
  onBusSelect: (bus: Bus) => void;
  selectedBus?: Bus | null;
}

const RealMap: React.FC<RealMapProps> = ({ buses, onBusSelect, selectedBus }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const [isTracking, setIsTracking] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    try {
      // Initialize map with better view
      mapInstanceRef.current = L.map(mapRef.current).setView([17.3850, 78.4867], 13);

    // Add OpenStreetMap tiles with better styling
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
      minZoom: 10
    }).addTo(mapInstanceRef.current);

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos: [number, number] = [position.coords.latitude, position.coords.longitude];
          setUserLocation(userPos);
          
          // Add user location marker
          const userIcon = L.divIcon({
            html: `<div style="background: #10b981; color: white; border-radius: 50%; width: 16px; height: 16px; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
            className: 'user-location-marker',
            iconSize: [16, 16],
            iconAnchor: [8, 8]
          });
          
          L.marker(userPos, { icon: userIcon })
            .addTo(mapInstanceRef.current!)
            .bindPopup('Your Location');
        },
        () => console.log('Location access denied')
      );
    }

    } catch (error) {
      console.error('Map initialization failed:', error);
    }

    return () => {
      try {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
        }
      } catch (error) {
        console.warn('Map cleanup failed:', error);
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Update existing markers or create new ones
    buses.forEach(bus => {
      const isSelected = selectedBus?.id === bus.id;
      const statusColor = getStatusColor(bus.status || 'active');
      
      const busIcon = L.divIcon({
        html: `
          <div style="
            position: relative;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              background: ${isSelected ? '#ef4444' : statusColor};
              color: white;
              border-radius: 8px;
              width: 32px;
              height: 32px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 10px;
              font-weight: bold;
              border: 2px solid white;
              box-shadow: 0 3px 6px rgba(0,0,0,0.3);
              transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'};
              transition: all 0.3s ease;
            ">
              🚌
            </div>
            ${isSelected ? `
              <div style="
                position: absolute;
                top: -8px;
                right: -8px;
                background: #ef4444;
                color: white;
                border-radius: 50%;
                width: 16px;
                height: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 8px;
                font-weight: bold;
                border: 2px solid white;
                animation: pulse 2s infinite;
              ">📍</div>
            ` : ''}
          </div>
        `,
        className: 'enhanced-bus-marker',
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      if (markersRef.current[bus.id]) {
        // Update existing marker
        markersRef.current[bus.id].setIcon(busIcon);
        markersRef.current[bus.id].setLatLng([bus.location[0], bus.location[1]]);
      } else {
        // Create new marker
        const marker = L.marker([bus.location[0], bus.location[1]], { icon: busIcon })
          .addTo(mapInstanceRef.current!)
          .bindPopup(`
            <div style="text-align: center; min-width: 200px;">
              <div style="background: ${statusColor}; color: white; padding: 8px; margin: -10px -10px 10px -10px; border-radius: 4px 4px 0 0;">
                <strong>🚌 Bus ${bus.number}</strong>
              </div>
              <div style="padding: 5px 0;">
                <div style="margin-bottom: 5px;"><strong>Route:</strong> ${bus.route}</div>
                <div style="margin-bottom: 5px;"><strong>Next Stop:</strong> ${bus.nextStop}</div>
                ${bus.eta ? `<div style="color: #10b981; font-weight: bold;">ETA: ${bus.eta}</div>` : ''}
                <div style="margin-top: 8px; font-size: 11px; color: #666;">
                  📍 ${bus.location[0].toFixed(4)}, ${bus.location[1].toFixed(4)}
                </div>
              </div>
            </div>
          `, {
            maxWidth: 250,
            className: 'custom-popup'
          })
          .on('click', () => onBusSelect(bus));

        markersRef.current[bus.id] = marker;
      }
    });

    // Remove markers for buses that no longer exist
    Object.keys(markersRef.current).forEach(busId => {
      if (!buses.find(bus => bus.id === busId)) {
        mapInstanceRef.current?.removeLayer(markersRef.current[busId]);
        delete markersRef.current[busId];
      }
    });
  }, [buses, selectedBus, onBusSelect]);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return '#10b981';
      case 'delayed': return '#ef4444';
      case 'ontime': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const centerOnBus = (bus: Bus) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([bus.location[0], bus.location[1]], 16, {
        animate: true,
        duration: 1
      });
      markersRef.current[bus.id]?.openPopup();
    }
  };

  const centerOnUser = () => {
    if (userLocation && mapInstanceRef.current) {
      mapInstanceRef.current.setView(userLocation, 15, {
        animate: true,
        duration: 1
      });
    }
  };

  // Auto-center on selected bus
  useEffect(() => {
    if (selectedBus) {
      centerOnBus(selectedBus);
    }
  }, [selectedBus]);

  return (
    <div className="relative">
      <div ref={mapRef} style={{ height: '400px', width: '100%' }} className="rounded-lg" />
      
      {/* Map Controls */}
      <div className="absolute top-2 right-2 flex flex-col gap-2">
        <div className="bg-white px-2 py-1 rounded shadow text-xs">
          Live Tracking • {buses.length} buses
        </div>
        
        {userLocation && (
          <button
            onClick={centerOnUser}
            className="bg-blue-600 text-white p-2 rounded shadow hover:bg-blue-700 transition-colors"
            title="Center on my location"
          >
            📍
          </button>
        )}
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-2 left-2 bg-white p-2 rounded shadow text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Active</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Delayed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>On Time</span>
          </div>
        </div>
      </div>
      

    </div>
  );
};

export default RealMap;