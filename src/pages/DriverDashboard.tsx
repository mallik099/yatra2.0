import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Play, Square, Clock, Users } from 'lucide-react';

interface TripData {
  id: string;
  routeNumber: string;
  startTime: string;
  endTime?: string;
  status: 'active' | 'completed' | 'paused';
  passengerCount: number;
}

export default function DriverDashboard() {
  const [isOnTrip, setIsOnTrip] = useState(false);
  const [currentTrip, setCurrentTrip] = useState<TripData | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    // Auto location updates every 10 seconds when on trip
    let interval: NodeJS.Timeout;
    if (isOnTrip) {
      interval = setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
            setLastUpdate(new Date());
            // Send location to backend
            updateDriverLocation(position.coords.latitude, position.coords.longitude);
          },
          (error) => console.error('Location error:', error)
        );
      }, 10000);
    }
    return () => clearInterval(interval);
  }, [isOnTrip]);

  const updateDriverLocation = async (lat: number, lng: number) => {
    try {
      await fetch('/api/driver/location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng, timestamp: new Date().toISOString() })
      });
    } catch (error) {
      console.error('Failed to update location:', error);
    }
  };

  const startTrip = () => {
    const trip: TripData = {
      id: Date.now().toString(),
      routeNumber: 'Route 42',
      startTime: new Date().toISOString(),
      status: 'active',
      passengerCount: 0
    };
    setCurrentTrip(trip);
    setIsOnTrip(true);
  };

  const endTrip = () => {
    if (currentTrip) {
      setCurrentTrip({
        ...currentTrip,
        endTime: new Date().toISOString(),
        status: 'completed'
      });
    }
    setIsOnTrip(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-4">
      <div className="max-w-md mx-auto space-y-4">
        {/* Header */}
        <Card className="border-yellow-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <MapPin className="h-5 w-5" />
              Driver Dashboard
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Trip Control */}
        <Card className="border-yellow-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              {!isOnTrip ? (
                <Button 
                  onClick={startTrip}
                  className="w-full h-16 text-lg bg-green-600 hover:bg-green-700"
                >
                  <Play className="mr-2 h-6 w-6" />
                  Start Trip
                </Button>
              ) : (
                <Button 
                  onClick={endTrip}
                  className="w-full h-16 text-lg bg-red-600 hover:bg-red-700"
                >
                  <Square className="mr-2 h-6 w-6" />
                  End Trip
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Current Trip Info */}
        {currentTrip && (
          <Card className="border-yellow-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Current Trip</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Route</span>
                <Badge variant="outline">{currentTrip.routeNumber}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status</span>
                <Badge className={
                  currentTrip.status === 'active' ? 'bg-green-100 text-green-800' : 
                  'bg-gray-100 text-gray-800'
                }>
                  {currentTrip.status}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Start Time</span>
                <span className="text-sm font-medium">
                  {new Date(currentTrip.startTime).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Passengers</span>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-medium">{currentTrip.passengerCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Location Status */}
        <Card className="border-yellow-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">GPS Status</span>
              <Badge className={location ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {location ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            {location && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Coordinates</span>
                  <span className="text-xs font-mono">
                    {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last Update</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs">{lastUpdate.toLocaleTimeString()}</span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}