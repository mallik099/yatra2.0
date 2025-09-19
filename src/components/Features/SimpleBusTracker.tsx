import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Clock, Navigation, Play, Square } from 'lucide-react';

const SimpleBusTracker = () => {
  const [formData, setFormData] = useState({
    startPoint: '',
    destination: '',
    busNumber: ''
  });
  const [isTracking, setIsTracking] = useState(false);
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const { toast } = useToast();

  const telanganaLocations = [
    'Secunderabad Railway Station',
    'Gachibowli',
    'HITEC City',
    'Ameerpet Metro Station',
    'Kukatpally',
    'Dilsukhnagar'
  ];

  const trackBus = () => {
    if (!formData.startPoint || !formData.destination || !formData.busNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsTracking(true);
    
    // Simulate tracking with mock data
    setTimeout(() => {
      const mockResult = {
        busNumber: formData.busNumber,
        startPoint: formData.startPoint,
        destination: formData.destination,
        eta: Math.floor(Math.random() * 30) + 10, // 10-40 minutes
        distance: Math.floor(Math.random() * 20) + 5, // 5-25 km
        status: 'Active',
        currentLocation: 'En route to destination'
      };
      
      setTrackingResult(mockResult);
      
      toast({
        title: "Bus Tracking Started",
        description: `Now tracking ${formData.busNumber}`
      });
    }, 1000);
  };

  const stopTracking = () => {
    setIsTracking(false);
    setTrackingResult(null);
    toast({
      title: "Tracking Stopped",
      description: "Bus tracking has been disabled"
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">
          Bus Tracking for{' '}
          <span className="gradient-primary bg-clip-text text-transparent">
            Telangana
          </span>
        </h3>
        <p className="text-muted-foreground">
          Track buses across Hyderabad and Telangana
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
              placeholder="e.g., TS07UA1234"
              value={formData.busNumber}
              onChange={(e) => setFormData({...formData, busNumber: e.target.value})}
            />
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
                <span>Status:</span>
                <Badge className="bg-green-100 text-green-800">
                  {trackingResult.status}
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
            <div>
              <span className="text-sm font-medium">Current Location: </span>
              <span className="text-sm">{trackingResult.currentLocation}</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default SimpleBusTracker;