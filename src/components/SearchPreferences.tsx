import React from 'react';
import { Settings, MapPin, History, Trash2 } from 'lucide-react';
import { useSmartSearch } from '../hooks/useSmartSearch';

interface SearchPreferencesProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchPreferences: React.FC<SearchPreferencesProps> = ({ isOpen, onClose }) => {
  const { 
    isLocationEnabled, 
    recentSearches, 
    frequentRoutes, 
    clearHistory, 
    requestLocation 
  } = useSmartSearch();

  if (!isOpen) return null;

  const handleLocationToggle = async () => {
    if (!isLocationEnabled) {
      await requestLocation();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center">
      <div className="glass-card w-full md:max-w-lg md:mx-4 max-h-[85vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <span className="gradient-text">Search Preferences</span>
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-all duration-300 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-8">
            {/* Location Services */}
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <span>Location Services</span>
              </h3>
              <div className="glass-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800 mb-1">
                      Use Current Location
                    </p>
                    <p className="text-sm text-gray-600">
                      Auto-detect nearby bus stops for faster search
                    </p>
                  </div>
                  <button
                    onClick={handleLocationToggle}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 ${
                      isLocationEnabled ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-lg ${
                        isLocationEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Search History */}
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center space-x-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <History className="w-5 h-5 text-green-600" />
                </div>
                <span>Search History</span>
              </h3>
              <div className="glass-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <p className="font-semibold text-gray-800">
                        Recent Searches: {recentSearches.length}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <p className="font-semibold text-gray-800">
                        Frequent Routes: {frequentRoutes.length}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={clearHistory}
                    className="flex items-center space-x-2 bg-red-50 text-red-600 hover:text-red-700 hover:bg-red-100 px-4 py-2 rounded-xl transition-all duration-300 font-medium"
                    disabled={recentSearches.length === 0}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Clear All</span>
                  </button>
                </div>
                <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                  💡 Search history helps provide better suggestions and quick access to your frequent routes.
                </p>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="glass-card bg-gradient-to-r from-blue-50 to-purple-50 p-6">
              <h4 className="font-bold text-lg text-gray-800 mb-3 flex items-center space-x-2">
                <span>🔒</span>
                <span>Privacy & Data</span>
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                Your search history and location data are stored locally on your device. 
                We don't share this information with third parties. Your privacy is our priority.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/20">
            <button
              onClick={onClose}
              className="btn-primary w-full py-4 text-lg font-semibold"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPreferences;