import express from 'express';
const router = express.Router();

// Mock data for demonstration
let fleetData = [
  {
    id: '1',
    routeNumber: '42',
    driverName: 'John Doe',
    status: 'on-time',
    location: { lat: 12.9716, lng: 77.5946 },
    passengerCount: 25,
    lastUpdate: new Date().toISOString()
  },
  {
    id: '2',
    routeNumber: '15',
    driverName: 'Jane Smith',
    status: 'delayed',
    location: { lat: 12.9716, lng: 77.5946 },
    passengerCount: 18,
    lastUpdate: new Date().toISOString(),
    delayMinutes: 8
  },
  {
    id: '3',
    routeNumber: '8',
    driverName: 'Mike Johnson',
    status: 'breakdown',
    location: { lat: 12.9716, lng: 77.5946 },
    passengerCount: 0,
    lastUpdate: new Date().toISOString()
  }
];

// Get fleet status
router.get('/fleet', (req, res) => {
  res.json(fleetData);
});

// Get analytics data
router.get('/analytics', (req, res) => {
  const analytics = {
    totalBuses: fleetData.length,
    activeBuses: fleetData.filter(bus => bus.status !== 'offline').length,
    avgDelay: Math.round(fleetData.reduce((acc, bus) => acc + (bus.delayMinutes || 0), 0) / fleetData.length),
    totalPassengers: fleetData.reduce((acc, bus) => acc + bus.passengerCount, 0),
    onTimePercentage: Math.round((fleetData.filter(bus => bus.status === 'on-time').length / fleetData.length) * 100)
  };
  res.json(analytics);
});

// Update bus status
router.put('/bus/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, delayMinutes } = req.body;
  
  const busIndex = fleetData.findIndex(bus => bus.id === id);
  if (busIndex !== -1) {
    fleetData[busIndex].status = status;
    if (delayMinutes !== undefined) {
      fleetData[busIndex].delayMinutes = delayMinutes;
    }
    fleetData[busIndex].lastUpdate = new Date().toISOString();
    res.json(fleetData[busIndex]);
  } else {
    res.status(404).json({ error: 'Bus not found' });
  }
});

export default router;