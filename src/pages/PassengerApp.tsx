import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  MapPin, 
  Clock, 
  Search, 
  Navigation, 
  Bus, 
  Wifi, 
  WifiOff,
  Bell,
  Filter
} from 'lucide-react';

interface BusData {
  id: string;
  routeNumber: string;
  destination: string;
  currentLocation: { lat: number; lng: number };
  eta: number;
  status: 'on-time' | 'delayed' | 'early';
  occupancy: 'low' | 'medium' | 'high';
  nextStop: string;
}

interface BusStop {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  distance: number;
}

export default function PassengerApp() {
  const [buses, setBuses] = useState<BusData[]>([]);
  const [nearbyStops, setNearbyStops] = useState<BusStop[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [isLowBandwidth, setIsLowBandwidth] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Get user location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        fetchNearbyData(position.coords.latitude, position.coords.longitude);
      },
      (error) => console.error('Location error:', error)
    );

    // Real-time updates every 10 seconds
    const interval = setInterval(fetchBusData, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchBusData = async () => {
    try {
      const response = await fetch('/api/buses/live');
      const data = await response.json();
      setBuses(data);
    } catch (error) {
      console.error('Failed to fetch bus data:', error);
    }
  };

  const fetchNearbyData = async (lat: number, lng: number) => {
    try {
      const response = await fetch(`/api/stops/nearby?lat=${lat}&lng=${lng}`);
      const stops = await response.json();
      setNearbyStops(stops);
    } catch (error) {
      console.error('Failed to fetch nearby stops:', error);
    }
  };

  const filteredBuses = buses.filter(bus => 
    bus.routeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bus.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-time': return 'bg-green-100 text-green-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      case 'early': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOccupancyColor = (occupancy: string) => {
    switch (occupancy) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-yellow-200 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-yellow-800">Yatra</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLowBandwidth(!isLowBandwidth)}
              className="text-yellow-700"
            >
              {isLowBandwidth ? <WifiOff className="h-4 w-4" /> : <Wifi className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" className="text-yellow-700">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search routes or destinations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-yellow-200 focus:border-yellow-400"
          />
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button variant="outline" size="sm" className="whitespace-nowrap border-yellow-200">
            <Navigation className="mr-1 h-4 w-4" />
            Nearest Stop
          </Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap border-yellow-200">
            <Filter className="mr-1 h-4 w-4" />
            Filter Routes
          </Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap border-yellow-200">
            <Clock className="mr-1 h-4 w-4" />
            Schedules
          </Button>
        </div>

        {/* Live Bus Cards */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-800">Live Buses</h2>
          {filteredBuses.map((bus) => (
            <Card key={bus.id} className="border-yellow-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Bus className="h-8 w-8 text-yellow-600" />
                      <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getOccupancyColor(bus.occupancy)}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">Route {bus.routeNumber}</h3>
                      <p className="text-sm text-gray-600">{bus.destination}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(bus.status)}>
                    {bus.status}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-lg font-bold text-green-600">
                      {bus.eta} min
                    </span>
                    <span className="text-sm text-gray-500">ETA</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Next Stop</p>
                    <p className="text-sm font-medium">{bus.nextStop}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.max(10, 100 - (bus.eta * 5))}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Nearby Stops */}
        <Sheet>
          <SheetTrigger asChild>
            <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
              <MapPin className="mr-2 h-4 w-4" />
              View Nearby Stops
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[60vh]">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Nearby Bus Stops</h3>
              {nearbyStops.map((stop) => (
                <Card key={stop.id} className="border-yellow-200">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{stop.name}</h4>
                        <p className="text-sm text-gray-600">{stop.distance}m away</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Navigation className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </SheetContent>
        </Sheet>

        {/* Low Bandwidth Mode */}
        {isLowBandwidth && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Low Bandwidth Mode</h3>
              <div className="space-y-2 text-sm">
                {filteredBuses.map((bus) => (
                  <div key={bus.id} className="flex justify-between">
                    <span>Route {bus.routeNumber}</span>
                    <span className="font-medium">{bus.eta} min</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}