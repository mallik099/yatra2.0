export interface MobileBus {
  id: string;
  number: string;
  lat: number;
  lng: number;
  passengers: number;
  speed: number;
  route: string;
  nextStop: string;
  eta: number;
  direction: number;
  status: 'active' | 'delayed' | 'stopped';
}

class MobileBusService {
  private buses: MobileBus[] = [];
  private isSimulating = false;

  // Hyderabad bus routes with real coordinates
  private routes = {
    '218': {
      name: 'Secunderabad - Gachibowli',
      stops: ['Secunderabad', 'Paradise', 'Begumpet', 'Ameerpet', 'Panjagutta', 'Jubilee Hills', 'HITEC City', 'Gachibowli'],
      coords: [
        [17.4399, 78.5014], [17.4350, 78.4900], [17.4320, 78.4750], [17.4374, 78.4482],
        [17.4400, 78.4200], [17.4450, 78.3900], [17.4485, 78.3684], [17.4399, 78.3648]
      ]
    },
    '290U': {
      name: 'JBS - Gachibowli Express',
      stops: ['JBS', 'Lakdi Ka Pul', 'Ameerpet', 'HITEC City', 'Gachibowli'],
      coords: [
        [17.3850, 78.4867], [17.4200, 78.4600], [17.4374, 78.4482], [17.4485, 78.3684], [17.4399, 78.3648]
      ]
    },
    '219': {
      name: 'JBS - Gachibowli',
      stops: ['JBS', 'Nampally', 'Lakdi Ka Pul', 'Ameerpet', 'Panjagutta', 'Jubilee Hills', 'HITEC City', 'Gachibowli'],
      coords: [
        [17.3850, 78.4867], [17.4100, 78.4700], [17.4200, 78.4600], [17.4374, 78.4482],
        [17.4400, 78.4200], [17.4450, 78.3900], [17.4485, 78.3684], [17.4399, 78.3648]
      ]
    },
    '251': {
      name: 'Secunderabad - Ibrahimpatnam',
      stops: ['Secunderabad', 'Kacheguda', 'JBS', 'Dilsukhnagar', 'LB Nagar', 'Ibrahimpatnam'],
      coords: [
        [17.4399, 78.5014], [17.4200, 78.4900], [17.3850, 78.4867], [17.3687, 78.5242], [17.3420, 78.5510], [17.1232, 78.7278]
      ]
    },
    '10': {
      name: 'Secunderabad - Kukatpally',
      stops: ['Secunderabad', 'Paradise', 'Begumpet', 'Ameerpet', 'SR Nagar', 'Erragadda', 'Kukatpally'],
      coords: [
        [17.4399, 78.5014], [17.4350, 78.4900], [17.4320, 78.4750], [17.4374, 78.4482], [17.4600, 78.4300], [17.4750, 78.4150], [17.4851, 78.4089]
      ]
    }
  };

  async getAllBuses(): Promise<MobileBus[]> {
    if (this.buses.length === 0) {
      this.initializeBuses();
    }
    return this.buses;
  }

  private initializeBuses() {
    const busNumbers = Object.keys(this.routes);
    
    busNumbers.forEach((number, index) => {
      const route = this.routes[number as keyof typeof this.routes];
      const randomCoordIndex = Math.floor(Math.random() * route.coords.length);
      const [lat, lng] = route.coords[randomCoordIndex];
      
      this.buses.push({
        id: `bus_${index + 1}`,
        number,
        lat: lat + (Math.random() - 0.5) * 0.005, // Small random offset
        lng: lng + (Math.random() - 0.5) * 0.005,
        passengers: Math.floor(Math.random() * 40) + 10,
        speed: Math.floor(Math.random() * 30) + 20,
        route: route.name,
        nextStop: route.stops[Math.floor(Math.random() * route.stops.length)],
        eta: Math.floor(Math.random() * 15) + 3,
        direction: Math.random() * 360,
        status: Math.random() > 0.1 ? 'active' : (Math.random() > 0.5 ? 'delayed' : 'stopped')
      });
    });

    // Add more buses for realistic density
    for (let i = 0; i < 10; i++) {
      const routeKeys = Object.keys(this.routes);
      const randomRoute = routeKeys[Math.floor(Math.random() * routeKeys.length)];
      const route = this.routes[randomRoute as keyof typeof this.routes];
      const randomCoordIndex = Math.floor(Math.random() * route.coords.length);
      const [lat, lng] = route.coords[randomCoordIndex];
      
      this.buses.push({
        id: `bus_extra_${i}`,
        number: randomRoute,
        lat: lat + (Math.random() - 0.5) * 0.01,
        lng: lng + (Math.random() - 0.5) * 0.01,
        passengers: Math.floor(Math.random() * 45) + 5,
        speed: Math.floor(Math.random() * 35) + 15,
        route: route.name,
        nextStop: route.stops[Math.floor(Math.random() * route.stops.length)],
        eta: Math.floor(Math.random() * 20) + 2,
        direction: Math.random() * 360,
        status: Math.random() > 0.15 ? 'active' : 'delayed'
      });
    }

    this.startSimulation();
  }

  private startSimulation() {
    if (this.isSimulating) return;
    this.isSimulating = true;

    setInterval(() => {
      this.buses.forEach(bus => {
        // Simulate movement
        const moveDistance = (bus.speed / 3600) * 0.001; // Convert km/h to degrees per second
        const radians = (bus.direction * Math.PI) / 180;
        
        bus.lat += Math.cos(radians) * moveDistance * (Math.random() * 0.5 + 0.75);
        bus.lng += Math.sin(radians) * moveDistance * (Math.random() * 0.5 + 0.75);
        
        // Occasionally change direction
        if (Math.random() < 0.1) {
          bus.direction += (Math.random() - 0.5) * 60;
        }
        
        // Update other properties
        if (Math.random() < 0.05) {
          bus.passengers = Math.max(0, Math.min(50, bus.passengers + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3)));
        }
        
        if (Math.random() < 0.1) {
          bus.speed = Math.max(10, Math.min(60, bus.speed + (Math.random() - 0.5) * 10));
        }
        
        if (Math.random() < 0.02) {
          const route = Object.values(this.routes).find(r => r.name === bus.route);
          if (route) {
            bus.nextStop = route.stops[Math.floor(Math.random() * route.stops.length)];
            bus.eta = Math.floor(Math.random() * 15) + 2;
          }
        }
      });
    }, 2000); // Update every 2 seconds
  }

  async getBusByNumber(number: string): Promise<MobileBus | null> {
    const buses = await this.getAllBuses();
    return buses.find(bus => bus.number === number) || null;
  }

  async searchBuses(query: string): Promise<MobileBus[]> {
    const buses = await this.getAllBuses();
    return buses.filter(bus => 
      bus.number.includes(query) || 
      bus.route.toLowerCase().includes(query.toLowerCase()) ||
      bus.nextStop.toLowerCase().includes(query.toLowerCase())
    );
  }
}

export const mobileBusService = new MobileBusService();