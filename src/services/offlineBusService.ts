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

// Offline storage utilities
const saveToCache = (key: string, data: any) => {
  try {
    localStorage.setItem(`smartcommute-${key}`, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error('Cache save failed:', error);
  }
};

const getFromCache = (key: string, maxAge = 300000) => {
  try {
    const cached = localStorage.getItem(`smartcommute-${key}`);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < maxAge) {
        return data;
      }
    }
  } catch (error) {
    console.error('Cache read failed:', error);
  }
  return null;
};

const fetchWithOfflineSupport = async (url: string, cacheKey: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network request failed');
    const data = await response.json();
    saveToCache(cacheKey, data);
    return data;
  } catch (error) {
    console.warn('Network failed, using cache:', error);
    const cached = getFromCache(cacheKey, 3600000);
    if (cached) {
      return cached;
    }
    throw new Error('No cached data available');
  }
};

export const offlineBusService = {
  async getAllBuses(): Promise<Bus[]> {
    try {
      return await fetchWithOfflineSupport(`${API_BASE_URL}/buses`, 'buses');
    } catch (error) {
      console.error('Error fetching buses:', error);
      return [];
    }
  },

  async getBusByNumber(busNumber: string): Promise<Bus | null> {
    try {
      return await fetchWithOfflineSupport(`${API_BASE_URL}/buses/${busNumber}`, `bus-${busNumber}`);
    } catch (error) {
      console.error('Error fetching bus:', error);
      return null;
    }
  },

  async getRoutes(): Promise<any[]> {
    try {
      return await fetchWithOfflineSupport(`${API_BASE_URL}/routes`, 'routes');
    } catch (error) {
      console.error('Error fetching routes:', error);
      return [];
    }
  },

  async getBusesLowBandwidth(): Promise<Partial<Bus>[]> {
    try {
      const data = await fetchWithOfflineSupport(`${API_BASE_URL}/buses?minimal=true`, 'buses-minimal');
      return data;
    } catch (error) {
      const cached = getFromCache('buses', 3600000);
      if (cached) {
        return cached.map((bus: Bus) => ({
          busNumber: bus.busNumber,
          currentLocation: bus.currentLocation,
          status: bus.status
        }));
      }
      return [];
    }
  },

  isOnline: () => navigator.onLine,
  
  getCachedData: (key: string) => getFromCache(key, 86400000), // 24 hours
  
  clearCache: () => {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('smartcommute-'));
    keys.forEach(key => localStorage.removeItem(key));
  }
};