import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Clock, ArrowRight, Loader, ArrowUpDown, AlertCircle, Settings } from 'lucide-react';
import { popularStops } from '../data/sampleData';
import { routeApi, RouteResult } from '../services/routeApi';
import { smartSearchService } from '../services/smartSearchService';
import SmartSearchInput from '../components/SmartSearchInput';
import QuickActions from '../components/QuickActions';
import SearchPreferences from '../components/SearchPreferences';

const RouteSearch: React.FC = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [routes, setRoutes] = useState<RouteResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [popularRoutes, setPopularRoutes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [contextualSuggestions, setContextualSuggestions] = useState<string[]>([]);
  const [showPreferences, setShowPreferences] = useState(false);



  useEffect(() => {
    const loadPopularRoutes = async () => {
      try {
        const routes = await routeApi.getPopularRoutes();
        setPopularRoutes(routes);
      } catch (err) {
        console.error('Failed to load popular routes:', err);
      }
    };
    loadPopularRoutes();
    
    // Initialize location services
    smartSearchService.getCurrentLocation();
  }, []);

  // Update contextual suggestions when source changes
  useEffect(() => {
    if (source) {
      const suggestions = smartSearchService.getContextualSuggestions(source);
      setContextualSuggestions(suggestions);
    } else {
      setContextualSuggestions([]);
    }
  }, [source]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!source || !destination) return;

    setIsSearching(true);
    setError(null);
    
    try {
      const results = await routeApi.searchRoutes(source, destination);
      setRoutes(results);
      
      // Add to search history
      smartSearchService.addToHistory(source, destination);
      
      if (results.length === 0) {
        setError('No routes found between these locations. Try different stops.');
      }
    } catch (err) {
      setError('Failed to search routes. Please try again.');
      console.error('Route search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const swapLocations = () => {
    const temp = source;
    setSource(destination);
    setDestination(temp);
  };

  const handlePopularRoute = (route: string) => {
    const [src, dest] = route.split(' - ');
    setSource(src);
    setDestination(dest);
    setRoutes([]);
    setError(null);
  };

  const handleQuickRoute = (src: string, dest: string) => {
    setSource(src);
    setDestination(dest);
    setRoutes([]);
    setError(null);
    // Auto-search when selecting from quick actions
    setTimeout(() => handleSearch(), 100);
  };

  const clearSearch = () => {
    setRoutes([]);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => window.history.back()} 
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Smart Route Search</h1>
        </div>
        <button
          onClick={() => setShowPreferences(true)}
          className="p-2 hover:bg-gray-100 rounded-lg"
          title="Search preferences"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <div className="searchbar-float-container">
        {/* Smart Search Bar */}
        <div className="searchbar-float">
          <form onSubmit={handleSearch} className="searchbar-form">
            <div className="searchbar-fields">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From
                </label>
                <SmartSearchInput
                  value={source}
                  onChange={(value) => {
                    setSource(value);
                    clearSearch();
                  }}
                  placeholder="Enter source location or use current location"
                  type="source"
                  allStops={popularStops}
                  onLocationDetected={(location) => setSource(location)}
                />
              </div>

              {/* Swap Button */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 md:block hidden">
                <button
                  type="button"
                  onClick={swapLocations}
                  className="bg-white border-2 border-gray-200 rounded-full p-2 hover:bg-gray-50 shadow-sm"
                >
                  <ArrowUpDown className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To
                </label>
                <SmartSearchInput
                  value={destination}
                  onChange={(value) => {
                    setDestination(value);
                    clearSearch();
                  }}
                  placeholder="Enter destination"
                  type="destination"
                  allStops={popularStops}
                  contextualSuggestions={contextualSuggestions}
                />
              </div>
            </div>

            {/* Mobile Swap Button */}
            <div className="md:hidden flex justify-center">
              <button
                type="button"
                onClick={swapLocations}
                className="bg-gray-100 rounded-lg p-2 hover:bg-gray-200"
              >
                <ArrowUpDown className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            
            <button
              type="submit"
              disabled={!source || !destination || isSearching}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSearching ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Finding Routes...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Find Best Routes</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="toast-notification bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Quick Actions and Popular Routes */}
        {routes.length === 0 && !error && (
          <div className="space-y-6">
            {/* Quick Actions */}
            <QuickActions onRouteSelect={handleQuickRoute} />
            
            {/* Popular Routes */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <ArrowRight className="w-5 h-5 text-blue-600" />
                <span>Popular Routes</span>
              </h3>
              <div className="grid gap-2">
                {popularRoutes.map((route, index) => (
                  <button
                    key={index}
                    onClick={() => handlePopularRoute(route)}
                    className="text-left p-3 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 group-hover:text-blue-600">{route}</span>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search Results */}
        {routes.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">Available Routes ({routes.length})</h3>
              <button
                onClick={clearSearch}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                New Search
              </button>
            </div>
            {routes.map((route) => (
              <div key={route.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                      {route.busNumber}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {route.source} → {route.destination}
                      </p>
                      <p className="text-sm text-gray-600">{route.frequency}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">₹{route.fare}</p>
                    <p className="text-sm text-gray-600">{route.duration}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Next bus in {route.nextBus}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      to={`/route/${route.busNumber}`}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 text-sm"
                    >
                      View Route
                    </Link>
                    <Link
                      to="/live"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                    >
                      Track Live
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Search Preferences Modal */}
      <SearchPreferences 
        isOpen={showPreferences} 
        onClose={() => setShowPreferences(false)} 
      />
    </div>
  );
};

export default RouteSearch;