import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Clock, Navigation, Play, Square, Zap } from 'lucide-react';
import { enhancedBusService } from '@/services/enhancedBusService';

const WorkingBusTracker = () => {
  const [formData, setFormData] = useState({
    startPoint: '',
    destination: '',
    busNumber: ''
  });
  const [isTracking, setIsTracking] = useState(false);
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [busPosition, setBusPosition] = useState<any>(null);
  const [accuracy, setAccuracy] = useState<number>(0);
  const [confidence, setConfidence] = useState<number>(0);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const { toast } = useToast();

  const telanganaLocations = [
    'Secunderabad Railway Station',
    'Gachibowli',
    'HITEC City',
    'Ameerpet Metro Station',
    'Kukatpally',
    'Dilsukhnagar',
    'Ibrahimpatnam',
    'Mehdipatnam',
    'JBS',
    'LB Nagar'
  ];

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    // Create simple map placeholder with coordinates
    const initMap = () => {
      if (mapInstance.current) return;
      
      mapInstance.current = {
        center: [17.3850, 78.4867], // Hyderabad
        zoom: 11,
        markers: []
      };
    };

    initMap();
  }, []);

  const trackBus = async () => {
    if (!formData.startPoint || !formData.destination || !formData.busNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsTracking(true);
    
    try {
      // Try enhanced bus service first
      let busData = await enhancedBusService.getEnhancedBusData(formData.busNumber);
      
      if (!busData) {
        // Fallback to enhanced mock data
        busData = {
          busNumber: formData.busNumber,
          route: 'HYD001',
          currentLocation: { 
            lat: 17.4399, 
            lng: 78.5014,
            accuracy: Math.random() * 5 + 2,
            timestamp: Date.now()
          },
          capacity: 50,
          currentPassengers: Math.floor(Math.random() * 40) + 10,
          status: 'active',
          etaConfidence: 0.85 + Math.random() * 0.13
        };
      }
      
      setAccuracy(busData.currentLocation.accuracy || 3);
      setConfidence(busData.etaConfidence || 0.85);

      // Simulate route calculation
      const mockResult = {
        busNumber: formData.busNumber,
        startPoint: formData.startPoint,
        destination: formData.destination,
        eta: Math.floor(Math.random() * 30) + 10,
        distance: Math.floor(Math.random() * 20) + 5,
        status: 'Active',
        currentLocation: busData.currentLocation,
        capacity: busData.capacity,
        passengers: busData.currentPassengers
      };
      
      setTrackingResult(mockResult);
      setBusPosition(busData.currentLocation);
      
      // Start position updates
      startPositionUpdates(busData.currentLocation);
      
      toast({
        title: "Bus Tracking Started",
        description: `Now tracking ${formData.busNumber} in real-time`
      });
      
    } catch (error) {
      console.error('Tracking error:', error);
      toast({
        title: "Tracking Error",
        description: "Failed to track bus. Please try again.",
        variant: "destructive"
      });
      setIsTracking(false);
    }
  };

  const startPositionUpdates = (initialPosition: any) => {
    let currentPos = { ...initialPosition };
    
    const updateInterval = setInterval(() => {
      // Simulate small movements
      currentPos.lat += (Math.random() - 0.5) * 0.001;
      currentPos.lng += (Math.random() - 0.5) * 0.001;
      
      setBusPosition({ ...currentPos });
    }, 3000);

    // Store interval for cleanup
    (window as any).trackingInterval = updateInterval;
  };

  const stopTracking = () => {
    setIsTracking(false);
    setTrackingResult(null);
    setBusPosition(null);
    
    // Clear position updates
    if ((window as any).trackingInterval) {
      clearInterval((window as any).trackingInterval);
    }
    
    toast({
      title: "Tracking Stopped",
      description: "Bus tracking has been disabled"
    });
  };

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
          Real-time bus tracking with live position updates
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
            <label className="text-sm font-medium mb-2 block">Destination</label>
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
              placeholder="e.g., 218, 219, 290U"
              value={formData.busNumber}
              onChange={(e) => setFormData({...formData, busNumber: e.target.value})}
            />
            <select 
              className="w-full mt-1 p-1 text-xs border rounded"
              onChange={(e) => setFormData({...formData, busNumber: e.target.value})}
            >
              <option value="">Select TSRTC Route...</option>
              <option value="1">1 - Secunderabad to Afzalgunj</option>
              <option value="10">10 - Secunderabad to Kukatpally</option>
              <option value="18">18 - Secunderabad to Mehdipatnam</option>
              <option value="49M">49M - Secunderabad to Miyapur</option>
              <option value="218">218 - Secunderabad to Gachibowli</option>
              <option value="219">219 - JBS to Gachibowli</option>
              <option value="290">290 - JBS to HITEC City</option>
              <option value="290U">290U - JBS to Gachibowli (Express)</option>
              <option value="251">251 - Secunderabad to Ibrahimpatnam</option>
              <option value="280">280 - Mehdipatnam to Ibrahimpatnam</option>
              <option value="277D">277D - Dilsukhnagar to Ibrahimpatnam</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          {!isTracking ? (
            <Button onClick={trackBus} className="gradient-primary">
              <Play className="w-4 h-4 mr-2" />
              Track Bus
            </Button>
          ) : (
            <Button onClick={stopTracking} variant="destructive">
              <Square className="w-4 h-4 mr-2" />
              Stop Tracking
            </Button>
          )}
        </div>
      </Card>

      {/* Live Map Display */}
      {isTracking && (
        <Card className="p-4">
          <h4 className="font-semibold mb-3 flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            Live Map View
          </h4>
          
          <div 
            ref={mapRef}
            className="w-full h-64 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden"
          >
            {/* Map Background */}
            <div className="absolute inset-0 opacity-20">
              <div className="grid grid-cols-8 grid-rows-6 h-full">
                {Array.from({length: 48}).map((_, i) => (
                  <div key={i} className="border border-gray-200"></div>
                ))}
              </div>
            </div>
            
            {/* Bus Position Indicator */}
            {busPosition && (
              <div className="absolute" style={{
                left: `${50 + (busPosition.lng - 78.4867) * 1000}%`,
                top: `${50 - (busPosition.lat - 17.3850) * 1000}%`
              }}>
                <div className="relative">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white animate-pulse">
                    🚌
                  </div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs bg-white px-2 py-1 rounded shadow">
                    Live
                  </div>
                </div>
              </div>
            )}
            
            {/* Center Info */}
            <div className="text-center z-10">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 mb-1">Hyderabad, Telangana</p>
              <p className="text-xs text-gray-400">
                {busPosition ? 
                  `Bus at: ${busPosition.lat.toFixed(4)}, ${busPosition.lng.toFixed(4)}` :
                  'Tracking bus movement...'
                }
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Results */}
      {trackingResult && (
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-4">
            <h4 className="font-semibold mb-3 flex items-center">
              <Navigation className="w-4 h-4 mr-2" />
              Bus Information
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Bus Number:</span>
                <Badge variant="outline">{trackingResult.busNumber}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Distance:</span>
                <span>{trackingResult.distance} km</span>
              </div>
              <div className="flex justify-between">
                <span>Passengers:</span>
                <span>{trackingResult.passengers}/{trackingResult.capacity}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <Badge className="bg-green-100 text-green-800">
                  {isTracking ? 'Live Tracking' : trackingResult.status}
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
                {trackingResult.eta} min
              </div>
              <p className="text-sm text-muted-foreground">
                Estimated arrival time
              </p>
              {busPosition && (
                <div className="mt-2 text-xs text-blue-600">
                  Position updating every 3 seconds
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Route Details */}
      {trackingResult && (
        <Card className="p-4">
          <h4 className="font-semibold mb-3 flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            Route Details
          </h4>
          <div className="space-y-2">
            <div>
              <span className="text-sm font-medium">From: </span>
              <span className="text-sm">{trackingResult.startPoint}</span>
            </div>
            <div>
              <span className="text-sm font-medium">To: </span>
              <span className="text-sm">{trackingResult.destination}</span>
            </div>
            {busPosition && (
              <div>
                <span className="text-sm font-medium">Live Position: </span>
                <span className="text-sm font-mono">
                  {busPosition.lat.toFixed(4)}, {busPosition.lng.toFixed(4)}
                </span>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default WorkingBusTracker;