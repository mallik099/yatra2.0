import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bus, MapPin, Clock, Navigation } from 'lucide-react';

interface BusMarker {
  id: string;
  routeNumber: string;
  position: { lat: number; lng: number };
  heading: number;
  eta: number;
  status: 'on-time' | 'delayed' | 'early';
}

interface BusStop {
  id: string;
  name: string;
  position: { lat: number; lng: number };
}

export default function RapidoStyleMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [buses, setBuses] = useState<BusMarker[]>([
    {
      id: '1',
      routeNumber: '42',
      position: { lat: 12.9716, lng: 77.5946 },
      heading: 45,
      eta: 5,
      status: 'on-time'
    },
    {
      id: '2',
      routeNumber: '15',
      position: { lat: 12.9800, lng: 77.6000 },
      heading: 180,
      eta: 12,
      status: 'delayed'
    }
  ]);

  const [busStops] = useState<BusStop[]>([
    { id: '1', name: 'MG Road', position: { lat: 12.9716, lng: 77.5946 } },
    { id: '2', name: 'Brigade Road', position: { lat: 12.9750, lng: 77.5980 } },
    { id: '3', name: 'Commercial St', position: { lat: 12.9800, lng: 77.6000 } }
  ]);

  const [selectedBus, setSelectedBus] = useState<BusMarker | null>(null);

  useEffect(() => {
    // Simulate bus movement every 3 seconds
    const interval = setInterval(() => {
      setBuses(prevBuses => 
        prevBuses.map(bus => ({
          ...bus,
          position: {
            lat: bus.position.lat + (Math.random() - 0.5) * 0.001,
            lng: bus.position.lng + (Math.random() - 0.5) * 0.001
          },
          heading: bus.heading + (Math.random() - 0.5) * 20,
          eta: Math.max(1, bus.eta + Math.floor(Math.random() * 3) - 1)
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-time': return '#10B981';
      case 'delayed': return '#F59E0B';
      case 'early': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  return (
    <div className="relative w-full h-screen bg-gray-100">
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full relative overflow-hidden">
        {/* Simulated Map Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100">
          {/* Grid lines to simulate map */}
          <svg className="w-full h-full opacity-20">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#94A3B8" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Bus Stops */}
        {busStops.map((stop) => (
          <div
            key={stop.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
            style={{
              left: `${(stop.position.lng - 77.5900) * 5000 + 50}%`,
              top: `${(12.9800 - stop.position.lat) * 5000 + 50}%`
            }}
          >
            <div className="bg-white rounded-full p-2 shadow-lg border-2 border-blue-500">
              <MapPin className="h-4 w-4 text-blue-600" />
            </div>
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs font-medium whitespace-nowrap">
              {stop.name}
            </div>
          </div>
        ))}

        {/* Moving Buses */}
        {buses.map((bus) => (
          <div
            key={bus.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer transition-all duration-1000"
            style={{
              left: `${(bus.position.lng - 77.5900) * 5000 + 50}%`,
              top: `${(12.9800 - bus.position.lat) * 5000 + 50}%`,
              transform: `translate(-50%, -50%) rotate(${bus.heading}deg)`
            }}
            onClick={() => setSelectedBus(bus)}
          >
            <div className="relative">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg animate-pulse"
                style={{ backgroundColor: getStatusColor(bus.status) }}
              >
                <Bus className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs font-bold">
                {bus.routeNumber}
              </div>
              {/* Ripple effect */}
              <div className="absolute inset-0 rounded-lg animate-ping opacity-30" style={{ backgroundColor: getStatusColor(bus.status) }} />
            </div>
          </div>
        ))}

        {/* Route Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-5">
          <path
            d="M 20% 30% Q 50% 20% 80% 70%"
            stroke="#F59E0B"
            strokeWidth="3"
            fill="none"
            strokeDasharray="10,5"
            className="opacity-60"
          />
          <path
            d="M 10% 60% Q 40% 80% 90% 40%"
            stroke="#3B82F6"
            strokeWidth="3"
            fill="none"
            strokeDasharray="10,5"
            className="opacity-60"
          />
        </svg>
      </div>

      {/* Bus Info Card */}
      {selectedBus && (
        <Card className="absolute bottom-4 left-4 right-4 z-30 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Bus className="h-8 w-8 text-yellow-600" />
                  <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full`} style={{ backgroundColor: getStatusColor(selectedBus.status) }} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Route {selectedBus.routeNumber}</h3>
                  <p className="text-sm text-gray-600">Live Tracking</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedBus(null)}
                className="text-gray-500"
              >
                ×
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-2xl font-bold text-green-600">{selectedBus.eta} min</span>
                <span className="text-sm text-gray-500">ETA</span>
              </div>
              
              <Badge className={`${
                selectedBus.status === 'on-time' ? 'bg-green-100 text-green-800' :
                selectedBus.status === 'delayed' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {selectedBus.status}
              </Badge>
            </div>

            <div className="mt-3 flex gap-2">
              <Button size="sm" className="flex-1 bg-yellow-600 hover:bg-yellow-700">
                <Navigation className="mr-1 h-4 w-4" />
                Get Directions
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                Set Reminder
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <Card className="absolute top-4 right-4 z-30">
        <CardContent className="p-3">
          <h4 className="font-semibold mb-2 text-sm">Bus Status</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>On Time</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Delayed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Early</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}