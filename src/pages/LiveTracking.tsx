import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LiveMap from '@/components/Map/LiveMap';
import RouteSearch from '@/components/Map/RouteSearch';
import { MapPin, Route } from 'lucide-react';

const LiveTracking = () => {
  return (
    <div className="min-h-screen">
      <Tabs defaultValue="tracking" className="h-screen">
        <TabsList className="grid w-full grid-cols-2 sticky top-0 z-10">
          <TabsTrigger value="tracking" className="flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            Live Tracking
          </TabsTrigger>
          <TabsTrigger value="routing" className="flex items-center">
            <Route className="w-4 h-4 mr-2" />
            Route Planning
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="tracking" className="h-full mt-0">
          <LiveMap />
        </TabsContent>
        
        <TabsContent value="routing" className="h-full mt-0">
          <div className="h-full p-4">
            <RouteSearch onRouteCalculated={(route, start, end) => {
              console.log('Route calculated:', route, start, end);
            }} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LiveTracking;