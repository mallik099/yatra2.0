import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Clock } from 'lucide-react';

interface LiveMapWidgetProps {
  busPosition?: { lat: number; lng: number };
  route?: any;
  startPoint?: { lat: number; lng: number; name: string };
  destination?: { lat: number; lng: number; name: string };
}

const LiveMapWidget = ({ busPosition, route, startPoint, destination }: LiveMapWidgetProps) => {
  const [mapError, setMapError] = useState(false);

  // Simplified map display without external dependencies
  return (
    <Card className="p-4">
      <h4 className="font-semibold mb-3 flex items-center">
        <MapPin className="w-4 h-4 mr-2" />
        Live Tracking View
      </h4>
      
      {/* Route Information Display */}
      <div className="space-y-3">
        {startPoint && (
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium">Start Point</span>
            </div>
            <div className="text-right">
              <p className="text-sm">{startPoint.name}</p>
              <p className="text-xs text-muted-foreground">
                {startPoint.lat.toFixed(4)}, {startPoint.lng.toFixed(4)}
              </p>
            </div>
          </div>
        )}

        {destination && (
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium">Destination</span>
            </div>
            <div className="text-right">
              <p className="text-sm">{destination.name}</p>
              <p className="text-xs text-muted-foreground">
                {destination.lat.toFixed(4)}, {destination.lng.toFixed(4)}
              </p>
            </div>
          </div>
        )}

        {busPosition && (
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-sm font-medium">🚌 Live Bus Position</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-mono">
                {busPosition.lat.toFixed(4)}, {busPosition.lng.toFixed(4)}
              </p>
              <Badge className="bg-blue-100 text-blue-800 text-xs">
                Live Tracking
              </Badge>
            </div>
          </div>
        )}

        {route && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center mb-2">
              <Navigation className="w-4 h-4 mr-2 text-blue-600" />
              <span className="text-sm font-medium">Route Information</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Coordinates:</span>
                <p className="font-mono">{route.coordinates?.length || 0} points</p>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <p className="text-green-600">Active Route</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map Placeholder */}
      <div className="mt-4 h-64 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500 mb-1">Live Map View</p>
          <p className="text-xs text-gray-400">
            Tracking bus movement in real-time
          </p>
          {busPosition && (
            <div className="mt-2">
              <div className="inline-flex items-center px-2 py-1 bg-blue-100 rounded-full">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-1"></div>
                <span className="text-xs text-blue-700">Bus Moving</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default LiveMapWidget;