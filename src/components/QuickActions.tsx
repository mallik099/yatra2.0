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
        <div className="glass-card p-6 max-w-2xl mx-auto">
          <h3 className="font-bold text-xl text-gray-800 mb-6 flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <span className="gradient-text">Recent Searches</span>
          </h3>
          <div className="space-y-3">
            {recentSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => handleQuickRoute(search.source, search.destination)}
                className="quick-action-card w-full text-left group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                      <MapPin className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
                        {search.source} → {search.destination}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">
                        {new Date(search.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-all duration-300 group-hover:translate-x-1" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Frequent Routes */}
      {frequentRoutes.length > 0 && (
        <div className="glass-card p-6 max-w-2xl mx-auto">
          <h3 className="font-bold text-xl text-gray-800 mb-6 flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
              <Navigation className="w-5 h-5 text-white" />
            </div>
            <span className="gradient-text">Your Frequent Routes</span>
          </h3>
          <div className="space-y-3">
            {frequentRoutes.map((route, index) => (
              <button
                key={index}
                onClick={() => handleQuickRoute(route.source, route.destination)}
                className="quick-action-card w-full text-left group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-2 rounded-xl text-sm font-bold shadow-lg">
                      {route.frequency}x
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 group-hover:text-green-700 transition-colors">
                        {route.source} → {route.destination}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">
                        Used {route.frequency} times
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-all duration-300 group-hover:translate-x-1" />
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