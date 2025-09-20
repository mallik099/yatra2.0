import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Clock, Navigation, Star, History } from 'lucide-react';
import { smartSearchService, LocationSuggestion } from '../services/smartSearchService';

interface SmartSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type: 'source' | 'destination';
  allStops: string[];
  onLocationDetected?: (location: string) => void;
  contextualSuggestions?: string[];
}

const SmartSearchInput: React.FC<SmartSearchInputProps> = ({
  value,
  onChange,
  placeholder,
  type,
  allStops,
  onLocationDetected,
  contextualSuggestions = []
}) => {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadSuggestions = async () => {
      if (value.length > 0) {
        const smartSuggestions = await smartSearchService.getSmartSuggestions(
          value, 
          type, 
          allStops
        );
        setSuggestions(smartSuggestions);
      } else {
        // Show recent/frequent searches when empty
        const recentSearches = smartSearchService.getRecentSearches(3);
        const field = type === 'source' ? 'source' : 'destination';
        const historySuggestions = recentSearches.map(h => ({
          name: h[field],
          type: 'history' as const,
          confidence: 0.8
        }));
        setSuggestions(historySuggestions);
      }
    };

    loadSuggestions();
  }, [value, type, allStops]);

  const handleLocationDetect = async () => {
    if (type !== 'source') return;
    
    setIsDetectingLocation(true);
    try {
      const location = await smartSearchService.getCurrentLocation();
      if (location && onLocationDetected) {
        // In real app, reverse geocode to get stop name
        onLocationDetected('Current Location');
        onChange('Current Location');
      }
    } catch (error) {
      console.error('Location detection failed:', error);
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    onChange(suggestion.name);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const getSuggestionIcon = (type: LocationSuggestion['type']) => {
    switch (type) {
      case 'current': return <Navigation className="w-4 h-4 text-blue-500" />;
      case 'history': return <History className="w-4 h-4 text-gray-500" />;
      case 'popular': return <Star className="w-4 h-4 text-yellow-500" />;
      default: return <MapPin className="w-4 h-4 text-gray-400" />;
    }
  };

  const getSuggestionLabel = (type: LocationSuggestion['type']) => {
    switch (type) {
      case 'current': return 'Near you';
      case 'history': return 'Recent';
      case 'popular': return 'Popular';
      default: return '';
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={placeholder}
          className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        {type === 'source' && (
          <button
            type="button"
            onClick={handleLocationDetect}
            disabled={isDetectingLocation}
            className="absolute right-2 top-2 p-1 text-blue-600 hover:bg-blue-50 rounded-md disabled:opacity-50"
            title="Use current location"
          >
            <Navigation className={`w-4 h-4 ${isDetectingLocation ? 'animate-pulse' : ''}`} />
          </button>
        )}
      </div>

      {showSuggestions && (suggestions.length > 0 || contextualSuggestions.length > 0) && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-20 mt-1 max-h-64 overflow-y-auto">
          {/* Smart suggestions */}
          {suggestions.map((suggestion, index) => (
            <button
              key={`smart-${index}`}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                {getSuggestionIcon(suggestion.type)}
                <div>
                  <div className="text-gray-800">{suggestion.name}</div>
                  {suggestion.type !== 'popular' && (
                    <div className="text-xs text-gray-500">
                      {getSuggestionLabel(suggestion.type)}
                    </div>
                  )}
                </div>
              </div>
              {suggestion.distance && (
                <span className="text-xs text-gray-400">
                  {suggestion.distance.toFixed(1)}km
                </span>
              )}
            </button>
          ))}

          {/* Contextual suggestions */}
          {contextualSuggestions.length > 0 && suggestions.length > 0 && (
            <div className="border-t border-gray-100 px-3 py-1">
              <div className="text-xs text-gray-500 font-medium">Frequent destinations</div>
            </div>
          )}
          
          {contextualSuggestions.map((suggestion, index) => (
            <button
              key={`contextual-${index}`}
              onClick={() => handleSuggestionClick({ name: suggestion, type: 'history', confidence: 0.8 })}
              className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center space-x-3"
            >
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">{suggestion}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SmartSearchInput;