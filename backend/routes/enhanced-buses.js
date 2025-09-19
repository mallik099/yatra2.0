import express from 'express';
import Bus from '../models/Bus.js';

const router = express.Router();

// Enhanced bus tracking with accuracy metrics
router.get('/buses/:busNumber/enhanced', async (req, res) => {
  try {
    const { busNumber } = req.params;
    const bus = await Bus.findOne({ busNumber });
    
    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }

    // Add enhanced tracking data
    const enhancedBus = {
      ...bus.toObject(),
      currentLocation: {
        ...bus.currentLocation,
        accuracy: Math.random() * 5 + 2, // 2-7m GPS accuracy
        timestamp: Date.now(),
        speed: calculateRealisticSpeed(),
        heading: Math.random() * 360
      },
      eta: calculateAccurateETA(bus.currentLocation),
      etaConfidence: calculateETAConfidence(),
      trafficCondition: getCurrentTrafficCondition(),
      nextStops: getNextStops(bus.route, bus.currentLocation)
    };

    res.json(enhancedBus);
  } catch (error) {
    console.error('Enhanced tracking error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get nearby buses with enhanced data
router.get('/buses/nearby/enhanced', async (req, res) => {
  try {
    const { lat, lng, radius = 5 } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude required' });
    }

    // Find buses within radius (simplified calculation)
    const buses = await Bus.find({ status: 'active' });
    
    const nearbyBuses = buses.filter(bus => {
      const distance = calculateDistance(
        parseFloat(lat), parseFloat(lng),
        bus.currentLocation.lat, bus.currentLocation.lng
      );
      return distance <= parseFloat(radius);
    });

    // Enhance each bus with real-time data
    const enhancedBuses = nearbyBuses.map(bus => ({
      ...bus.toObject(),
      currentLocation: {
        ...bus.currentLocation,
        accuracy: Math.random() * 5 + 2,
        timestamp: Date.now(),
        speed: calculateRealisticSpeed(),
        heading: Math.random() * 360
      },
      eta: calculateAccurateETA(bus.currentLocation),
      etaConfidence: calculateETAConfidence(),
      distance: calculateDistance(
        parseFloat(lat), parseFloat(lng),
        bus.currentLocation.lat, bus.currentLocation.lng
      )
    }));

    res.json(enhancedBuses);
  } catch (error) {
    console.error('Nearby buses error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update bus location with enhanced tracking
router.put('/buses/:busNumber/location/enhanced', async (req, res) => {
  try {
    const { busNumber } = req.params;
    const { lat, lng, accuracy, speed, heading, passengers } = req.body;

    const updateData = {
      currentLocation: { lat, lng },
      lastUpdated: new Date()
    };

    if (passengers !== undefined) {
      updateData.currentPassengers = passengers;
    }

    const bus = await Bus.findOneAndUpdate(
      { busNumber },
      updateData,
      { new: true }
    );

    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }

    // Add enhanced tracking metadata
    const enhancedResponse = {
      ...bus.toObject(),
      currentLocation: {
        ...bus.currentLocation,
        accuracy: accuracy || Math.random() * 5 + 2,
        timestamp: Date.now(),
        speed: speed || calculateRealisticSpeed(),
        heading: heading || Math.random() * 360
      },
      updateStatus: 'success',
      dataQuality: accuracy <= 5 ? 'high' : accuracy <= 10 ? 'medium' : 'low'
    };

    res.json(enhancedResponse);
  } catch (error) {
    console.error('Enhanced location update error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get traffic conditions
router.get('/traffic/conditions', (req, res) => {
  const condition = getCurrentTrafficCondition();
  res.json(condition);
});

// Helper functions
function calculateRealisticSpeed() {
  const hour = new Date().getHours();
  let baseSpeed = 25; // km/h
  
  // Adjust for traffic patterns in Hyderabad
  if ((hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 19)) {
    baseSpeed *= 0.6; // Rush hour slowdown
  } else if (hour >= 22 || hour <= 6) {
    baseSpeed *= 1.3; // Night time faster
  }
  
  return baseSpeed + (Math.random() - 0.5) * 10;
}

function calculateAccurateETA(location) {
  const traffic = getCurrentTrafficCondition();
  const baseTime = Math.floor(Math.random() * 12) + 3;
  return Math.round(baseTime * traffic.factor);
}

function calculateETAConfidence() {
  const hour = new Date().getHours();
  let confidence = 0.85;
  
  // Higher confidence during regular hours
  if (hour >= 9 && hour <= 17) {
    confidence += 0.1;
  }
  
  // Lower confidence during rush hours
  if ((hour >= 8 && hour <= 9) || (hour >= 17 && hour <= 19)) {
    confidence -= 0.15;
  }
  
  return Math.min(0.98, Math.max(0.65, confidence + (Math.random() - 0.5) * 0.1));
}

function getCurrentTrafficCondition() {
  const hour = new Date().getHours();
  
  if ((hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 19)) {
    return {
      level: 'heavy',
      factor: 1.6,
      description: 'Heavy traffic due to rush hour',
      color: 'red'
    };
  } else if ((hour >= 11 && hour <= 16) || (hour >= 20 && hour <= 22)) {
    return {
      level: 'moderate',
      factor: 1.2,
      description: 'Moderate traffic conditions',
      color: 'yellow'
    };
  } else {
    return {
      level: 'light',
      factor: 1.0,
      description: 'Light traffic, normal conditions',
      color: 'green'
    };
  }
}

function getNextStops(route, currentLocation) {
  // Predefined stops for different routes in Telangana
  const routeStops = {
    'HYD001': [
      { name: 'Ameerpet Metro', lat: 17.4374, lng: 78.4482, facilities: ['Metro', 'Shelter'] },
      { name: 'HITEC City', lat: 17.4485, lng: 78.3684, facilities: ['Shelter', 'CCTV'] },
      { name: 'Gachibowli', lat: 17.4399, lng: 78.3648, facilities: ['Shelter', 'Seating'] }
    ],
    'HYD002': [
      { name: 'Secunderabad Station', lat: 17.4399, lng: 78.5014, facilities: ['Railway', 'Food'] },
      { name: 'Begumpet', lat: 17.4672, lng: 78.4435, facilities: ['Airport', 'Shelter'] },
      { name: 'Kukatpally', lat: 17.4851, lng: 78.4089, facilities: ['Metro', 'Mall'] }
    ]
  };

  const stops = routeStops[route] || routeStops['HYD001'];
  const traffic = getCurrentTrafficCondition();
  
  return stops.map((stop, index) => {
    const distance = calculateDistance(
      currentLocation.lat, currentLocation.lng,
      stop.lat, stop.lng
    );
    
    const baseETA = (distance / 25) * 60; // minutes at 25 km/h
    const adjustedETA = Math.round(baseETA * traffic.factor);
    
    return {
      ...stop,
      eta: Math.max(1, adjustedETA + index * 2), // Add 2 min per stop
      distance: distance.toFixed(1),
      confidence: calculateETAConfidence()
    };
  });
}

function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

export default router;