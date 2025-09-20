// Mock API service for development and demo
import { sampleBuses } from '../data/sampleData';
import { BusLocation } from './busApi';

class MockApiService {
  private buses: BusLocation[] = [];
  private updateInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeBuses();
    this.startLocationUpdates();
  }

  private initializeBuses() {
    this.buses = sampleBuses.map((bus, index) => ({
      _id: `mock_${bus.busNumber}`,
      busNumber: bus.busNumber,
      route: {
        source: bus.route.source,
        destination: bus.route.destination,
        nextStop: bus.route.nextStop
      },
      currentLocation: {
        lat: bus.currentLocation.lat,
        lng: bus.currentLocation.lng
      },
      status: 'ON_ROUTE',
      fare: {
        regular: bus.fare,
        ac: bus.fare + 15
      },
      capacity: {
        total: 45,
        available: Math.floor(Math.random() * 25) + 10
      },
      vehicleType: index % 2 === 0 ? 'AC' : 'Non-AC',
      lastUpdated: new Date().toISOString()
    }));
  }

  private startLocationUpdates() {
    // Update bus locations every 10 seconds for realistic simulation
    this.updateInterval = setInterval(() => {
      this.buses.forEach(bus => {
        // Simulate movement (small random changes)
        bus.currentLocation.lat += (Math.random() - 0.5) * 0.001;
        bus.currentLocation.lng += (Math.random() - 0.5) * 0.001;
        bus.capacity.available = Math.max(0, Math.min(bus.capacity.total, 
          bus.capacity.available + Math.floor((Math.random() - 0.5) * 4)));
        bus.lastUpdated = new Date().toISOString();
      });
    }, 10000);
  }

  async getBuses(): Promise<BusLocation[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...this.buses];
  }

  async getBusById(busNumber: string): Promise<BusLocation | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.buses.find(bus => bus.busNumber === busNumber) || null;
  }

  async getNearbyBuses(lat: number, lng: number, distance: number = 5000): Promise<BusLocation[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    // Simple distance calculation (not accurate but good for demo)
    return this.buses.filter(bus => {
      const latDiff = Math.abs(bus.currentLocation.lat - lat);
      const lngDiff = Math.abs(bus.currentLocation.lng - lng);
      return (latDiff + lngDiff) < 0.05; // Rough proximity check
    });
  }

  async searchBuses(source: string, destination: string): Promise<BusLocation[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.buses.filter(bus => 
      bus.route.source.toLowerCase().includes(source.toLowerCase()) ||
      bus.route.destination.toLowerCase().includes(destination.toLowerCase())
    );
  }

  destroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }
}

export const mockApiService = new MockApiService();