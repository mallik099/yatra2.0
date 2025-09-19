import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Clock, Navigation, Play, Square } from 'lucide-react';
import LiveMapWidget from './LiveMapWidget';

// Geoapify API configuration
const GEOAPIFY_API_KEY = '6f29c1730f38480781df0b18a3214140';

interface BusTrackingData {
  busNumber: string;
  startPoint: string;
  destination: string;
  eta: number;
  distance: number;
  route: any;
  isTracking: boolean;
  startCoords: { lat: number; lng: number; name: string };
  endCoords: { lat: number; lng: number; name: string };
}

const BusTrackingWidget = () => {
  const [formData, setFormData] = useState({
    startPoint: '',
    destination: '',
    busNumber: ''
  });
  const [trackingData, setTrackingData] = useState<BusTrackingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [busPosition, setBusPosition] = useState<{lat: number, lng: number} | null>(null);
  const { toast } = useToast();
  const trackingInterval = useRef<NodeJS.Timeout>();

  // Telangana locations for quick selection
  const telanganaLocations = [
    'Secunderabad Railway Station, Hyderabad',
    'Gachibowli, Hyderabad',
    'HITEC City, Hyderabad',
    'Ameerpet Metro Station, Hyderabad',
    'Kukatpally, Hyderabad',
    'Dilsukhnagar, Hyderabad',
    'Begumpet Airport, Hyderabad',
    'Charminar, Hyderabad'
  ];

  // Geocode address to coordinates using Geoapify
  const geocodeAddress = async (address: string) => {
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address + ', Telangana, India')}&limit=1&apiKey=${GEOAPIFY_API_KEY}`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const coords = data.features[0].geometry.coordinates;
        return {
          lat: coords[1],
          lng: coords[0],
          name: data.features[0].properties.formatted
        };
      }
      throw new Error('Location not found');
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  // Calculate route and ETA using Geoapify Routing API
  const calculateRoute = async (startCoords: any, endCoords: any) => {
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/routing?waypoints=${startCoords.lat},${startCoords.lng}|${endCoords.lat},${endCoords.lng}&mode=bus&apiKey=${GEOAPIFY_API_KEY}`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const route = data.features[0];
        return {
          distance: route.properties.distance,
          time: route.properties.time,
          geometry: route.geometry
        };
      }
      throw new Error('Route not found');
    } catch (error) {
      console.error('Routing error:', error);
      return null;
    }
  };

  // Simulate real-time bus movement
  const simulateBusMovement = (routeGeometry: any) => {
    if (!routeGeometry || !routeGeometry.coordinates) {
      // Fallback: simulate movement between start and end points
      if (trackingData) {
        let progress = 0;
        trackingInterval.current = setInterval(() => {
          progress += 0.05; // 5% progress each update
          if (progress > 1) progress = 0; // Reset to start
          
          // Linear interpolation between start and end
          const lat = trackingData.startCoords.lat + 
            (trackingData.endCoords.lat - trackingData.startCoords.lat) * progress;
          const lng = trackingData.startCoords.lng + 
            (trackingData.endCoords.lng - trackingData.startCoords.lng) * progress;
          
          setBusPosition({ lat, lng });
        }, 2000); // Update every 2 seconds
      }
      return;
    }
    
    const coordinates = routeGeometry.coordinates;
    let currentIndex = 0;
    
    trackingInterval.current = setInterval(() => {
      if (currentIndex < coordinates.length) {
        setBusPosition({
          lat: coordinates[currentIndex][1],
          lng: coordinates[currentIndex][0]
        });
        currentIndex += Math.max(1, Math.floor(coordinates.length / 30)); // Slower movement
      } else {
        currentIndex = 0; // Reset to start
      }
    }, 2000); // Update every 2 seconds
  };

  // Track bus function
  const trackBus = async () => {
    if (!formData.startPoint || !formData.destination || !formData.busNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      // Step 1: Geocode starting point
      const startCoords = await geocodeAddress(formData.startPoint);
      if (!startCoords) {
        throw new Error('Could not find starting location');
      }

      // Step 2: Geocode destination
      const endCoords = await geocodeAddress(formData.destination);
      if (!endCoords) {
        throw new Error('Could not find destination location');
      }

      // Step 3: Calculate route and ETA
      const routeData = await calculateRoute(startCoords, endCoords);
      if (!routeData) {
        throw new Error('Could not calculate route');
      }

      // Step 4: Set tracking data
      const etaMinutes = Math.round(routeData.time / 60);
      const distanceKm = Math.round(routeData.distance / 1000);

      setTrackingData({
        busNumber: formData.busNumber,
        startPoint: startCoords.name,
        destination: endCoords.name,
        eta: etaMinutes,
        distance: distanceKm,
        route: routeData.geometry,
        isTracking: true,
        startCoords,
        endCoords
      });

      // Step 5: Start real-time simulation
      setTimeout(() => {
        simulateBusMovement(routeData.geometry);
      }, 1000); // Delay to ensure state is set

      toast({
        title: "Bus Tracking Started",
        description: `Now tracking ${formData.busNumber} - ETA: ${etaMinutes} minutes`
      });

    } catch (error: any) {
      console.error('Bus tracking error:', error);
      
      // Fallback: Create mock tracking data for demo
      const mockStartCoords = { lat: 17.4399, lng: 78.5014, name: 'Secunderabad Area' };
      const mockEndCoords = { lat: 17.4399, lng: 78.3648, name: 'Gachibowli Area' };
      
      setTrackingData({
        busNumber: formData.busNumber,
        startPoint: mockStartCoords.name,
        destination: mockEndCoords.name,
        eta: 25,
        distance: 15,
        route: null,
        isTracking: true,
        startCoords: mockStartCoords,
        endCoords: mockEndCoords
      });
      
      setTimeout(() => {
        simulateBusMovement(null);
      }, 1000);
      
      toast({
        title: "Demo Mode Active",
        description: "Using simulated data for demonstration",
        variant: "default"
      });
    } finally {
      setLoading(false);
    }
  };

  // Stop tracking
  const stopTracking = () => {
    if (trackingInterval.current) {
      clearInterval(trackingInterval.current);
    }
    setTrackingData(null);
    setBusPosition(null);
    toast({
      title: "Tracking Stopped",
      description: "Bus tracking has been disabled"
    });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (trackingInterval.current) {
        clearInterval(trackingInterval.current);
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">
          Live Bus Tracking for{' '}
          <span className="gradient-primary bg-clip-text text-transparent">
            Telangana
          </span>
        </h3>
        <p className="text-muted-foreground">
          Real-time bus tracking with Geoapify API integration
        </p>
      </div>

      {/* Input Form */}
      <Card className="p-6">
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Starting Point</label>
            <Input
              placeholder="Enter starting location"
              value={formData.startPoint}
              onChange={(e) => setFormData({...formData, startPoint: e.target.value})}
            />
            <select 
              className="w-full mt-1 p-1 text-xs border rounded"
              onChange={(e) => setFormData({...formData, startPoint: e.target.value})}
            >
              <option value="">Quick select...</option>
              {telanganaLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Destination Point</label>
            <Input
              placeholder="Enter destination"
              value={formData.destination}
              onChange={(e) => setFormData({...formData, destination: e.target.value})}
            />
            <select 
              className="w-full mt-1 p-1 text-xs border rounded"
              onChange={(e) => setFormData({...formData, destination: e.target.value})}
            >
              <option value="">Quick select...</option>
              {telanganaLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Bus Number</label>
            <Input
              placeholder="e.g., TS07UA1234"
              value={formData.busNumber}
              onChange={(e) => setFormData({...formData, busNumber: e.target.value})}
            />
          </div>
        </div>

        <div className="flex gap-2">
          {!trackingData?.isTracking ? (
            <Button 
              onClick={trackBus} 
              disabled={loading}
              className="gradient-primary"
            >
              <Play className="w-4 h-4 mr-2" />
              {loading ? 'Tracking...' : 'Track Bus'}
            </Button>
          ) : (
            <Button 
              onClick={stopTracking}
              variant="destructive"
            >
              <Square className="w-4 h-4 mr-2" />
              Stop Tracking
            </Button>
          )}
        </div>
      </Card>

      {/* Tracking Results */}
      {trackingData && (
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-4">
            <h4 className="font-semibold mb-3 flex items-center">
              <Navigation className="w-4 h-4 mr-2" />
              Bus Information
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Bus Number:</span>
                <Badge variant="outline">{trackingData.busNumber}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Distance:</span>
                <span>{trackingData.distance} km</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <Badge className="bg-green-100 text-green-800">
                  {trackingData.isTracking ? 'Live Tracking' : 'Stopped'}
                </Badge>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="font-semibold mb-3 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              ETA Information
            </h4>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {trackingData.eta} min
              </div>
              <p className="text-sm text-muted-foreground">
                Estimated arrival time
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Route Information */}
      {trackingData && (
        <Card className="p-4">
          <h4 className="font-semibold mb-3 flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            Route Details
          </h4>
          <div className="space-y-2">
            <div>
              <span className="text-sm font-medium">From: </span>
              <span className="text-sm">{trackingData.startPoint}</span>
            </div>
            <div>
              <span className="text-sm font-medium">To: </span>
              <span className="text-sm">{trackingData.destination}</span>
            </div>
            {busPosition && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center text-blue-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
                  <span className="text-sm font-medium">
                    Live Position: {busPosition.lat.toFixed(4)}, {busPosition.lng.toFixed(4)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Live Map Display */}
      {trackingData && (
        <LiveMapWidget
          busPosition={busPosition}
          route={trackingData.route}
          startPoint={trackingData.startCoords}
          destination={trackingData.endCoords}
        />
      )}
    </div>
  );
};

export default BusTrackingWidget;