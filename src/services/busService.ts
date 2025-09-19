const API_BASE_URL = 'http://localhost:3001/api';

export interface BusLocation {
  lat: number;
  lng: number;
}

export interface Bus {
  busNumber: string;
  route: string;
  currentLocation: BusLocation;
  currentPassengers: number;
  capacity: number;
  status: string;
  nextStop?: string;
  eta?: number;
}

export const busService = {
  async getAllBuses(): Promise<Bus[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/buses`);
      if (!response.ok) throw new Error('Failed to fetch buses');
      return await response.json();
    } catch (error) {
      console.error('Error fetching buses:', error);
      return [];
    }
  },

  async getBusByNumber(busNumber: string): Promise<Bus | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/buses/${busNumber}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Error fetching bus:', error);
      return null;
    }
  },

  async updateBusLocation(busNumber: string, location: BusLocation, passengers?: number): Promise<Bus | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/buses/${busNumber}/location`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat: location.lat,
          lng: location.lng,
          currentPassengers: passengers
        })
      });
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Error updating bus location:', error);
      return null;
    }
  },

  async getRoutes(): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/routes`);
      if (!response.ok) throw new Error('Failed to fetch routes');
      return await response.json();
    } catch (error) {
      console.error('Error fetching routes:', error);
      return [];
    }
  }
};