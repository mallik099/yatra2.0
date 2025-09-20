// TSRTC API Service for real data
export interface TSRTCBus {
  vehicleId: string;
  routeNumber: string;
  routeName: string;
  currentLat: number;
  currentLng: number;
  speed: number;
  direction: number;
  nextStopId: string;
  nextStopName: string;
  estimatedArrival: string;
  occupancyStatus: 'LOW' | 'MEDIUM' | 'HIGH' | 'FULL';
  vehicleType: 'ORDINARY' | 'EXPRESS' | 'DELUXE' | 'AC';
  fare: number;
  lastUpdated: string;
  status: 'ACTIVE' | 'BREAKDOWN' | 'DEPOT' | 'MAINTENANCE';
}

export interface TSRTCBusStop {
  stopId: string;
  stopName: string;
  latitude: number;
  longitude: number;
  routes: string[];
  facilities: string[];
  stopType: 'REGULAR' | 'MAJOR' | 'TERMINAL';
}

export class TSRTCApiService {
  private readonly API_BASE = 'https://api.tsrtc.gov.in/v1';
  private readonly API_KEY = process.env.REACT_APP_TSRTC_API_KEY || 'demo_key';

  // Fetch all active buses from TSRTC API
  async getAllBuses(): Promise<TSRTCBus[]> {
    try {
      console.log('🚌 Fetching all buses from TSRTC API...');
      
      const response = await fetch(`${this.API_BASE}/buses/live`, {
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`TSRTC API Error: ${response.status}`);
      }

      const data = await response.json();
      const buses = data.buses || data.data || [];
      
      console.log(`✅ Loaded ${buses.length} buses from TSRTC API`);
      return buses;
      
    } catch (error) {
      console.error('❌ TSRTC API Error, using fallback data:', error);
      return this.getFallbackBusData();
    }
  }

  // Fetch all bus stops from TSRTC API
  async getAllBusStops(): Promise<TSRTCBusStop[]> {
    try {
      console.log('🚏 Fetching all bus stops from TSRTC API...');
      
      const response = await fetch(`${this.API_BASE}/stops`, {
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`TSRTC Stops API Error: ${response.status}`);
      }

      const data = await response.json();
      const stops = data.stops || data.data || [];
      
      console.log(`✅ Loaded ${stops.length} bus stops from TSRTC API`);
      return stops;
      
    } catch (error) {
      console.error('❌ TSRTC Stops API Error, using fallback data:', error);
      return this.getFallbackStopsData();
    }
  }

  // Fetch buses for specific route
  async getBusesByRoute(routeNumber: string): Promise<TSRTCBus[]> {
    try {
      const response = await fetch(`${this.API_BASE}/routes/${routeNumber}/buses`, {
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Route API Error: ${response.status}`);
      }

      const data = await response.json();
      return data.buses || [];
      
    } catch (error) {
      console.error(`❌ Route ${routeNumber} API Error:`, error);
      return [];
    }
  }

  // Fallback bus data when API is unavailable
  private getFallbackBusData(): TSRTCBus[] {
    const routes = [
      '100K', '156', '290U', '218', '5K', '8A', '102', '107', '113', '116', 
      '125', '142', '147', '158', '171', '185', '201', '219', '230', '241'
    ];

    return routes.flatMap((route, routeIndex) => {
      const busCount = Math.floor(Math.random() * 8) + 3; // 3-10 buses per route
      
      return Array.from({ length: busCount }, (_, busIndex) => ({
        vehicleId: `TS07U${(routeIndex * 100) + busIndex + 1000}`,
        routeNumber: route,
        routeName: this.getRouteName(route),
        currentLat: 17.385 + (Math.random() - 0.5) * 0.2,
        currentLng: 78.486 + (Math.random() - 0.5) * 0.2,
        speed: Math.floor(Math.random() * 50) + 10,
        direction: Math.floor(Math.random() * 360),
        nextStopId: `STOP_${routeIndex}_${busIndex}`,
        nextStopName: this.getRandomStopName(),
        estimatedArrival: new Date(Date.now() + Math.random() * 1800000).toISOString(),
        occupancyStatus: ['LOW', 'MEDIUM', 'HIGH', 'FULL'][Math.floor(Math.random() * 4)] as any,
        vehicleType: Math.random() > 0.7 ? 'AC' : 'ORDINARY' as any,
        fare: Math.floor(Math.random() * 30) + 15,
        lastUpdated: new Date().toISOString(),
        status: Math.random() > 0.9 ? 'BREAKDOWN' : 'ACTIVE' as any
      }));
    });
  }

  // Fallback bus stops data
  private getFallbackStopsData(): TSRTCBusStop[] {
    const majorStops = [
      { name: 'Secunderabad Railway Station', lat: 17.4399, lng: 78.4983, type: 'TERMINAL' },
      { name: 'Ameerpet Metro Station', lat: 17.3850, lng: 78.4867, type: 'MAJOR' },
      { name: 'Gachibowli Bus Station', lat: 17.4399, lng: 78.3482, type: 'TERMINAL' },
      { name: 'Koti Bus Station', lat: 17.3616, lng: 78.4747, type: 'MAJOR' },
      { name: 'HITEC City', lat: 17.4435, lng: 78.3772, type: 'MAJOR' },
      { name: 'Mehdipatnam', lat: 17.3936, lng: 78.4206, type: 'MAJOR' },
      { name: 'Paradise Circle', lat: 17.4126, lng: 78.4747, type: 'MAJOR' },
      { name: 'Begumpet', lat: 17.4435, lng: 78.4645, type: 'REGULAR' },
      { name: 'KPHB Colony', lat: 17.4485, lng: 78.3908, type: 'REGULAR' },
      { name: 'LB Nagar', lat: 17.3421, lng: 78.5515, type: 'MAJOR' },
      { name: 'Uppal X Roads', lat: 17.4067, lng: 78.5540, type: 'REGULAR' },
      { name: 'Charminar', lat: 17.3616, lng: 78.4747, type: 'MAJOR' },
      { name: 'Abids', lat: 17.3753, lng: 78.4744, type: 'REGULAR' },
      { name: 'Punjagutta', lat: 17.4240, lng: 78.4480, type: 'REGULAR' },
      { name: 'Jubilee Hills', lat: 17.4239, lng: 78.4738, type: 'REGULAR' }
    ];

    // Generate more stops around the city
    const additionalStops = [];
    for (let i = 0; i < 50; i++) {
      additionalStops.push({
        name: `Bus Stop ${i + 1}`,
        lat: 17.385 + (Math.random() - 0.5) * 0.15,
        lng: 78.486 + (Math.random() - 0.5) * 0.15,
        type: 'REGULAR' as const
      });
    }

    return [...majorStops, ...additionalStops].map((stop, index) => ({
      stopId: `STOP_${index.toString().padStart(3, '0')}`,
      stopName: stop.name,
      latitude: stop.lat,
      longitude: stop.lng,
      routes: this.getRandomRoutes(),
      facilities: this.getRandomFacilities(),
      stopType: stop.type
    }));
  }

  private getRouteName(routeNumber: string): string {
    const routeNames: { [key: string]: string } = {
      '100K': 'Secunderabad - Koti',
      '156': 'Mehdipatnam - KPHB',
      '290U': 'LB Nagar - Gachibowli',
      '218': 'Ameerpet - Uppal',
      '5K': 'Secunderabad - Afzalgunj',
      '8A': 'Secunderabad - Charminar'
    };
    return routeNames[routeNumber] || `Route ${routeNumber}`;
  }

  private getRandomStopName(): string {
    const stops = [
      'Secunderabad', 'Ameerpet', 'Begumpet', 'Paradise', 'Koti', 'Abids',
      'Gachibowli', 'HITEC City', 'Mehdipatnam', 'KPHB', 'LB Nagar', 'Uppal'
    ];
    return stops[Math.floor(Math.random() * stops.length)];
  }

  private getRandomRoutes(): string[] {
    const allRoutes = ['100K', '156', '290U', '218', '5K', '8A'];
    const count = Math.floor(Math.random() * 3) + 1;
    return allRoutes.slice(0, count);
  }

  private getRandomFacilities(): string[] {
    const facilities = ['Shelter', 'Seating', 'Digital Display', 'CCTV', 'Lighting'];
    return facilities.filter(() => Math.random() > 0.5);
  }
}

export const tsrtcApi = new TSRTCApiService();