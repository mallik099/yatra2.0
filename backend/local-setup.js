import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

// In-memory data store
let buses = [
  {
    busNumber: 'TS07UA1234',
    route: 'HYD001',
    currentLocation: { lat: 17.4399, lng: 78.5014 },
    capacity: 50,
    currentPassengers: 32,
    status: 'active',
    lastUpdated: new Date()
  },
  {
    busNumber: 'TS09UB5678',
    route: 'HYD002',
    currentLocation: { lat: 17.4851, lng: 78.4089 },
    capacity: 45,
    currentPassengers: 18,
    status: 'active',
    lastUpdated: new Date()
  },
  {
    busNumber: 'TS12UC9012',
    route: 'HYD003',
    currentLocation: { lat: 17.4485, lng: 78.3684 },
    capacity: 48,
    currentPassengers: 25,
    status: 'active',
    lastUpdated: new Date()
  },
  {
    busNumber: 'TS05UD3456',
    route: 'HYD004',
    currentLocation: { lat: 17.4672, lng: 78.4435 },
    capacity: 52,
    currentPassengers: 40,
    status: 'active',
    lastUpdated: new Date()
  },
  {
    busNumber: 'TS08UE7890',
    route: 'HYD005',
    currentLocation: { lat: 17.5030, lng: 78.3207 },
    capacity: 46,
    currentPassengers: 15,
    status: 'active',
    lastUpdated: new Date()
  },
  {
    busNumber: 'TS11UF2468',
    route: 'HYD006',
    currentLocation: { lat: 17.2403, lng: 78.4294 },
    capacity: 55,
    currentPassengers: 35,
    status: 'active',
    lastUpdated: new Date()
  },
  {
    busNumber: 'TS14UG1357',
    route: 'HYD007',
    currentLocation: { lat: 17.4641, lng: 78.3632 },
    capacity: 44,
    currentPassengers: 22,
    status: 'active',
    lastUpdated: new Date()
  },
  {
    busNumber: 'TS16UH9753',
    route: 'HYD008',
    currentLocation: { lat: 17.5030, lng: 78.3900 },
    capacity: 50,
    currentPassengers: 30,
    status: 'active',
    lastUpdated: new Date()
  }
];

let routes = [
  {
    routeId: 'HYD001',
    name: 'Secunderabad - Gachibowli',
    stops: [
      { name: 'Secunderabad Railway Station', location: { lat: 17.4399, lng: 78.5014 }, order: 1 },
      { name: 'Ameerpet Metro', location: { lat: 17.4374, lng: 78.4482 }, order: 2 },
      { name: 'HITEC City', location: { lat: 17.4485, lng: 78.3684 }, order: 3 },
      { name: 'Gachibowli', location: { lat: 17.4399, lng: 78.3648 }, order: 4 }
    ],
    estimatedDuration: 60
  },
  {
    routeId: 'HYD002',
    name: 'Kukatpally - Dilsukhnagar',
    stops: [
      { name: 'Kukatpally', location: { lat: 17.4851, lng: 78.4089 }, order: 1 },
      { name: 'Ameerpet Metro Station', location: { lat: 17.4374, lng: 78.4482 }, order: 2 },
      { name: 'Punjagutta', location: { lat: 17.4239, lng: 78.4738 }, order: 3 },
      { name: 'Dilsukhnagar', location: { lat: 17.3687, lng: 78.5242 }, order: 4 }
    ],
    estimatedDuration: 45
  },
  {
    routeId: 'HYD003',
    name: 'HITEC City - Charminar',
    stops: [
      { name: 'HITEC City', location: { lat: 17.4485, lng: 78.3684 }, order: 1 },
      { name: 'Jubilee Hills', location: { lat: 17.4239, lng: 78.4738 }, order: 2 },
      { name: 'Abids', location: { lat: 17.3753, lng: 78.4744 }, order: 3 },
      { name: 'Charminar', location: { lat: 17.3616, lng: 78.4747 }, order: 4 }
    ],
    estimatedDuration: 50
  },
  {
    routeId: 'HYD004',
    name: 'Begumpet - Uppal',
    stops: [
      { name: 'Begumpet Airport', location: { lat: 17.4672, lng: 78.4435 }, order: 1 },
      { name: 'Secunderabad Railway Station', location: { lat: 17.4399, lng: 78.5014 }, order: 2 },
      { name: 'Tarnaka', location: { lat: 17.4062, lng: 78.5562 }, order: 3 },
      { name: 'Uppal', location: { lat: 17.4062, lng: 78.5562 }, order: 4 }
    ],
    estimatedDuration: 40
  },
  {
    routeId: 'HYD005',
    name: 'Miyapur - LB Nagar',
    stops: [
      { name: 'Miyapur', location: { lat: 17.5030, lng: 78.3207 }, order: 1 },
      { name: 'Kukatpally', location: { lat: 17.4851, lng: 78.4089 }, order: 2 },
      { name: 'Ameerpet Metro Station', location: { lat: 17.4374, lng: 78.4482 }, order: 3 },
      { name: 'LB Nagar', location: { lat: 17.3420, lng: 78.5510 }, order: 4 }
    ],
    estimatedDuration: 55
  },
  {
    routeId: 'HYD006',
    name: 'Shamshabad Airport - City Center',
    stops: [
      { name: 'Shamshabad Airport', location: { lat: 17.2403, lng: 78.4294 }, order: 1 },
      { name: 'Aramghar', location: { lat: 17.3020, lng: 78.4510 }, order: 2 },
      { name: 'Mehdipatnam', location: { lat: 17.3969, lng: 78.4378 }, order: 3 },
      { name: 'Abids', location: { lat: 17.3753, lng: 78.4744 }, order: 4 }
    ],
    estimatedDuration: 70
  },
  {
    routeId: 'HYD007',
    name: 'Kondapur - Koti',
    stops: [
      { name: 'Kondapur', location: { lat: 17.4641, lng: 78.3632 }, order: 1 },
      { name: 'Gachibowli', location: { lat: 17.4399, lng: 78.3648 }, order: 2 },
      { name: 'Jubilee Hills', location: { lat: 17.4239, lng: 78.4738 }, order: 3 },
      { name: 'Koti', location: { lat: 17.3753, lng: 78.4744 }, order: 4 }
    ],
    estimatedDuration: 35
  },
  {
    routeId: 'HYD008',
    name: 'Nizampet - Malakpet',
    stops: [
      { name: 'Nizampet', location: { lat: 17.5030, lng: 78.3900 }, order: 1 },
      { name: 'Kukatpally', location: { lat: 17.4851, lng: 78.4089 }, order: 2 },
      { name: 'Secunderabad Railway Station', location: { lat: 17.4399, lng: 78.5014 }, order: 3 },
      { name: 'Malakpet', location: { lat: 17.4062, lng: 78.5200 }, order: 4 }
    ],
    estimatedDuration: 48
  }
];

// Routes
app.get('/api/buses', (req, res) => res.json(buses));
app.get('/api/buses/:busNumber', (req, res) => {
  const bus = buses.find(b => b.busNumber === req.params.busNumber);
  bus ? res.json(bus) : res.status(404).json({ error: 'Bus not found' });
});

app.put('/api/buses/:busNumber/location', (req, res) => {
  const { lat, lng, currentPassengers } = req.body;
  const bus = buses.find(b => b.busNumber === req.params.busNumber);
  if (bus) {
    bus.currentLocation = { lat, lng };
    bus.currentPassengers = currentPassengers || bus.currentPassengers;
    bus.lastUpdated = new Date();
    res.json(bus);
  } else {
    res.status(404).json({ error: 'Bus not found' });
  }
});

app.get('/api/routes', (req, res) => res.json(routes));
app.get('/api/routes/:routeId', (req, res) => {
  const route = routes.find(r => r.routeId === req.params.routeId);
  route ? res.json(route) : res.status(404).json({ error: 'Route not found' });
});

// Add bus search endpoint
app.get('/api/buses/search/:number', (req, res) => {
  const bus = buses.find(b => b.busNumber === req.params.number);
  bus ? res.json(bus) : res.status(404).json({ error: 'Bus not found' });
});

// Add route search endpoint
app.post('/api/routes/search', (req, res) => {
  const { from, to } = req.body;
  
  // Find routes that contain both locations
  const matchingRoutes = routes.filter(route => {
    const stopNames = route.stops.map(stop => stop.name.toLowerCase());
    const fromMatch = stopNames.some(name => 
      name.includes(from.toLowerCase()) || from.toLowerCase().includes(name)
    );
    const toMatch = stopNames.some(name => 
      name.includes(to.toLowerCase()) || to.toLowerCase().includes(name)
    );
    return fromMatch && toMatch;
  });
  
  // If no exact matches, find routes that pass through nearby areas
  if (matchingRoutes.length === 0) {
    const nearbyRoutes = routes.filter(route => {
      const stopNames = route.stops.map(stop => stop.name.toLowerCase());
      return stopNames.some(name => 
        name.includes(from.toLowerCase().split(' ')[0]) || 
        name.includes(to.toLowerCase().split(' ')[0])
      );
    });
    res.json(nearbyRoutes);
  } else {
    res.json(matchingRoutes);
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Local server running on port ${PORT}`);
  console.log('Using in-memory storage (no MongoDB required)');
});