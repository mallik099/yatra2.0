import React, { useState, useEffect } from 'react';
import { MapPin, Clock, ArrowRight, Navigation } from 'lucide-react';
import { smartSearchService, SearchHistory } from '../services/smartSearchService';

interface QuickActionsProps {
  onRouteSelect: (source: string, destination: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onRouteSelect }) => {
  const [recentSearches, setRecentSearches] = useState<SearchHistory[]>([]);
  const [frequentRoutes, setFrequentRoutes] = useState<SearchHistory[]>([]);

  useEffect(() => {
    setRecentSearches(smartSearchService.getRecentSearches(3));
    setFrequentRoutes(smartSearchService.getFrequentSearches(3));
  }, []);

  const handleQuickRoute = (source: string, destination: string) => {
    onRouteSelect(source, destination);
  };

  if (recentSearches.length === 0 && frequentRoutes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-4">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span>Recent Searches</span>
          </h3>
          <div className="space-y-2">
            {recentSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => handleQuickRoute(search.source, search.destination)}
                className="w-full text-left p-3 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-800">
                        {search.source} → {search.destination}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(search.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Frequent Routes */}
      {frequentRoutes.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-4">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
            <Navigation className="w-5 h-5 text-green-600" />
            <span>Your Frequent Routes</span>
          </h3>
          <div className="space-y-2">
            {frequentRoutes.map((route, index) => (
              <button
                key={index}
                onClick={() => handleQuickRoute(route.source, route.destination)}
                className="w-full text-left p-3 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                      {route.frequency}x
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">
                        {route.source} → {route.destination}
                      </div>
                      <div className="text-xs text-gray-500">
                        Used {route.frequency} times
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickActions;