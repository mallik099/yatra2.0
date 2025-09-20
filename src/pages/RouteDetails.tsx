import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Users, 
  Wifi, 
  Snowflake, 
  Navigation,
  Phone,
  Star,
  AlertCircle
} from 'lucide-react';
import { Card } from '../components/ui/simple-card';
import { Button } from '../components/ui/simple-button';
import { Badge } from '../components/ui/simple-badge';

const RouteDetails: React.FC = () => {
  const { busNumber } = useParams();
  const [isTracking, setIsTracking] = useState(false);

  // Dynamic route data based on bus number
  const getRouteData = (busNum: string) => {
    const routes: { [key: string]: any } = {
      '100K': {
        number: '100K',
        operator: 'TSRTC',
        route: 'Secunderabad → Koti',
        currentLocation: 'Approaching Paradise Circle',
        eta: '3 min',
        nextStop: 'Paradise Circle',
        facilities: ['AC', 'WiFi', 'GPS'],
        occupancy: 'Medium',
        fare: '₹25',
        totalStops: 15,
        completedStops: 8
      },
      '156': {
        number: '156',
        operator: 'TSRTC',
        route: 'Mehdipatnam → KPHB',
        currentLocation: 'Approaching Ameerpet',
        eta: '5 min',
        nextStop: 'Ameerpet Metro',
        facilities: ['AC', 'WiFi'],
        occupancy: 'Low',
        fare: '₹30',
        totalStops: 18,
        completedStops: 10
      },
      '290U': {
        number: '290U',
        operator: 'TSRTC',
        route: 'LB Nagar → Gachibowli',
        currentLocation: 'Approaching Uppal',
        eta: '7 min',
        nextStop: 'Uppal X Roads',
        facilities: ['AC', 'WiFi', 'GPS'],
        occupancy: 'High',
        fare: '₹35',
        totalStops: 22,
        completedStops: 12
      }
    };
    
    return routes[busNum] || routes['100K'];
  };
  
  const routeData = {
    ...getRouteData(busNumber || '100K'),
    driver: {
      name: 'Ravi Kumar',
      rating: 4.8,
      phone: '+91 98765 43210'
    }
  };

  const upcomingStops = [
    { name: 'Paradise Circle', eta: '3 min', distance: '0.8 km' },
    { name: 'Begumpet', eta: '7 min', distance: '2.1 km' },
    { name: 'Prakash Nagar', eta: '12 min', distance: '3.5 km' },
    { name: 'Ameerpet', eta: '18 min', distance: '5.2 km' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white px-6 py-6">
        <div className="flex items-center space-x-4 mb-4">
          <Link to="/search">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{routeData.number}</h1>
            <p className="text-blue-100 text-sm">{routeData.route}</p>
          </div>
          <div className="bg-gradient-to-r from-teal-700 to-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
            {routeData.operator}
          </div>
        </div>
      </div>

      {/* Map Section */}
      <Card className="mx-4 sm:mx-6 -mt-4 bg-white/95 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
        <div className="h-48 sm:h-56 bg-gradient-to-br from-blue-100 to-teal-100 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-teal-600 rounded-full flex items-center justify-center mb-3 mx-auto">
                <Navigation className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <p className="text-gray-600 font-semibold text-sm sm:text-base">Live Bus Location</p>
              <p className="text-xs sm:text-sm text-gray-500">{routeData.currentLocation}</p>
            </div>
          </div>
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
            <Button
              onClick={() => setIsTracking(!isTracking)}
              size="sm"
              className={`rounded-full text-xs sm:text-sm font-semibold ${
                isTracking 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-teal-600 hover:bg-teal-700 text-white'
              }`}
            >
              {isTracking ? 'Stop' : 'Track'}
            </Button>
          </div>
        </div>
      </Card>

      <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Bus Info Card */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Bus Information</h3>
                <p className="text-sm text-gray-600">Real-time status</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-600">Live</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
              <div className="text-center p-2 sm:p-3 bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600 mx-auto mb-1" />
                <p className="text-xs sm:text-sm text-gray-600">ETA</p>
                <p className="font-bold text-sm sm:text-base text-teal-600">{routeData.eta}</p>
              </div>
              <div className="text-center p-2 sm:p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mx-auto mb-1" />
                <p className="text-xs sm:text-sm text-gray-600">Occupancy</p>
                <p className="font-bold text-sm sm:text-base text-blue-600">{routeData.occupancy}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-3 sm:space-y-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                <span className="text-xs sm:text-sm font-semibold text-gray-700">Facilities:</span>
                <div className="flex space-x-2">
                  {routeData.facilities.includes('AC') && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      <Snowflake className="w-3 h-3 mr-1" />
                      AC
                    </Badge>
                  )}
                  {routeData.facilities.includes('WiFi') && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      <Wifi className="w-3 h-3 mr-1" />
                      WiFi
                    </Badge>
                  )}
                </div>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xs sm:text-sm text-gray-600">Fare</p>
                <p className="font-bold text-base sm:text-lg text-teal-600">{routeData.fare}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{routeData.completedStops}/{routeData.totalStops} stops</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-teal-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(routeData.completedStops / routeData.totalStops) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Driver Info */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {routeData.driver.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{routeData.driver.name}</p>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-600">{routeData.driver.rating}</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="rounded-full">
                <Phone className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Upcoming Stops */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Upcoming Stops</h3>
            <div className="space-y-3">
              {upcomingStops.map((stop, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-teal-600' : 'bg-gray-300'
                    }`}></div>
                    <div>
                      <p className="font-semibold text-gray-800">{stop.name}</p>
                      <p className="text-sm text-gray-600">{stop.distance}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-teal-600">{stop.eta}</p>
                    {index === 0 && (
                      <Badge variant="secondary" className="bg-teal-100 text-teal-700 text-xs">
                        Next Stop
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Alert */}
        <Card className="bg-amber-50 border-amber-200 shadow-lg">
          <div className="p-4 flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <div>
              <p className="font-semibold text-amber-800">Traffic Alert</p>
              <p className="text-sm text-amber-700">Slight delay expected due to traffic at Begumpet junction</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RouteDetails;