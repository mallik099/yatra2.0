import express from 'express';
import Route from '../models/Route.js';

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