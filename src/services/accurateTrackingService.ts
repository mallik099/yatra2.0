interface AccurateLocation {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: number;
  speed?: number;
  heading?: number;
}

interface RouteSegment {
  start: AccurateLocation;
  end: AccurateLocation;
  distance: number;
  duration: number;
  traffic: 'light' | 'moderate' | 'heavy';
}

interface AccurateBusData {
  busNumber: string;
  route: string;
  currentLocation: AccurateLocation;
  nextStops: Array<{
    name: string;
    location: AccurateLocation;
    eta: number;
    confidence: number;
  }>;
  capacity: number;
  currentPassengers: number;
  speed: number;
  status: 'active' | 'delayed' | 'breakdown' | 'off-route';
}

class AccurateTrackingService {
  private watchId: number | null = null;
  private lastKnownPosition: AccurateLocation | null = null;

  // Get high-accuracy GPS position
  async getCurrentPosition(): Promise<AccurateLocation> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: AccurateLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: Date.now(),
            speed: position.coords.speed || undefined,
            heading: position.coords.heading || undefined
          };
          this.lastKnownPosition = location;
          resolve(location);
        },
        (error) => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000
        }
      );
    });
  }

  // Calculate accurate distance using Haversine formula
  calculateDistance(pos1: AccurateLocation, pos2: AccurateLocation): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(pos2.lat - pos1.lat);
    const dLng = this.toRad(pos2.lng - pos1.lng);
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(this.toRad(pos1.lat)) * Math.cos(this.toRad(pos2.lat)) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  // Calculate accurate ETA based on real factors
  calculateAccurateETA(
    currentPos: AccurateLocation,
    destination: AccurateLocation,
    currentSpeed: number,
    trafficFactor: number = 1.2
  ): { eta: number; confidence: number } {
    const distance = this.calculateDistance(currentPos, destination);
    const avgSpeed = currentSpeed > 0 ? currentSpeed : 25; // km/h
    
    // Factor in traffic, stops, and real-world delays
    const adjustedSpeed = avgSpeed / trafficFactor;
    const etaMinutes = (distance / adjustedSpeed) * 60;
    
    // Calculate confidence based on data quality
    const confidence = Math.min(0.95, 
      (currentPos.accuracy < 10 ? 0.9 : 0.7) * 
      (currentSpeed > 0 ? 1.0 : 0.8)
    );
    
    return {
      eta: Math.max(1, Math.round(etaMinutes)),
      confidence
    };
  }

  // Get real-time traffic data (mock implementation)
  async getTrafficData(route: RouteSegment[]): Promise<number> {
    // In real implementation, this would call traffic APIs
    const hour = new Date().getHours();
    
    // Rush hour traffic simulation
    if ((hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 19)) {
      return 1.5; // 50% slower
    } else if (hour >= 11 && hour <= 16) {
      return 1.2; // 20% slower
    }
    return 1.0; // Normal traffic
  }

  // Enhanced bus tracking with real-time updates
  async trackBusAccurately(busNumber: string): Promise<AccurateBusData | null> {
    try {
      // Try to get real bus data from backend
      const response = await fetch(`http://localhost:3002/api/buses/${busNumber}`);
      
      if (response.ok) {
        const busData = await response.json();
        
        // Enhance with accurate calculations
        const currentLocation: AccurateLocation = {
          ...busData.currentLocation,
          accuracy: 5, // Assume GPS accuracy
          timestamp: Date.now()
        };

        // Calculate next stops with accurate ETAs
        const nextStops = await this.calculateNextStops(currentLocation, busData.route);
        
        return {
          busNumber,
          route: busData.route,
          currentLocation,
          nextStops,
          capacity: busData.capacity,
          currentPassengers: busData.currentPassengers,
          speed: this.calculateSpeed(currentLocation),
          status: busData.status
        };
      }
      
      return null;
    } catch (error) {
      console.error('Accurate tracking error:', error);
      return null;
    }
  }

  private async calculateNextStops(currentPos: AccurateLocation, route: string) {
    // Predefined stops for Telangana routes
    const routeStops = {
      'HYD001': [
        { name: 'Ameerpet Metro', lat: 17.4374, lng: 78.4482 },
        { name: 'HITEC City', lat: 17.4485, lng: 78.3684 },
        { name: 'Gachibowli', lat: 17.4399, lng: 78.3648 }
      ],
      'HYD002': [
        { name: 'Secunderabad', lat: 17.4399, lng: 78.5014 },
        { name: 'Begumpet', lat: 17.4672, lng: 78.4435 },
        { name: 'Kukatpally', lat: 17.4851, lng: 78.4089 }
      ]
    };

    const stops = routeStops[route as keyof typeof routeStops] || routeStops['HYD001'];
    const trafficFactor = await this.getTrafficData([]);

    return stops.map(stop => {
      const stopLocation: AccurateLocation = {
        lat: stop.lat,
        lng: stop.lng,
        accuracy: 1,
        timestamp: Date.now()
      };

      const etaData = this.calculateAccurateETA(
        currentPos,
        stopLocation,
        25, // Average bus speed
        trafficFactor
      );

      return {
        name: stop.name,
        location: stopLocation,
        eta: etaData.eta,
        confidence: etaData.confidence
      };
    });
  }

  private calculateSpeed(location: AccurateLocation): number {
    if (!this.lastKnownPosition || !location.speed) {
      return 0;
    }

    const timeDiff = (location.timestamp - this.lastKnownPosition.timestamp) / 1000; // seconds
    const distance = this.calculateDistance(this.lastKnownPosition, location) * 1000; // meters
    
    return (distance / timeDiff) * 3.6; // Convert m/s to km/h
  }

  // Start continuous tracking
  startAccurateTracking(callback: (data: AccurateBusData) => void): void {
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location: AccurateLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: Date.now(),
          speed: position.coords.speed || undefined,
          heading: position.coords.heading || undefined
        };

        // Update tracking data
        this.lastKnownPosition = location;
      },
      (error) => console.error('Tracking error:', error),
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 1000
      }
    );
  }

  stopAccurateTracking(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }
}

export const accurateTrackingService = new AccurateTrackingService();
export type { AccurateLocation, AccurateBusData, RouteSegment };