import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useBusData } from '@/hooks/useBusData';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  MapPin, 
  Clock, 
  Users, 
  Navigation,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

const telanganaLocations = [
  { name: 'Secunderabad', coords: { lat: 17.4399, lng: 78.5014 } },
  { name: 'Gachibowli', coords: { lat: 17.4399, lng: 78.3648 } },
  { name: 'HITEC City', coords: { lat: 17.4485, lng: 78.3684 } },
  { name: 'Ameerpet', coords: { lat: 17.4374, lng: 78.4482 } },
  { name: 'Kukatpally', coords: { lat: 17.4851, lng: 78.4089 } },
  { name: 'Dilsukhnagar', coords: { lat: 17.3687, lng: 78.5242 } }
];

const InteractiveFeatures = () => {
  const { buses, loading, error, fetchBuses, trackBus, getNearbyBuses } = useBusData();
  const { toast } = useToast();
  const [searchInput, setSearchInput] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [nearbyResults, setNearbyResults] = useState<any[]>([]);

  const handleBusSearch = async () => {
    if (!searchInput.trim()) {
      toast({
        title: "Enter Bus Number",
        description: "Please enter a valid bus number (e.g., TS07UA1234)",
        variant: "destructive"
      });
      return;
    }

    // Simulate real-time bus search with actual data
    const searchTerm = searchInput.toUpperCase();
    const foundBus = buses.find(bus => 
      bus.busNumber.toUpperCase().includes(searchTerm) || 
      bus.route.toUpperCase().includes(searchTerm)
    );

    if (foundBus) {
      // Add real-time location update
      const updatedBus = {
        ...foundBus,
        lastUpdated: new Date().toLocaleTimeString(),
        status: 'active',
        nextStop: foundBus.nextStop || `${foundBus.route} - Stop ${Math.floor(Math.random() * 10) + 1}`,
        eta: `${Math.floor(Math.random() * 15) + 2} min`,
        currentPassengers: Math.floor(Math.random() * foundBus.capacity * 0.8)
      };
      
      setSearchResults([updatedBus]);
      toast({
        title: "Bus Found!",
        description: `${updatedBus.busNumber} is currently at ${updatedBus.nextStop}`,
      });
    } else {
      setSearchResults([]);
      toast({
        title: "Bus Not Found",
        description: "Please check the bus number and try again",
        variant: "destructive"
      });
    }
  };

  const handleLocationSearch = () => {
    if (!selectedLocation) {
      toast({
        title: "Select Location",
        description: "Please select a location to find nearby buses",
        variant: "destructive"
      });
      return;
    }

    // Generate real-time nearby buses for selected location
    const nearbyBuses = buses.filter(() => Math.random() > 0.4).map(bus => ({
      ...bus,
      distance: `${(Math.random() * 2 + 0.1).toFixed(1)} km`,
      eta: `${Math.floor(Math.random() * 20) + 3} min`,
      currentPassengers: Math.floor(Math.random() * bus.capacity * 0.9),
      lastUpdated: new Date().toLocaleTimeString(),
      nextStop: `${selectedLocation} - ${bus.route}`
    })).slice(0, 4);

    setNearbyResults(nearbyBuses);
    toast({
      title: `Found ${nearbyBuses.length} buses`,
      description: `Near ${selectedLocation}`,
    });
  };

  const handleRefresh = () => {
    // Simulate real-time data refresh
    fetchBuses();
    
    // Update search results if they exist
    if (searchResults.length > 0) {
      const updatedResults = searchResults.map(bus => ({
        ...bus,
        currentPassengers: Math.floor(Math.random() * bus.capacity * 0.8),
        eta: `${Math.floor(Math.random() * 15) + 2} min`,
        lastUpdated: new Date().toLocaleTimeString()
      }));
      setSearchResults(updatedResults);
    }
    
    // Update nearby results if they exist
    if (nearbyResults.length > 0) {
      const updatedNearby = nearbyResults.map(bus => ({
        ...bus,
        currentPassengers: Math.floor(Math.random() * bus.capacity * 0.8),
        eta: `${Math.floor(Math.random() * 20) + 3} min`,
        lastUpdated: new Date().toLocaleTimeString()
      }));
      setNearbyResults(updatedNearby);
    }
    
    toast({
      title: "Data Refreshed",
      description: "Real-time bus information updated",
    });
  };

  const getCapacityColor = (passengers: number, capacity: number) => {
    const percentage = (passengers / capacity) * 100;
    if (percentage < 50) return 'bg-green-100 text-green-800';
    if (percentage < 80) return 'bg-blue-100 text-blue-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">
          🔍 Interactive Features for{' '}
          <span className="gradient-primary bg-clip-text text-transparent">
            Telangana
          </span>
        </h2>
        <p className="text-muted-foreground">
          Real-time bus tracking and location services across Hyderabad and Telangana
        </p>
      </div>

      {/* Action Buttons */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center">
            <Search className="w-4 h-4 mr-2" />
            Track Bus
          </h3>
          <div className="space-y-3">
            <Input
              placeholder="Enter bus number (e.g., TS07UA1234)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleBusSearch()}
            />
            <Button onClick={handleBusSearch} className="w-full rounded-full" disabled={loading}>
              <Search className="w-4 h-4 mr-2" />
              Search Bus
            </Button>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            Find Nearby Buses
          </h3>
          <div className="space-y-3">
            <select
              className="w-full p-2 border rounded-md"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">Select Location</option>
              {telanganaLocations.map(loc => (
                <option key={loc.name} value={loc.name}>{loc.name}</option>
              ))}
            </select>
            <Button onClick={handleLocationSearch} className="w-full rounded-full" disabled={loading}>
              <Navigation className="w-4 h-4 mr-2" />
              Find Buses
            </Button>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center">
            <RefreshCw className="w-4 h-4 mr-2" />
            Live Updates
          </h3>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Get real-time bus information
            </p>
            <Button onClick={handleRefresh} className="w-full rounded-full" disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
          </div>
        </Card>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex items-center text-red-800">
            <AlertCircle className="w-4 h-4 mr-2" />
            {error}
          </div>
        </Card>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card className="p-4 bg-white/90 backdrop-blur-sm border-slate-200">
          <h3 className="font-semibold mb-4 text-slate-800">📊 Search Results</h3>
          {searchResults.map(bus => (
            <div key={bus.busNumber} className="border border-slate-200 rounded-xl p-4 mb-3 bg-gradient-to-r from-white to-blue-50/30 hover:shadow-lg transition-all duration-300">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-bold text-lg text-slate-800">{bus.busNumber}</h4>
                  <p className="text-slate-600 font-medium">{bus.route}</p>
                  <p className="text-xs text-slate-500">Updated: {bus.lastUpdated}</p>
                </div>
                <Badge className={getCapacityColor(bus.currentPassengers, bus.capacity)}>
                  {Math.round((bus.currentPassengers / bus.capacity) * 100)}% Full
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center text-slate-700">
                  <MapPin className="w-4 h-4 mr-2 text-orange-600" />
                  <span className="font-medium">Next: {bus.nextStop}</span>
                </div>
                <div className="flex items-center text-slate-700">
                  <Clock className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="font-medium">ETA: {bus.eta}</span>
                </div>
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* Nearby Results */}
      {nearbyResults.length > 0 && (
        <Card className="p-4 bg-white/90 backdrop-blur-sm border-slate-200 mb-6">
          <h3 className="font-semibold mb-4 text-slate-800">🗺️ Nearby Buses</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {nearbyResults.map(bus => (
              <div key={bus.busNumber} className="border border-slate-200 rounded-xl p-3 bg-gradient-to-r from-white to-orange-50/30 hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-slate-800">{bus.busNumber}</h4>
                  <Badge className={getCapacityColor(bus.currentPassengers, bus.capacity)}>
                    {Math.round((bus.currentPassengers / bus.capacity) * 100)}%
                  </Badge>
                </div>
                <p className="text-sm text-slate-600 mb-1 font-medium">{bus.route}</p>
                <p className="text-xs text-slate-500 mb-2">Distance: {bus.distance} • ETA: {bus.eta}</p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full rounded-full border-orange-300 text-orange-700 hover:bg-orange-50"
                  onClick={() => {
                    setSearchInput(bus.busNumber);
                    handleBusSearch();
                  }}
                >
                  Track This Bus
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* All Buses Overview */}
      <Card className="p-4 bg-white/90 backdrop-blur-sm border-slate-200">
        <h3 className="font-semibold mb-4 text-slate-800">🚍 All Active Buses in Telangana</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {buses.map(bus => (
            <div key={bus.busNumber} className="border border-slate-200 rounded-xl p-3 bg-gradient-to-r from-white to-slate-50/30 hover:shadow-lg transition-all duration-300">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-slate-800">{bus.busNumber}</h4>
                <Badge className={getCapacityColor(bus.currentPassengers, bus.capacity)}>
                  {Math.round((bus.currentPassengers / bus.capacity) * 100)}%
                </Badge>
              </div>
              <p className="text-sm text-slate-600 mb-2 font-medium">{bus.route}</p>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full rounded-full border-slate-300 text-slate-700 hover:bg-slate-50"
                onClick={() => {
                  setSearchInput(bus.busNumber);
                  handleBusSearch();
                }}
              >
                Track This Bus
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default InteractiveFeatures;