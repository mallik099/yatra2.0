import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { geocodeAddress, getDirections } from '@/services/mapService';
import { MapPin, Route, Clock } from 'lucide-react';

interface RouteSearchProps {
  onRouteCalculated: (route: any, start: [number, number], end: [number, number]) => void;
}

const RouteSearch = ({ onRouteCalculated }: RouteSearchProps) => {
  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculateRoute = async () => {
    if (!startAddress || !endAddress) return;

    setLoading(true);
    setError('');

    try {
      const startCoords = await geocodeAddress(startAddress);
      const endCoords = await geocodeAddress(endAddress);

      if (!startCoords || !endCoords) {
        setError('Could not find one or more addresses');
        return;
      }

      const route = await getDirections(startCoords, endCoords);
      
      if (route) {
        onRouteCalculated(route, startCoords, endCoords);
      } else {
        setError('Could not calculate route');
      }
    } catch (err) {
      setError('Error calculating route');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4 flex items-center">
        <Route className="w-4 h-4 mr-2" />
        Route Planning
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">From</label>
          <Input
            placeholder="Enter starting location"
            value={startAddress}
            onChange={(e) => setStartAddress(e.target.value)}
          />
        </div>
        
        <div>
          <label className="text-sm font-medium">To</label>
          <Input
            placeholder="Enter destination"
            value={endAddress}
            onChange={(e) => setEndAddress(e.target.value)}
          />
        </div>
        
        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}
        
        <Button 
          onClick={calculateRoute}
          className="w-full"
          disabled={!startAddress || !endAddress || loading}
        >
          <MapPin className="w-4 h-4 mr-2" />
          {loading ? 'Calculating...' : 'Calculate Route'}
        </Button>
      </div>
    </Card>
  );
};

export default RouteSearch;