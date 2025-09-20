import express from 'express';
import Bus from '../models/Bus.js';

const router = express.Router();

// Get all active buses
router.get('/buses', async (req, res) => {
  try {
    const buses = await Bus.find({ status: 'ON_ROUTE' });
    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get nearby buses
router.get('/buses/nearby', async (req, res) => {
  try {
    const { lat, lng, distance = 5000 } = req.query;
    const buses = await Bus.findNearby({ lat: Number(lat), lng: Number(lng) }, Number(distance));
    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search buses by route
router.get('/buses/search', async (req, res) => {
  try {
    const { source, destination } = req.query;
    const buses = await Bus.find({
      'route.source': { $regex: source, $options: 'i' },
      'route.destination': { $regex: destination, $options: 'i' },
      status: 'ON_ROUTE'
    });
    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get bus details by number
router.get('/buses/:busNumber', async (req, res) => {
  try {
    const bus = await Bus.findOne({ busNumber: req.params.busNumber });
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    res.json(bus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get ETA for a bus
router.get('/buses/:busNumber/eta', async (req, res) => {
  try {
    const bus = await Bus.findOne({ busNumber: req.params.busNumber });
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    const eta = bus.getETA();
    res.json({ eta });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;