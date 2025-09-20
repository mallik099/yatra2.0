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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center">
      <div className="bg-white rounded-t-2xl md:rounded-2xl w-full md:max-w-md md:mx-4 max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Search Preferences</span>
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* Location Services */}
            <div>
              <h3 className="font-medium text-gray-800 mb-3 flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Location Services</span>
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Use Current Location
                    </p>
                    <p className="text-xs text-gray-500">
                      Auto-detect nearby bus stops
                    </p>
                  </div>
                  <button
                    onClick={handleLocationToggle}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isLocationEnabled ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isLocationEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Search History */}
            <div>
              <h3 className="font-medium text-gray-800 mb-3 flex items-center space-x-2">
                <History className="w-4 h-4" />
                <span>Search History</span>
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Recent Searches: {recentSearches.length}
                    </p>
                    <p className="text-sm font-medium text-gray-700">
                      Frequent Routes: {frequentRoutes.length}
                    </p>
                  </div>
                  <button
                    onClick={clearHistory}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm"
                    disabled={recentSearches.length === 0}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Clear</span>
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Search history helps provide better suggestions and quick access to your frequent routes.
                </p>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">
                Privacy & Data
              </h4>
              <p className="text-xs text-blue-700">
                Your search history and location data are stored locally on your device. 
                We don't share this information with third parties.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPreferences;