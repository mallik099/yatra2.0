import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  ArrowUpDown, 
  Clock, 
  MapPin, 
  Users, 
  Wifi, 
  Snowflake,
  ArrowRight,
  Navigation,
  Star
} from 'lucide-react';
import { Card } from '../components/ui/simple-card';
import { Button } from '../components/ui/simple-button';
import { Badge } from '../components/ui/simple-badge';
import BottomNavigation from '../components/BottomNavigation';

const RoutePlanning: React.FC = () => {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [savedRoutes, setSavedRoutes] = useState<string[]>([]);
  const [reminders, setReminders] = useState<string[]>([]);

  const popularLocations = [
    'Secunderabad Railway Station',
    'Gachibowli',
    'HITEC City',
    'Ameerpet',
    'Begumpet',
    'Koti',
    'Mehdipatnam',
    'KPHB',
    'LB Nagar',
    'Uppal',
    'Charminar',
    'Jubilee Hills',
    'Banjara Hills',
    'Kondapur',
    'Madhapur'
  ];

  const swapLocations = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
  };

  const handleSearch = async () => {
    if (!fromLocation.trim() || !toLocation.trim()) {
      alert('Please enter both source and destination');
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    
    // Simulate API call
    setTimeout(() => {
      const filteredRoutes = suggestedRoutes.filter(route => 
        route.steps.some(step => 
          step.from.toLowerCase().includes(fromLocation.toLowerCase()) ||
          step.to.toLowerCase().includes(toLocation.toLowerCase())
        )
      );
      
      setSearchResults(filteredRoutes.length > 0 ? filteredRoutes : suggestedRoutes);
      setIsSearching(false);
    }, 1000);
  };

  const suggestedRoutes = [
    {
      id: '1',
      buses: ['100K', '156'],
      duration: '45 min',
      transfers: 1,
      fare: '₹35',
      departure: '10:15 AM',
      eta: '11:00 AM',
      occupancy: 'Low',
      facilities: ['AC', 'WiFi'],
      rating: 4.5,
      steps: [
        { bus: '100K', from: 'Secunderabad', to: 'Ameerpet', duration: '25 min' },
        { bus: '156', from: 'Ameerpet', to: 'Gachibowli', duration: '20 min' }
      ]
    },
    {
      id: '2',
      buses: ['290U'],
      duration: '55 min',
      transfers: 0,
      fare: '₹28',
      departure: '10:20 AM',
      eta: '11:15 AM',
      occupancy: 'Medium',
      facilities: ['AC'],
      rating: 4.2,
      steps: [
        { bus: '290U', from: 'Secunderabad', to: 'Gachibowli', duration: '55 min' }
      ]
    },
    {
      id: '3',
      buses: ['218', '290'],
      duration: '50 min',
      transfers: 1,
      fare: '₹32',
      departure: '10:25 AM',
      eta: '11:15 AM',
      occupancy: 'High',
      facilities: ['AC', 'WiFi'],
      rating: 4.3,
      steps: [
        { bus: '218', from: 'Secunderabad', to: 'Uppal', duration: '30 min' },
        { bus: '290', from: 'Uppal', to: 'Gachibowli', duration: '20 min' }
      ]
    }
  ];

  const getOccupancyColor = (occupancy: string) => {
    switch (occupancy) {
      case 'Low': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'High': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleSaveRoute = () => {
    if (fromLocation && toLocation) {
      const routeKey = `${fromLocation}-${toLocation}`;
      if (!savedRoutes.includes(routeKey)) {
        setSavedRoutes([...savedRoutes, routeKey]);
        alert(`Route saved: ${fromLocation} to ${toLocation}`);
      } else {
        alert('Route already saved!');
      }
    } else {
      alert('Please enter both locations first');
    }
  };

  const handleSetReminder = () => {
    if (fromLocation && toLocation) {
      const routeKey = `${fromLocation}-${toLocation}`;
      if (!reminders.includes(routeKey)) {
        setReminders([...reminders, routeKey]);
        alert(`Reminder set for route: ${fromLocation} to ${toLocation}`);
      } else {
        alert('Reminder already set!');
      }
    } else {
      alert('Please enter both locations first');
    }
  };

  const handleRouteClick = (route: any) => {
    setFromLocation(route.steps[0].from);
    setToLocation(route.steps[route.steps.length - 1].to);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 px-6 py-4 shadow-sm">
        <div className="flex items-center space-x-3 mb-4">
          <Link to="/home">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-white">Route Search</h1>
            <p className="text-sm text-gray-300">Find the best route</p>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="flex-1 space-y-3">
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-green-500 rounded-full"></div>
                <input
                  type="text"
                  placeholder="Enter source location"
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  onFocus={() => setShowFromSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowFromSuggestions(false), 200)}
                  className="w-full pl-8 pr-4 py-3 bg-gray-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />
                {showFromSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-40 overflow-y-auto z-10">
                    {popularLocations
                      .filter(loc => loc.toLowerCase().includes(fromLocation.toLowerCase()))
                      .slice(0, 5)
                      .map((location, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            setFromLocation(location);
                            setShowFromSuggestions(false);
                          }}
                          className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
                        >
                          {location}
                        </div>
                      ))
                    }
                  </div>
                )}
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full"></div>
                <input
                  type="text"
                  placeholder="Enter destination"
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                  onFocus={() => setShowToSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowToSuggestions(false), 200)}
                  className="w-full pl-8 pr-4 py-3 bg-gray-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />
                {showToSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-40 overflow-y-auto z-10">
                    {popularLocations
                      .filter(loc => loc.toLowerCase().includes(toLocation.toLowerCase()))
                      .slice(0, 5)
                      .map((location, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            setToLocation(location);
                            setShowToSuggestions(false);
                          }}
                          className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
                        >
                          {location}
                        </div>
                      ))
                    }
                  </div>
                )}
              </div>
            </div>
            <Button
              onClick={swapLocations}
              variant="ghost"
              size="icon"
              className="rounded-full h-8 w-8"
            >
              <ArrowUpDown className="w-4 h-4" />
            </Button>
          </div>
          <Button 
            onClick={handleSearch}
            disabled={isSearching}
            className="w-full mt-4 bg-white hover:bg-gray-100 text-black rounded-xl py-3 text-sm font-medium disabled:opacity-50"
          >
            {isSearching ? (
              <div className="w-4 h-4 mr-2 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Search className="w-4 h-4 mr-2" />
            )}
            {isSearching ? 'Searching...' : 'Search Routes'}
          </Button>
        </div>
      </div>

      <div className="px-6 py-4">
        {/* Results Header */}
        {hasSearched && (
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {searchResults.length > 0 ? 'Search Results' : 'No Routes Found'}
              </h2>
              <p className="text-sm text-gray-600">
                {searchResults.length > 0 
                  ? `${searchResults.length} routes found from ${fromLocation} to ${toLocation}`
                  : 'Try different locations or check spelling'
                }
              </p>
            </div>
            <Button variant="outline" size="sm" className="rounded-lg text-xs">
              <Navigation className="w-3 h-3 mr-1" />
              Filter
            </Button>
          </div>
        )}

        {/* Route Cards */}
        {hasSearched && (
          <div className="space-y-3">
            {(searchResults.length > 0 ? searchResults : []).map((route, index) => (
            <Link key={route.id} to={`/route/${route.buses[0]}`}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="p-4">
                  {/* Route Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {route.buses.map((bus, busIndex) => (
                        <React.Fragment key={bus}>
                          <div className="bg-teal-600 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                            {bus}
                          </div>
                          {busIndex < route.buses.length - 1 && (
                            <ArrowRight className="w-3 h-3 text-gray-400" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs font-medium text-gray-700">{route.rating}</span>
                    </div>
                  </div>

                  {/* Route Info Grid */}
                  <div className="grid grid-cols-4 gap-3 mb-3">
                    <div className="text-center">
                      <Clock className="w-4 h-4 text-teal-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Duration</p>
                      <p className="font-medium text-xs">{route.duration}</p>
                    </div>
                    <div className="text-center">
                      <ArrowUpDown className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Transfers</p>
                      <p className="font-medium text-xs">{route.transfers}</p>
                    </div>
                    <div className="text-center">
                      <Users className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Occupancy</p>
                      <div className={`text-xs px-2 py-0.5 rounded-full ${getOccupancyColor(route.occupancy)}`}>
                        {route.occupancy}
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Fare</p>
                      <p className="font-semibold text-sm text-teal-600">{route.fare}</p>
                    </div>
                  </div>

                  {/* Time Info */}
                  <div className="flex items-center justify-between mb-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Departure</p>
                      <p className="font-medium text-xs text-teal-700">{route.departure}</p>
                    </div>
                    <div className="flex-1 mx-3">
                      <div className="h-0.5 bg-teal-300 rounded-full"></div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Arrival</p>
                      <p className="font-medium text-xs text-blue-700">{route.eta}</p>
                    </div>
                  </div>

                  {/* Facilities */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Facilities:</span>
                      <div className="flex space-x-1">
                        {route.facilities.includes('AC') && (
                          <Snowflake className="w-4 h-4 text-blue-500" />
                        )}
                        {route.facilities.includes('WiFi') && (
                          <Wifi className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                    </div>
                    <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white rounded-lg px-3 py-1 text-xs">
                      Select
                    </Button>
                  </div>

                  {/* Route Steps (for multi-transfer routes) */}
                  {route.transfers > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Journey Steps:</p>
                      <div className="space-y-2">
                        {route.steps.map((step, stepIndex) => (
                          <div key={stepIndex} className="flex items-center space-x-3 text-sm">
                            <div className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold">
                              {step.bus}
                            </div>
                            <span className="text-gray-600">
                              {step.from} → {step.to}
                            </span>
                            <span className="text-gray-500">({step.duration})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Link>
            ))}
          </div>
        )}
        
        {/* Default suggestions when no search */}
        {!hasSearched && (
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Popular Routes</h2>
              <p className="text-sm text-gray-600">Frequently searched routes in Hyderabad</p>
            </div>
            <div className="space-y-3">
              {suggestedRoutes.map((route, index) => (
                <div 
                  key={route.id} 
                  onClick={() => handleRouteClick(route)}
                  className="cursor-pointer"
                >
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {route.buses.map((bus, busIndex) => (
                            <React.Fragment key={bus}>
                              <div className="bg-teal-600 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                                {bus}
                              </div>
                              {busIndex < route.buses.length - 1 && (
                                <ArrowRight className="w-3 h-3 text-gray-400" />
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-xs font-medium text-gray-700">{route.rating}</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {route.steps[0].from} → {route.steps[route.steps.length - 1].to}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{route.duration} • {route.transfers} transfers</span>
                        <span className="font-semibold text-sm text-teal-600">{route.fare}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={handleSaveRoute}
              variant="outline" 
              className="py-2 rounded-lg border-teal-200 text-teal-700 hover:bg-teal-50 text-sm"
            >
              <MapPin className="w-3 h-3 mr-1" />
              Save Route
            </Button>
            <Button 
              onClick={handleSetReminder}
              variant="outline" 
              className="py-2 rounded-lg border-blue-200 text-blue-700 hover:bg-blue-50 text-sm"
            >
              <Clock className="w-3 h-3 mr-1" />
              Set Reminder
            </Button>
          </div>
          
          {/* Saved Routes Display */}
          {savedRoutes.length > 0 && (
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Saved Routes ({savedRoutes.length})</h3>
              <div className="space-y-1">
                {savedRoutes.slice(-3).map((route, index) => (
                  <div key={index} className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                    {route}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNavigation />
      
      {/* Bottom padding to account for fixed navigation */}
      <div className="h-20"></div>
    </div>
  );
};

export default RoutePlanning;