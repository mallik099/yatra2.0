import express from 'express';
import Route from '../models/Route.js';
import Bus from '../models/Bus.js';

const router = express.Router();

// Get all routes
router.get('/', async (req, res) => {
  try {
    const routes = await Route.find();
    res.json(routes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search routes between two stops
router.get('/search', async (req, res) => {
  try {
    const { from, to } = req.query;
    
    if (!from || !to) {
      return res.status(400).json({ error: 'Both from and to parameters are required' });
    }

    // Find routes that contain both stops
    const routes = await Route.find({
      $and: [
        { 'stops.name': { $regex: from, $options: 'i' } },
        { 'stops.name': { $regex: to, $options: 'i' } }
      ]
    });

    // Get buses for these routes
    const routeIds = routes.map(route => route.routeId);
    const buses = await Bus.find({ routeId: { $in: routeIds } });

    // Combine route and bus data
    const results = routes.map(route => {
      const routeBuses = buses.filter(bus => bus.routeId === route.routeId);
      return {
        routeId: route.routeId,
        name: route.name,
        stops: route.stops,
        estimatedDuration: route.estimatedDuration,
        buses: routeBuses.map(bus => ({
          busNumber: bus.busNumber,
          currentLocation: bus.currentLocation,
          nextStop: bus.nextStop,
          eta: bus.eta,
          fare: bus.fare
        }))
      };
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get route by ID
router.get('/:routeId', async (req, res) => {
  try {
    const route = await Route.findOne({ routeId: req.params.routeId });
    if (!route) return res.status(404).json({ error: 'Route not found' });
    res.json(route);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;