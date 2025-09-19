import express from 'express';
import Bus from '../models/Bus.js';

const router = express.Router();

// Get all buses
router.get('/', async (req, res) => {
  try {
    const buses = await Bus.find({ status: 'active' });
    res.json(buses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get bus by number
router.get('/:busNumber', async (req, res) => {
  try {
    const bus = await Bus.findOne({ busNumber: req.params.busNumber });
    if (!bus) return res.status(404).json({ error: 'Bus not found' });
    res.json(bus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update bus location
router.put('/:busNumber/location', async (req, res) => {
  try {
    const { lat, lng, currentPassengers } = req.body;
    const bus = await Bus.findOneAndUpdate(
      { busNumber: req.params.busNumber },
      { 
        currentLocation: { lat, lng },
        currentPassengers: currentPassengers || 0,
        lastUpdated: new Date()
      },
      { new: true }
    );
    if (!bus) return res.status(404).json({ error: 'Bus not found' });
    res.json(bus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;