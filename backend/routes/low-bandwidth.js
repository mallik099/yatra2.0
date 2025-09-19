import express from 'express';
import Bus from '../models/Bus.js';

const router = express.Router();

// Minimal bus data for low-bandwidth connections
router.get('/buses/minimal', async (req, res) => {
  try {
    const buses = await Bus.find({ status: 'active' })
      .select('busNumber currentLocation status')
      .limit(20)
      .lean();
    
    // Compress response for low bandwidth
    const compressed = buses.map(bus => ({
      n: bus.busNumber,
      l: [bus.currentLocation.lat, bus.currentLocation.lng],
      s: bus.status === 'active' ? 1 : 0
    }));
    
    res.json(compressed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Compressed route data
router.get('/routes/minimal', async (req, res) => {
  try {
    const routes = [
      { n: '218', s: ['Secunderabad', 'Gachibowli'], d: 25 },
      { n: '219', s: ['JBS', 'Gachibowli'], d: 22 },
      { n: '290', s: ['JBS', 'HITEC City'], d: 18 },
      { n: '251', s: ['Secunderabad', 'Ibrahimpatnam'], d: 45 }
    ];
    
    res.json(routes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;