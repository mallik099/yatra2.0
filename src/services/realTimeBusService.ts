export interface RealTimeBus {
  id: string;
  number: string;
  route: string;
  lat: number;
  lng: number;
  speed: number;
  direction: number;
  occupancy: number;
  capacity: number;
  nextStop: string;
  eta: number;
  crowdLevel: 'Low' | 'Medium' | 'High';
  lastUpdated: Date;
}

export interface BusStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  routes: string[];
}

class RealTimeBusService {
  private buses: RealTimeBus[] = [];
  private busStops: BusStop[] = [];
  private updateInterval: NodeJS.Timeout | null = null;
  private subscribers: ((buses: RealTimeBus[]) => void)[] = [];

  constructor() {
    this.initializeData();
    this.startRealTimeUpdates();
  }

  private initializeData() {
    this.busStops = [
      { id: '1', name: 'Secunderabad Railway Station', lat: 17.4399, lng: 78.5017, routes: ['100K', '5K', '49M'] },
      { id: '2', name: 'Ameerpet Metro', lat: 17.4374, lng: 78.4482, routes: ['156', '218', '10H'] },
      { id: '3', name: 'Gachibowli DLF', lat: 17.4239, lng: 78.3428, routes: ['290U', '72'] },
      { id: '4', name: 'Mehdipatnam', lat: 17.3953, lng: 78.4378, routes: ['156', '49M'] },
      { id: '5', name: 'Paradise Circle', lat: 17.4416, lng: 78.4983, routes: ['100K'] },
      { id: '6', name: 'Hi-Tech City', lat: 17.4435, lng: 78.3772, routes: ['72', '290U'] },
      { id: '7', name: 'Uppal', lat: 17.4065, lng: 78.5691, routes: ['218'] },
      { id: '8', name: 'LB Nagar', lat: 17.3496, lng: 78.5522, routes: ['290U'] },
      { id: '9', name: 'Charminar', lat: 17.3616, lng: 78.4747, routes: ['72', '5K'] },
      { id: '10', name: 'KPHB Colony', lat: 17.4851, lng: 78.3912, routes: ['156'] }
    ];

    this.buses = [
      {
        id: '1', number: '100K', route: 'Secunderabad ↔ Koti',
        lat: 17.4350, lng: 78.4950, speed: 25, direction: 180,
        occupancy: 32, capacity: 50, nextStop: 'Paradise Circle',
        eta: 3, crowdLevel: 'Medium', lastUpdated: new Date()
      },
      {
        id: '2', number: '156', route: 'Mehdipatnam ↔ KPHB',
        lat: 17.4200, lng: 78.4400, speed: 15, direction: 90,
        occupancy: 42, capacity: 45, nextStop: 'Ameerpet Metro',
        eta: 7, crowdLevel: 'High', lastUpdated: new Date()
      },
      {
        id: '3', number: '290U', route: 'LB Nagar ↔ Gachibowli',
        lat: 17.3800, lng: 78.5200, speed: 30, direction: 270,
        occupancy: 18, capacity: 55, nextStop: 'Dilsukhnagar',
        eta: 5, crowdLevel: 'Low', lastUpdated: new Date()
      },
      {
        id: '4', number: '218', route: 'Ameerpet ↔ Uppal',
        lat: 17.4100, lng: 78.5000, speed: 20, direction: 45,
        occupancy: 28, capacity: 50, nextStop: 'Tarnaka',
        eta: 12, crowdLevel: 'Medium', lastUpdated: new Date()
      },
      {
        id: '5', number: '5K', route: 'Secunderabad ↔ Afzalgunj',
        lat: 17.4380, lng: 78.4900, speed: 10, direction: 225,
        occupancy: 38, capacity: 40, nextStop: 'Clock Tower',
        eta: 2, crowdLevel: 'High', lastUpdated: new Date()
      },
      {
        id: '6', number: '49M', route: 'Mehdipatnam ↔ Secunderabad',
        lat: 17.4000, lng: 78.4600, speed: 35, direction: 0,
        occupancy: 15, capacity: 48, nextStop: 'Lakdi Ka Pul',
        eta: 15, crowdLevel: 'Low', lastUpdated: new Date()
      },
      {
        id: '7', number: '72', route: 'Charminar ↔ Kondapur',
        lat: 17.3700, lng: 78.4500, speed: 22, direction: 315,
        occupancy: 35, capacity: 52, nextStop: 'Hi-Tech City',
        eta: 8, crowdLevel: 'Medium', lastUpdated: new Date()
      },
      {
        id: '8', number: '10H', route: 'Imlibun ↔ Jubilee Hills',
        lat: 17.4250, lng: 78.4300, speed: 18, direction: 135,
        occupancy: 25, capacity: 45, nextStop: 'Panjagutta',
        eta: 6, crowdLevel: 'Low', lastUpdated: new Date()
      }
    ];
  }

  private startRealTimeUpdates() {
    this.updateInterval = setInterval(() => {
      this.updateBusPositions();
      this.notifySubscribers();
    }, 2000); // Update every 2 seconds
  }

  private updateBusPositions() {
    this.buses = this.buses.map(bus => {
      // Simulate realistic movement
      const speedKmh = bus.speed;
      const speedMs = speedKmh / 3.6; // Convert to m/s
      const timeStep = 2; // 2 seconds
      const distanceM = speedMs * timeStep;
      
      // Convert distance to lat/lng (rough approximation)
      const latOffset = (distanceM / 111000) * Math.cos(bus.direction * Math.PI / 180);
      const lngOffset = (distanceM / 111000) * Math.sin(bus.direction * Math.PI / 180);
      
      let newLat = bus.lat + latOffset;
      let newLng = bus.lng + lngOffset;
      
      // Keep buses within Hyderabad bounds
      newLat = Math.max(17.2, Math.min(17.6, newLat));
      newLng = Math.max(78.2, Math.min(78.7, newLng));
      
      // Simulate speed variations (traffic, stops, etc.)
      const speedVariation = (Math.random() - 0.5) * 10;
      const newSpeed = Math.max(0, Math.min(60, bus.speed + speedVariation));
      
      // Simulate occupancy changes
      const occupancyChange = Math.floor((Math.random() - 0.5) * 4);
      const newOccupancy = Math.max(0, Math.min(bus.capacity, bus.occupancy + occupancyChange));
      
      // Update crowd level based on occupancy
      const occupancyRatio = newOccupancy / bus.capacity;
      let newCrowdLevel: 'Low' | 'Medium' | 'High';
      if (occupancyRatio < 0.4) newCrowdLevel = 'Low';
      else if (occupancyRatio < 0.8) newCrowdLevel = 'Medium';
      else newCrowdLevel = 'High';
      
      // Update ETA (simulate getting closer to stops)
      const newEta = Math.max(1, bus.eta - (Math.random() > 0.7 ? 1 : 0));
      
      // Occasionally change direction (turns, route changes)
      const newDirection = Math.random() > 0.95 ? 
        (bus.direction + (Math.random() - 0.5) * 90) % 360 : 
        bus.direction;
      
      return {
        ...bus,
        lat: newLat,
        lng: newLng,
        speed: Math.round(newSpeed),
        direction: newDirection,
        occupancy: newOccupancy,
        crowdLevel: newCrowdLevel,
        eta: newEta,
        lastUpdated: new Date()
      };
    });
  }

  private notifySubscribers() {
    this.subscribers.forEach(callback => callback([...this.buses]));
  }

  public subscribe(callback: (buses: RealTimeBus[]) => void): () => void {
    this.subscribers.push(callback);
    
    // Immediately send current data
    callback([...this.buses]);
    
    // Return unsubscribe function
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  public getBuses(): RealTimeBus[] {
    return [...this.buses];
  }

  public getBusStops(): BusStop[] {
    return [...this.busStops];
  }

  public getBusById(id: string): RealTimeBus | undefined {
    return this.buses.find(bus => bus.id === id);
  }

  public getBusesByRoute(routeNumber: string): RealTimeBus[] {
    return this.buses.filter(bus => bus.number === routeNumber);
  }

  public getNearbyBuses(lat: number, lng: number, radiusKm: number = 5): RealTimeBus[] {
    return this.buses.filter(bus => {
      const distance = this.calculateDistance(lat, lng, bus.lat, bus.lng);
      return distance <= radiusKm;
    });
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  public destroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    this.subscribers = [];
  }
}

// Singleton instance
export const realTimeBusService = new RealTimeBusService();