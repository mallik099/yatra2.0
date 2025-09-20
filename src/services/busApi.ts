import { sampleBuses } from '../data/sampleData';

export interface BusLocation {
  _id: string;
  busNumber: string;
  route: {
    source: string;
    destination: string;
    nextStop: string;
  };
  currentLocation: {
    lat: number;
    lng: number;
  };
  status: string;
  fare: {
    regular: number;
    ac: number;
  };
  capacity: {
    total: number;
    available: number;
  };
  vehicleType: string;
  lastUpdated: string;
}

let busPositions: { [key: string]: { lat: number; lng: number; direction: number } } = {};
let cachedBusData: BusLocation[] | null = null;
let lastCacheTime = 0;
const CACHE_DURATION = 5000; // 5 seconds cache

const initializeBusPositions = () => {
  sampleBuses.forEach((bus, index) => {
    const busId = `bus_${index + 1}`;
    if (!busPositions[busId]) {
      busPositions[busId] = {
        lat: bus.currentLocation.lat,
        lng: bus.currentLocation.lng,
        direction: Math.random() * 360
      };
    }
  });
};

const simulateBusMovement = (busId: string): { lat: number; lng: number } => {
  if (!busPositions[busId]) return { lat: 17.3850, lng: 78.4867 };
  
  const position = busPositions[busId];
  const speed = 0.0001;
  const directionChange = (Math.random() - 0.5) * 30;
  
  position.direction += directionChange;
  const radians = (position.direction * Math.PI) / 180;
  position.lat += Math.cos(radians) * speed;
  position.lng += Math.sin(radians) * speed;
  
  position.lat = Math.max(17.2, Math.min(17.6, position.lat));
  position.lng = Math.max(78.2, Math.min(78.8, position.lng));
  
  return { lat: position.lat, lng: position.lng };
};

const AC_FARE_INCREMENT = 10;

const convertSampleData = (): BusLocation[] => {
  const now = Date.now();
  
  // Return cached data if still valid
  if (cachedBusData && (now - lastCacheTime) < CACHE_DURATION) {
    return cachedBusData;
  }
  
  initializeBusPositions();
  
  const newData = sampleBuses.map((bus, index) => {
    const busId = `bus_${index + 1}`;
    const currentPos = simulateBusMovement(busId);
    
    const statuses = ['ON_ROUTE', 'ON_ROUTE', 'ON_ROUTE', 'DELAYED', 'STOPPED'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      _id: busId,
      busNumber: bus.busNumber,
      route: {
        source: bus.route.source,
        destination: bus.route.destination,
        nextStop: bus.route.nextStop
      },
      currentLocation: currentPos,
      status: randomStatus,
      fare: {
        regular: bus.fare,
        ac: bus.fare + AC_FARE_INCREMENT
      },
      capacity: {
        total: 40,
        available: Math.floor(Math.random() * 35) + 5
      },
      vehicleType: Math.random() > 0.7 ? 'AC' : 'Standard',
      lastUpdated: new Date().toISOString()
    };
  });
  
  // Cache the new data
  cachedBusData = newData;
  lastCacheTime = now;
  
  return newData;
};

export const busApi = {
  async getBuses(): Promise<BusLocation[]> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Always return mock data for now (can be extended to real API later)
      return convertSampleData();
    } catch (error) {
      console.error('Error fetching buses:', error);
      throw new Error('Failed to fetch bus data');
    }
  },

  async getBusById(busNumber: string): Promise<BusLocation | null> {
    await new Promise(resolve => setTimeout(resolve, 150));
    const buses = convertSampleData();
    return buses.find(bus => bus.busNumber === busNumber) || null;
  },

  async getNearbyBuses(lat: number, lng: number, distance: number = 5000): Promise<BusLocation[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const buses = convertSampleData();
    
    return buses.filter(bus => {
      const busLat = bus.currentLocation.lat;
      const busLng = bus.currentLocation.lng;
      const distanceKm = this.calculateHaversineDistance(lat, lng, busLat, busLng);
      return distanceKm <= distance / 1000;
    });
  },

  calculateHaversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },

  async searchBuses(source: string, destination: string): Promise<BusLocation[]> {
    await new Promise(resolve => setTimeout(resolve, 250));
    const buses = convertSampleData();
    return buses.filter(bus => 
      bus.route.source.toLowerCase().includes(source.toLowerCase()) ||
      bus.route.destination.toLowerCase().includes(destination.toLowerCase())
    );
  }
};