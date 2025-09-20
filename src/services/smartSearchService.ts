interface SearchHistory {
  source: string;
  destination: string;
  timestamp: number;
  frequency: number;
}

interface LocationSuggestion {
  name: string;
  distance?: number;
  type: 'current' | 'history' | 'popular' | 'nearby';
  confidence: number;
}

interface UserLocation {
  lat: number;
  lng: number;
  accuracy: number;
}

class SmartSearchService {
  private searchHistory: SearchHistory[] = [];
  private currentLocation: UserLocation | null = null;
  private readonly STORAGE_KEY = 'yatra_search_history';
  private readonly MAX_HISTORY = 50;

  constructor() {
    this.loadSearchHistory();
  }

  // Location Services
  async getCurrentLocation(): Promise<UserLocation | null> {
    if (!navigator.geolocation) return null;

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          resolve(this.currentLocation);
        },
        () => resolve(null),
        { timeout: 5000, enableHighAccuracy: true }
      );
    });
  }

  // Search History Management
  addToHistory(source: string, destination: string): void {
    const existing = this.searchHistory.find(
      h => h.source === source && h.destination === destination
    );

    if (existing) {
      existing.frequency++;
      existing.timestamp = Date.now();
    } else {
      this.searchHistory.unshift({
        source,
        destination,
        timestamp: Date.now(),
        frequency: 1
      });
    }

    this.searchHistory = this.searchHistory
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, this.MAX_HISTORY);

    this.saveSearchHistory();
  }

  getRecentSearches(limit = 5): SearchHistory[] {
    return this.searchHistory
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  getFrequentSearches(limit = 5): SearchHistory[] {
    return this.searchHistory
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, limit);
  }

  // Smart Suggestions
  async getSmartSuggestions(
    query: string, 
    type: 'source' | 'destination',
    allStops: string[]
  ): Promise<LocationSuggestion[]> {
    const suggestions: LocationSuggestion[] = [];

    // Current location suggestion
    if (type === 'source' && this.currentLocation) {
      const nearbyStop = await this.findNearestStop(this.currentLocation);
      if (nearbyStop && nearbyStop.toLowerCase().includes(query.toLowerCase())) {
        suggestions.push({
          name: nearbyStop,
          type: 'current',
          confidence: 0.9
        });
      }
    }

    // History-based suggestions
    const historySuggestions = this.getHistoryBasedSuggestions(query, type);
    suggestions.push(...historySuggestions);

    // Popular stops matching query
    const popularSuggestions = allStops
      .filter(stop => stop.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 3)
      .map(stop => ({
        name: stop,
        type: 'popular' as const,
        confidence: 0.7
      }));
    suggestions.push(...popularSuggestions);

    // Remove duplicates and sort by confidence
    const uniqueSuggestions = suggestions.filter((suggestion, index, self) =>
      index === self.findIndex(s => s.name === suggestion.name)
    );

    return uniqueSuggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5);
  }

  private getHistoryBasedSuggestions(query: string, type: 'source' | 'destination'): LocationSuggestion[] {
    const field = type === 'source' ? 'source' : 'destination';
    
    return this.searchHistory
      .filter(h => h[field].toLowerCase().includes(query.toLowerCase()))
      .slice(0, 3)
      .map(h => ({
        name: h[field],
        type: 'history' as const,
        confidence: Math.min(0.8, 0.5 + (h.frequency * 0.1))
      }));
  }

  // Auto-complete based on context
  getContextualSuggestions(sourceValue: string): string[] {
    if (!sourceValue) return [];

    // Find common destinations for this source
    const commonDestinations = this.searchHistory
      .filter(h => h.source.toLowerCase().includes(sourceValue.toLowerCase()))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 3)
      .map(h => h.destination);

    return [...new Set(commonDestinations)];
  }

  // Nearby stops detection
  private async findNearestStop(location: UserLocation): Promise<string | null> {
    // Mock implementation - in real app, use geospatial API
    const hyderabadStops = [
      { name: "Ameerpet Metro Station", lat: 17.4065, lng: 78.4482 },
      { name: "Hitech City", lat: 17.4483, lng: 78.3915 },
      { name: "Gachibowli", lat: 17.4399, lng: 78.3489 },
      { name: "Secunderabad Railway Station", lat: 17.4416, lng: 78.5009 }
    ];

    let nearest = null;
    let minDistance = Infinity;

    for (const stop of hyderabadStops) {
      const distance = this.calculateDistance(location, stop);
      if (distance < minDistance && distance < 2) { // Within 2km
        minDistance = distance;
        nearest = stop.name;
      }
    }

    return nearest;
  }

  private calculateDistance(pos1: {lat: number, lng: number}, pos2: {lat: number, lng: number}): number {
    const R = 6371; // Earth's radius in km
    const dLat = (pos2.lat - pos1.lat) * Math.PI / 180;
    const dLng = (pos2.lng - pos1.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(pos1.lat * Math.PI / 180) * Math.cos(pos2.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }

  // Storage
  private loadSearchHistory(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.searchHistory = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load search history:', error);
    }
  }

  private saveSearchHistory(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.searchHistory));
    } catch (error) {
      console.error('Failed to save search history:', error);
    }
  }

  clearHistory(): void {
    this.searchHistory = [];
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

export const smartSearchService = new SmartSearchService();
export type { SearchHistory, LocationSuggestion, UserLocation };