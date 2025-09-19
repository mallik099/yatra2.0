import express from 'express';
const router = express.Router();

// Mock driver sessions
let driverSessions = new Map();

// Update driver location
router.post('/location', (req, res) => {
  const { lat, lng, timestamp } = req.body;
  const driverId = req.headers['driver-id'] || 'driver-1'; // In real app, get from auth
  
  driverSessions.set(driverId, {
    location: { lat, lng },
    timestamp,
    lastUpdate: new Date()
  });
  
  res.json({ success: true, message: 'Location updated' });
});

// Start trip
router.post('/trip/start', (req, res) => {
  const { routeNumber } = req.body;
  const driverId = req.headers['driver-id'] || 'driver-1';
  
  const trip = {
    id: Date.now().toString(),
    driverId,
    routeNumber,
    startTime: new Date().toISOString(),
    status: 'active',
    passengerCount: 0
  };
  
  res.json(trip);
});

// End trip
router.post('/trip/end', (req, res) => {
  const { tripId } = req.body;
  const driverId = req.headers['driver-id'] || 'driver-1';
  
  res.json({
    tripId,
    endTime: new Date().toISOString(),
    status: 'completed'
  });
});

// Get driver status
router.get('/status', (req, res) => {
  const driverId = req.headers['driver-id'] || 'driver-1';
  const session = driverSessions.get(driverId);
  
  res.json({
    driverId,
    isActive: !!session,
    lastLocation: session?.location,
    lastUpdate: session?.lastUpdate
  });
});

export default router;