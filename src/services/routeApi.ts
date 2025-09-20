import { sampleBuses } from '../data/sampleData';
import { API_CONFIG, getApiUrl } from '../config/api';

export interface RouteResult {
  id: string;
  busNumber: string;
  source: string;
  destination: string;
  duration: string;
  fare: number;
  nextBus: string;
  frequency: string;
  stops?: string[];
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const routeApi = {
  async searchRoutes(source: string, destination: string): Promise<RouteResult[]> {
    const apiUrl = getApiUrl();
    
    if (!apiUrl || API_CONFIG.USE_MOCK_API) {
      return this.searchRoutesMock(source, destination);
    }

    try {
      const response = await fetch(`${apiUrl}/routes/search?from=${encodeURIComponent(source)}&to=${encodeURIComponent(destination)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch routes');
      }

      const routes = await response.json();
      
      return routes.flatMap((route: any) => 
        route.buses.map((bus: any) => ({
          id: `${route.routeId}_${bus.busNumber}`,
          busNumber: bus.busNumber,
          source: this.getStopName(route.stops, source),
          destination: this.getStopName(route.stops, destination),
          duration: this.formatDuration(route.estimatedDuration),
          fare: bus.fare,
          nextBus: bus.eta,
          frequency: this.getFrequency(bus.busNumber),
          stops: route.stops.map((stop: any) => stop.name)
        }))
      );
    } catch (error) {
      console.error('API error, falling back to mock data:', error);
      return this.searchRoutesMock(source, destination);
    }
  },

  async searchRoutesMock(source: string, destination: string): Promise<RouteResult[]> {
    await delay(800);
    
    const matchingBuses = sampleBuses.filter(bus => {
      const sourceMatch = bus.route.source.toLowerCase().includes(source.toLowerCase()) ||
                         source.toLowerCase().includes(bus.route.source.toLowerCase());
      const destMatch = bus.route.destination.toLowerCase().includes(destination.toLowerCase()) ||
                       destination.toLowerCase().includes(bus.route.destination.toLowerCase());
      
      return sourceMatch || destMatch;
    });

    const results = matchingBuses.length > 0 ? matchingBuses : sampleBuses;

    return results.map((bus, index) => ({
      id: `route_${index + 1}`,
      busNumber: bus.busNumber,
      source: bus.route.source,
      destination: bus.route.destination,
      duration: this.calculateDuration(bus.busNumber),
      fare: bus.fare,
      nextBus: bus.eta,
      frequency: this.getFrequency(bus.busNumber)
    }));
  },

  getStopName(stops: Array<{name: string}>, searchTerm: string): string {
    const match = stops.find(stop => 
      stop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      searchTerm.toLowerCase().includes(stop.name.toLowerCase())
    );
    return match?.name || searchTerm;
  },

  formatDuration(minutes: number): string {
    if (minutes < 60) return `${minutes} mins`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours} hr ${mins} mins` : `${hours} hr`;
  },

  calculateDuration(busNumber: string): string {
    const durations: Record<string, string> = {
      '100K': '45 mins',
      '156': '1 hr 15 mins',
      '290U': '1 hr 30 mins',
      '218': '55 mins'
    };
    return durations[busNumber] || '1 hr';
  },

  getFrequency(busNumber: string): string {
    const frequencies: Record<string, string> = {
      '100K': 'Every 10 mins',
      '156': 'Every 15 mins',
      '290U': 'Every 20 mins',
      '218': 'Every 12 mins'
    };
    return frequencies[busNumber] || 'Every 15 mins';
  },

  async getPopularRoutes(): Promise<string[]> {
    return [
      'Secunderabad Railway Station - Hitech City',
      'Mehdipatnam - KPHB Colony',
      'LB Nagar - Gachibowli',
      'Ameerpet Metro Station - Uppal',
      'Dilsukhnagar - Jubilee Hills',
      'Kukatpally - Charminar',
      'Banjara Hills - Uppal',
      'Jubilee Hills - LB Nagar'
    ];
  }
};