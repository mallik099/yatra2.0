import express from 'express';
const router = express.Router();

// Mock data for live buses
const liveBuses = [
  {
    id: '1',
    routeNumber: '42',
    destination: 'City Center',
    currentLocation: { lat: 12.9716, lng: 77.5946 },
    eta: 5,
    status: 'on-time',
    occupancy: 'medium',
    nextStop: 'MG Road'
  },
  {
    id: '2',
    routeNumber: '15',
    destination: 'Airport',
    currentLocation: { lat: 12.9716, lng: 77.5946 },
    eta: 12,
    status: 'delayed',
    occupancy: 'high',
    nextStop: 'Whitefield'
  },
  {
    id: '3',
    routeNumber: '8',
    destination: 'Electronic City',
    currentLocation: { lat: 12.9716, lng: 77.5946 },
    eta: 3,
    status: 'early',
    occupancy: 'low',
    nextStop: 'Silk Board'
  }
];

const busStops = [
  {
    id: '1',
    name: 'MG Road Bus Stop',
    location: { lat: 12.9716, lng: 77.5946 },
    distance: 150
  },
  {
    id: '2',
    name: 'Brigade Road',
    location: { lat: 12.9716, lng: 77.5946 },
    distance: 300
  },
  {
    id: '3',
    name: 'Commercial Street',
    location: { lat: 12.9716, lng: 77.5946 },
    distance: 450
  }
];

// Get live bus data
router.get('/buses/live', (req, res) => {
  // Simulate real-time updates by slightly modifying ETA
  const updatedBuses = liveBuses.map(bus => ({
    ...bus,
    eta: Math.max(1, bus.eta + Math.floor(Math.random() * 3) - 1)
  }));
  
  res.json(updatedBuses);
});

// Get nearby bus stops
router.get('/stops/nearby', (req, res) => {
  const { lat, lng } = req.query;
  
  // In real implementation, calculate actual distances
  const nearbyStops = busStops.map(stop => ({
    ...stop,
    distance: Math.floor(Math.random() * 500) + 100
  })).sort((a, b) => a.distance - b.distance);
  
  res.json(nearbyStops);
});

// Get route details
router.get('/route/:routeNumber', (req, res) => {
  const { routeNumber } = req.params;
  
  const route = {
    routeNumber,
    stops: busStops,
    frequency: '10-15 minutes',
    operatingHours: '6:00 AM - 11:00 PM',
    fare: 25
  };
  
  res.json(route);
});

// Low bandwidth mode - text only updates
router.get('/buses/text', (req, res) => {
  const textData = liveBuses.map(bus => ({
    route: bus.routeNumber,
    eta: bus.eta,
    status: bus.status
  }));
  
  res.json(textData);
});

export default router;