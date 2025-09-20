import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Clock, ArrowRight, Loader, ArrowUpDown, AlertCircle, Settings, Sparkles } from 'lucide-react';
import { popularStops } from '../data/sampleData';
import { routeApi, RouteResult } from '../services/routeApi';
import { smartSearchService } from '../services/smartSearchService';
import SmartSearchInput from '../components/SmartSearchInput';
import QuickActions from '../components/QuickActions';
import SearchPreferences from '../components/SearchPreferences';
import LanguageSelector from '../components/LanguageSelector';
import { useLanguage } from '../contexts/LanguageContext';
import '../styles/enhanced-design.css';

const RouteSearch: React.FC = () => {
  const { t } = useLanguage();
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl float-animation"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-indigo-600/20 rounded-full blur-3xl float-animation" style={{animationDelay: '2s'}}></div>
      </div>
      
      {/* Header */}
      <div className="glass-card mx-4 mt-4 p-4 flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => window.history.back()} 
            className="p-3 hover:bg-white/20 rounded-xl transition-all duration-300 icon-animate"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h1 className="text-xl font-bold gradient-text">{t('smartRouteSearch')}</h1>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <LanguageSelector />
          <button
            onClick={() => setShowPreferences(true)}
            className="p-3 hover:bg-white/20 rounded-xl transition-all duration-300 icon-animate"
            title={t('searchPreferences')}
          >
            <Settings className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      <div className="px-4 py-6 relative z-10">
        {/* Smart Search Bar */}
        <div className="search-container max-w-2xl mx-auto">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid gap-6 md:gap-8">
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{t('from')}</span>
                </label>
                <SmartSearchInput
                  value={source}
                  onChange={(value) => {
                    setSource(value);
                    clearSearch();
                  }}
                  placeholder={t('enterSource')}
                  type="source"
                  allStops={popularStops}
                  onLocationDetected={(location) => setSource(location)}
                />
              </div>

              {/* Swap Button */}
              <div className="flex justify-center my-4">
                <button
                  type="button"
                  onClick={swapLocations}
                  className="glass-card p-3 hover:bg-white/30 transition-all duration-300 group"
                >
                  <ArrowUpDown className="w-5 h-5 text-gray-600 group-hover:text-purple-600 transition-colors" />
                </button>
              </div>
              
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>{t('to')}</span>
                </label>
                <SmartSearchInput
                  value={destination}
                  onChange={(value) => {
                    setDestination(value);
                    clearSearch();
                  }}
                  placeholder={t('enterDestination')}
                  type="destination"
                  allStops={popularStops}
                  contextualSuggestions={contextualSuggestions}
                />
              </div>
            </div>


            
            <button
              type="submit"
              disabled={!source || !destination || isSearching}
              className="btn-primary w-full py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 text-lg font-semibold"
            >
              {isSearching ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>{t('findingRoutes')}</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>{t('findBestRoutes')}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="glass-card bg-red-50/80 border-red-200/50 p-6 mb-6 flex items-center space-x-3 max-w-2xl mx-auto">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <span className="text-red-800 font-medium">{error}</span>
          </div>
        )}

        {/* Quick Actions and Popular Routes */}
        {routes.length === 0 && !error && (
          <div className="space-y-6">
            {/* Quick Actions */}
            <QuickActions onRouteSelect={handleQuickRoute} />
            
            {/* Popular Routes */}
            <div className="glass-card p-8 max-w-2xl mx-auto">
              <h3 className="font-bold text-xl text-gray-800 mb-6 flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
                <span className="gradient-text">{t('popularRoutes')}</span>
              </h3>
              <div className="grid gap-3">
                {popularRoutes.map((route, index) => (
                  <button
                    key={index}
                    onClick={() => handlePopularRoute(route)}
                    className="quick-action-card text-left group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 group-hover:text-purple-700 font-medium transition-colors">{route}</span>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-all duration-300 group-hover:translate-x-1" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search Results */}
        {routes.length > 0 && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-2xl font-bold gradient-text flex items-center space-x-2">
                <span>{t('availableRoutes')}</span>
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {routes.length}
                </span>
              </h3>
              <button
                onClick={clearSearch}
                className="glass-card px-4 py-2 text-purple-600 hover:text-purple-700 font-medium transition-all duration-300"
              >
                {t('newSearch')}
              </button>
            </div>
            <div className="grid gap-6">
              {routes.map((route) => (
                <div key={route.id} className="route-card group">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="bus-badge">
                        {route.busNumber}
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-800 mb-1">
                          {route.source} → {route.destination}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{route.frequency}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                        ₹{route.fare}
                      </p>
                      <p className="text-sm text-gray-600 font-medium">{route.duration}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Clock className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{t('nextBusIn')}</p>
                        <p className="text-lg font-bold text-blue-600">{route.nextBus}</p>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <Link
                        to={`/route/${route.busNumber}`}
                        className="glass-card px-6 py-3 text-gray-700 hover:text-gray-900 font-medium transition-all duration-300 hover:bg-white/40"
                      >
                        {t('viewRoute')}
                      </Link>
                      <Link
                        to="/live"
                        className="btn-primary px-6 py-3 text-sm font-semibold"
                      >
                        {t('trackLive')}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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