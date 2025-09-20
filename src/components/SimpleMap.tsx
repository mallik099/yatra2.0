import React from 'react';
import { MapPin } from 'lucide-react';

interface Bus {
  id: string;
  number: string;
  location: [number, number];
  nextStop: string;
}

interface SimpleMapProps {
  buses: Bus[];
  onBusSelect: (bus: Bus) => void;
  selectedBus?: Bus | null;
}

const SimpleMap: React.FC<SimpleMapProps> = ({ buses, onBusSelect, selectedBus }) => {
  // Simple visual map representation
  const mapWidth = 400;
  const mapHeight = 300;
  
  // Hyderabad bounds
  const bounds = {
    minLat: 17.2,
    maxLat: 17.6,
    minLng: 78.2,
    maxLng: 78.7
  };
  
  const getPosition = (lat: number, lng: number) => {
    const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * mapWidth;
    const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * mapHeight;
    return { x: Math.max(10, Math.min(mapWidth - 10, x)), y: Math.max(10, Math.min(mapHeight - 10, y)) };
  };

  return (
    <div className="bg-blue-50 rounded-lg p-4 relative overflow-hidden" style={{ height: mapHeight + 40 }}>
      <div className="text-sm font-medium text-gray-700 mb-2">Hyderabad Bus Map</div>
      
      {/* Simple map background */}
      <div 
        className="relative bg-gradient-to-br from-green-100 to-blue-100 rounded border-2 border-gray-200"
        style={{ width: mapWidth, height: mapHeight }}
      >
        {/* City landmarks */}
        <div className="absolute top-4 left-4 text-xs text-gray-600 bg-white px-2 py-1 rounded shadow">
          Secunderabad
        </div>
        <div className="absolute bottom-4 right-4 text-xs text-gray-600 bg-white px-2 py-1 rounded shadow">
          Gachibowli
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs text-gray-600 bg-white px-2 py-1 rounded shadow">
          Hyderabad Center
        </div>
        
        {/* Bus markers */}
        {buses.map((bus) => {
          const pos = getPosition(bus.location[0], bus.location[1]);
          const isSelected = selectedBus?.id === bus.id;
          
          return (
            <div
              key={bus.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${
                isSelected ? 'scale-125 z-10' : 'hover:scale-110'
              }`}
              style={{ left: pos.x, top: pos.y }}
              onClick={() => onBusSelect(bus)}
            >
              <div className={`relative ${isSelected ? 'animate-pulse' : ''}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg ${
                  isSelected ? 'bg-red-500' : 'bg-blue-500'
                }`}>
                  🚌
                </div>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs bg-white px-1 rounded shadow whitespace-nowrap">
                  {bus.number}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        Click on bus icons to view details • Live updates every 10 seconds
      </div>
    </div>
  );
};

export default SimpleMap;