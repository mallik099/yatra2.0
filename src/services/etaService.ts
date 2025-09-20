interface BusStop {
  name: string;
  lat: number;
  lng: number;
}

interface RouteData {
  busNumber: string;
  stops: BusStop[];
  avgSpeed: number; // km/h
  stopDuration: number; // minutes per stop
}

// Hyderabad bus route data with key stops
const routeData: Record<string, RouteData> = {
  '100K': {
    busNumber: '100K',
    avgSpeed: 25,
    stopDuration: 2,
    stops: [
      { name: 'Secunderabad', lat: 17.4416, lng: 78.5009 },
      { name: 'Paradise Circle', lat: 17.4326, lng: 78.4926 },
      { name: 'Begumpet', lat: 17.4239, lng: 78.4738 },
      { name: 'Ameerpet', lat: 17.4065, lng: 78.4482 },
      { name: 'Punjagutta', lat: 17.4020, lng: 78.4378 },
      { name: 'Lakdikapul', lat: 17.3953, lng: 78.4594 },
      { name: 'Koti', lat: 17.3753, lng: 78.4815 }
    ]
  },
  '156': {
    busNumber: '156',
    avgSpeed: 22,
    stopDuration: 2,
    stops: [
      { name: 'Mehdipatnam', lat: 17.3616, lng: 78.4747 },
      { name: 'Tolichowki', lat: 17.3728, lng: 78.4647 },
      { name: 'Shaikpet', lat: 17.3856, lng: 78.4523 },
      { name: 'Jubilee Hills', lat: 17.4239, lng: 78.4065 },
      { name: 'Madhapur', lat: 17.4483, lng: 78.3915 },
      { name: 'KPHB', lat: 17.4851, lng: 78.3912 }
    ]
  },
  '290U': {
    busNumber: '290U',
    avgSpeed: 20,
    stopDuration: 3,
    stops: [
      { name: 'LB Nagar', lat: 17.3510, lng: 78.5532 },
      { name: 'Dilsukhnagar', lat: 17.3681, lng: 78.5245 },
      { name: 'Chaitanyapuri', lat: 17.3789, lng: 78.5123 },
      { name: 'Malakpet', lat: 17.3912, lng: 78.4956 },
      { name: 'Chaderghat', lat: 17.3845, lng: 78.4823 },
      { name: 'Abids', lat: 17.3850, lng: 78.4867 },
      { name: 'Ameerpet', lat: 17.4065, lng: 78.4482 },
      { name: 'Hitech City', lat: 17.4435, lng: 78.3772 },
      { name: 'Gachibowli', lat: 17.4399, lng: 78.3489 }
    ]
  },
  '218': {
    busNumber: '218',
    avgSpeed: 28,
    stopDuration: 2,
    stops: [
      { name: 'Ameerpet', lat: 17.4065, lng: 78.4482 },
      { name: 'SR Nagar', lat: 17.4156, lng: 78.4623 },
      { name: 'Erragadda', lat: 17.4289, lng: 78.4756 },
      { name: 'Bharat Nagar', lat: 17.4456, lng: 78.4923 },
      { name: 'Habsiguda', lat: 17.4289, lng: 78.5456 },
      { name: 'Uppal', lat: 17.4067, lng: 78.5578 }
    ]
  }
};

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Find the next stop for a bus based on its current location
function findNextStop(busNumber: string, currentLat: number, currentLng: number): BusStop | null {
  const route = routeData[busNumber];
  if (!route) return null;

  let minDistance = Infinity;
  let nextStop: BusStop | null = null;

  for (const stop of route.stops) {
    const distance = calculateDistance(currentLat, currentLng, stop.lat, stop.lng);
    if (distance < minDistance) {
      minDistance = distance;
      nextStop = stop;
    }
  }

  return nextStop;
}

// Calculate ETA to next stop
export function calculateETAToNextStop(
  busNumber: string, 
  currentLat: number, 
  currentLng: number
): { eta: string; nextStop: string; confidence: 'high' | 'medium' | 'low' } {
  const route = routeData[busNumber];
  
  if (!route) {
    return {
      eta: '5-10 mins',
      nextStop: 'Unknown',
      confidence: 'low'
    };
  }

  const nextStop = findNextStop(busNumber, currentLat, currentLng);
  
  if (!nextStop) {
    return {
      eta: '5-10 mins',
      nextStop: 'Unknown',
      confidence: 'low'
    };
  }

  const distance = calculateDistance(currentLat, currentLng, nextStop.lat, nextStop.lng);
  
  // Calculate time based on distance and average speed
  const timeInHours = distance / route.avgSpeed;
  const timeInMinutes = Math.round(timeInHours * 60);
  
  // Add buffer for traffic and stops
  const bufferMinutes = Math.max(1, Math.round(timeInMinutes * 0.3));
  const totalMinutes = timeInMinutes + bufferMinutes;
  
  let eta: string;
  let confidence: 'high' | 'medium' | 'low';
  
  if (totalMinutes <= 1) {
    eta = 'Arriving';
    confidence = 'high';
  } else if (totalMinutes <= 5) {
    eta = `${totalMinutes} mins`;
    confidence = 'high';
  } else if (totalMinutes <= 15) {
    eta = `${totalMinutes} mins`;
    confidence = 'medium';
  } else {
    eta = `${Math.round(totalMinutes / 5) * 5}+ mins`;
    confidence = 'low';
  }

  return {
    eta,
    nextStop: nextStop.name,
    confidence
  };
}

// Calculate ETA to a specific destination
export function calculateETAToDestination(
  busNumber: string,
  currentLat: number,
  currentLng: number,
  destinationName: string
): { eta: string; distance: number; confidence: 'high' | 'medium' | 'low' } {
  const route = routeData[busNumber];
  
  if (!route) {
    return {
      eta: '30-45 mins',
      distance: 0,
      confidence: 'low'
    };
  }

  // Find destination stop
  const destinationStop = route.stops.find(stop => 
    stop.name.toLowerCase().includes(destinationName.toLowerCase())
  );

  if (!destinationStop) {
    return {
      eta: '30-45 mins',
      distance: 0,
      confidence: 'low'
    };
  }

  const distance = calculateDistance(currentLat, currentLng, destinationStop.lat, destinationStop.lng);
  
  // Calculate number of stops between current location and destination
  const currentStopIndex = route.stops.findIndex(stop => {
    const distToStop = calculateDistance(currentLat, currentLng, stop.lat, stop.lng);
    return distToStop < 0.5; // Within 500m of stop
  });

  const destStopIndex = route.stops.findIndex(stop => stop.name === destinationStop.name);
  const stopsRemaining = Math.max(0, destStopIndex - currentStopIndex);

  // Calculate travel time
  const travelTimeHours = distance / route.avgSpeed;
  const stopTime = stopsRemaining * route.stopDuration;
  const totalMinutes = Math.round(travelTimeHours * 60) + stopTime;

  // Add traffic buffer
  const bufferMinutes = Math.round(totalMinutes * 0.2);
  const finalMinutes = totalMinutes + bufferMinutes;

  let eta: string;
  let confidence: 'high' | 'medium' | 'low';

  if (finalMinutes <= 10) {
    eta = `${finalMinutes} mins`;
    confidence = 'high';
  } else if (finalMinutes <= 30) {
    eta = `${Math.round(finalMinutes / 5) * 5} mins`;
    confidence = 'medium';
  } else {
    const hours = Math.floor(finalMinutes / 60);
    const mins = finalMinutes % 60;
    eta = hours > 0 ? `${hours}h ${mins}m` : `${finalMinutes} mins`;
    confidence = 'low';
  }

  return {
    eta,
    distance: Math.round(distance * 10) / 10,
    confidence
  };
}

// Get real-time bus speed based on recent location updates
export function calculateBusSpeed(
  previousLat: number,
  previousLng: number,
  currentLat: number,
  currentLng: number,
  timeElapsedMinutes: number
): number {
  if (timeElapsedMinutes <= 0) return 0;
  
  const distance = calculateDistance(previousLat, previousLng, currentLat, currentLng);
  const speedKmh = (distance / timeElapsedMinutes) * 60;
  
  // Cap speed at reasonable limits for city buses
  return Math.min(speedKmh, 60);
}

// Update ETA based on real-time conditions
export function getUpdatedETA(
  busNumber: string,
  currentLat: number,
  currentLng: number,
  currentSpeed?: number,
  trafficFactor: number = 1.0
): { eta: string; nextStop: string; confidence: 'high' | 'medium' | 'low' } {
  const baseETA = calculateETAToNextStop(busNumber, currentLat, currentLng);
  
  if (!currentSpeed) {
    return baseETA;
  }

  const route = routeData[busNumber];
  if (!route) return baseETA;

  const nextStop = findNextStop(busNumber, currentLat, currentLng);
  if (!nextStop) return baseETA;

  const distance = calculateDistance(currentLat, currentLng, nextStop.lat, nextStop.lng);
  
  // Use current speed if available and reasonable
  const effectiveSpeed = currentSpeed > 5 && currentSpeed < 60 ? currentSpeed : route.avgSpeed;
  const adjustedSpeed = effectiveSpeed * trafficFactor;
  
  const timeInMinutes = Math.round((distance / adjustedSpeed) * 60);
  const finalTime = Math.max(1, timeInMinutes);

  let eta: string;
  let confidence: 'high' | 'medium' | 'low' = 'medium';

  if (finalTime <= 1) {
    eta = 'Arriving';
    confidence = 'high';
  } else if (finalTime <= 5) {
    eta = `${finalTime} mins`;
    confidence = 'high';
  } else if (finalTime <= 15) {
    eta = `${finalTime} mins`;
    confidence = 'medium';
  } else {
    eta = `${Math.round(finalTime / 5) * 5}+ mins`;
    confidence = 'low';
  }

  return {
    eta,
    nextStop: nextStop.name,
    confidence
  };
}