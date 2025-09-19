import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRealTimeTracking } from '@/hooks/useRealTimeTracking';
import { useToast } from '@/hooks/use-toast';
import { 
  MapPin, 
  Clock, 
  Navigation, 
  Play, 
  Square,
  Zap,
  TrendingUp
} from 'lucide-react';

const RealTimeTracker = () => {
  const [selectedBus, setSelectedBus] = useState('');
  const { position, eta, isTracking, error, startTracking, stopTracking } = useRealTimeTracking(selectedBus);
  const { toast } = useToast();

  const telanganaRoutes = [
    'TS07UA1234',
    'TS09UB5678', 
    'TS12UC9012',
    'TS05UD3456',
    'TS08UE7890'
  ];

  const handleStartTracking = () => {
    if (!selectedBus) {
      toast({
        title: "Select Bus",
        description: "Please select a bus to track",
        variant: "destructive"
      });
      return;
    }

    startTracking(selectedBus);
    toast({
      title: "Tracking Started",
      description: `Now tracking ${selectedBus} in real-time`,
    });
  };

  const handleStopTracking = () => {
    stopTracking();
    toast({
      title: "Tracking Stopped",
      description: "Real-time tracking has been disabled",
    });
  };

  const getETAColor = (minutes: number) => {
    if (minutes <= 5) return 'bg-green-100 text-green-800';
    if (minutes <= 15) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 0.8) return <TrendingUp className="w-3 h-3 text-green-600" />;
    if (confidence >= 0.6) return <Zap className="w-3 h-3 text-yellow-600" />;
    return <Clock className="w-3 h-3 text-red-600" />;
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">
          Real-Time Bus Tracking for{' '}
          <span className="gradient-primary bg-clip-text text-transparent">
            Telangana
          </span>
        </h2>
        <p className="text-muted-foreground">
          Live GPS tracking with accurate arrival predictions
        </p>
      </div>

      {/* Bus Selection */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center">
          <Navigation className="w-5 h-5 mr-2" />
          Select Bus to Track
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Bus Number</label>
            <select
              className="w-full p-3 border rounded-md"
              value={selectedBus}
              onChange={(e) => setSelectedBus(e.target.value)}
            >
              <option value="">Choose a bus...</option>
              {telanganaRoutes.map(bus => (
                <option key={bus} value={bus}>{bus}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            {!isTracking ? (
              <Button 
                onClick={handleStartTracking}
                className="w-full gradient-primary"
                disabled={!selectedBus}
              >
                <Play className="w-4 h-4 mr-2" />
                Start Real-Time Tracking
              </Button>
            ) : (
              <Button 
                onClick={handleStopTracking}
                variant="destructive"
                className="w-full"
              >
                <Square className="w-4 h-4 mr-2" />
                Stop Tracking
              </Button>
            )}
          </div>
        </div>

        {isTracking && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center text-green-800">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-sm font-medium">
                Live tracking active for {selectedBus}
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center text-red-800">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium">
                {error}
              </span>
            </div>
          </div>
        )}
      </Card>

      {/* Current Position */}
      {position && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Current Position
          </h3>
          
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800">Bus Number</h4>
              <p className="text-2xl font-bold text-blue-600">{position.busNumber}</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800">Speed</h4>
              <p className="text-2xl font-bold text-green-600">
                {Math.round(position.speed)} km/h
              </p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-800">Coordinates</h4>
              <p className="text-sm font-mono text-purple-600">
                {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
              </p>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-orange-800">Last Update</h4>
              <p className="text-sm text-orange-600">
                {new Date(position.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Estimated Arrival Times */}
      {eta.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Estimated Arrival Times
          </h3>
          
          <div className="space-y-3">
            {eta.map((stop, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-medium">{stop.stopName}</h4>
                    <p className="text-sm text-muted-foreground">
                      {stop.distance.toFixed(1)} km away
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {getConfidenceIcon(stop.confidence)}
                  <Badge className={getETAColor(stop.estimatedArrival)}>
                    {stop.estimatedArrival} min
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> Arrival times are estimated based on current traffic conditions, 
              bus speed, and historical data. Updates every 5 seconds.
            </p>
          </div>
        </Card>
      )}

      {/* Quick Stats */}
      {isTracking && (
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {eta.length > 0 ? eta[0].estimatedArrival : '--'}
            </div>
            <p className="text-sm text-muted-foreground">Minutes to Next Stop</p>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {position ? Math.round(position.speed) : '--'}
            </div>
            <p className="text-sm text-muted-foreground">Current Speed (km/h)</p>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {eta.length}
            </div>
            <p className="text-sm text-muted-foreground">Upcoming Stops</p>
          </Card>
        </div>
      )}
    </div>
  );
};

export default RealTimeTracker;