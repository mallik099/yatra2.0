import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bus, 
  MapPin, 
  Clock, 
  Users, 
  AlertTriangle, 
  TrendingUp,
  Activity,
  BarChart3
} from 'lucide-react';

interface FleetData {
  id: string;
  routeNumber: string;
  driverName: string;
  status: 'on-time' | 'delayed' | 'breakdown' | 'offline';
  location: { lat: number; lng: number };
  passengerCount: number;
  lastUpdate: string;
  delayMinutes?: number;
}

interface Analytics {
  totalBuses: number;
  activeBuses: number;
  avgDelay: number;
  totalPassengers: number;
  onTimePercentage: number;
}

export default function AdminDashboard() {
  const [fleetData, setFleetData] = useState<FleetData[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({
    totalBuses: 0,
    activeBuses: 0,
    avgDelay: 0,
    totalPassengers: 0,
    onTimePercentage: 0
  });

  useEffect(() => {
    fetchFleetData();
    fetchAnalytics();
    
    // Real-time updates every 30 seconds
    const interval = setInterval(() => {
      fetchFleetData();
      fetchAnalytics();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchFleetData = async () => {
    try {
      const response = await fetch('/api/admin/fleet');
      const data = await response.json();
      setFleetData(data);
    } catch (error) {
      console.error('Failed to fetch fleet data:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics');
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-time': return 'bg-green-100 text-green-800';
      case 'delayed': return 'bg-yellow-100 text-yellow-800';
      case 'breakdown': return 'bg-red-100 text-red-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'breakdown': return <AlertTriangle className="h-4 w-4" />;
      case 'offline': return <Activity className="h-4 w-4" />;
      default: return <Bus className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Fleet Management</h1>
          <div className="flex gap-2">
            <Button variant="outline">Export Data</Button>
            <Button className="bg-yellow-600 hover:bg-yellow-700">Add Bus</Button>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Buses</p>
                  <p className="text-2xl font-bold">{analytics.totalBuses}</p>
                </div>
                <Bus className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Buses</p>
                  <p className="text-2xl font-bold text-green-600">{analytics.activeBuses}</p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Delay</p>
                  <p className="text-2xl font-bold text-yellow-600">{analytics.avgDelay}m</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Passengers</p>
                  <p className="text-2xl font-bold text-purple-600">{analytics.totalPassengers}</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">On Time %</p>
                  <p className="text-2xl font-bold text-green-600">{analytics.onTimePercentage}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="fleet" className="space-y-4">
          <TabsList>
            <TabsTrigger value="fleet">Live Fleet</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="routes">Route Management</TabsTrigger>
          </TabsList>

          <TabsContent value="fleet" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Real-time Fleet Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fleetData.map((bus) => (
                    <div key={bus.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(bus.status)}
                          <div>
                            <h3 className="font-semibold">Route {bus.routeNumber}</h3>
                            <p className="text-sm text-gray-600">{bus.driverName}</p>
                          </div>
                        </div>
                        
                        <Badge className={getStatusColor(bus.status)}>
                          {bus.status}
                          {bus.delayMinutes && ` (+${bus.delayMinutes}m)`}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Passengers</p>
                          <p className="font-semibold">{bus.passengerCount}</p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Last Update</p>
                          <p className="text-xs">{new Date(bus.lastUpdate).toLocaleTimeString()}</p>
                        </div>

                        <Button size="sm" variant="outline">
                          Track
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Route Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['Route 42', 'Route 15', 'Route 8', 'Route 23'].map((route, index) => (
                      <div key={route} className="flex justify-between items-center">
                        <span className="font-medium">{route}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${85 + index * 3}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{85 + index * 3}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Demand Heatmap</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 168 }, (_, i) => (
                      <div
                        key={i}
                        className={`h-3 w-3 rounded-sm ${
                          Math.random() > 0.7 ? 'bg-red-400' :
                          Math.random() > 0.4 ? 'bg-yellow-400' : 'bg-green-400'
                        }`}
                        title={`Hour ${i % 24}, Day ${Math.floor(i / 24) + 1}`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 mt-2">
                    <span>Low Demand</span>
                    <span>High Demand</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="routes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Route Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">Route management features coming soon</p>
                  <Button variant="outline">Add New Route</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}