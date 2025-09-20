import mongoose from 'mongoose';

const busSchema = new mongoose.Schema({
  busNumber: { 
    type: String, 
    required: true, 
    unique: true 
  },
  currentLocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    updatedAt: { type: Date, default: Date.now }
  },
  route: {
    source: { type: String, required: true },
    destination: { type: String, required: true },
    stops: [{
      name: String,
      location: {
        lat: Number,
        lng: Number
      },
      expectedTime: Date
    }],
    nextStop: String
  },
  status: {
    type: String,
    enum: ['ON_ROUTE', 'DELAYED', 'STOPPED', 'OUT_OF_SERVICE'],
    default: 'ON_ROUTE'
  },
  fare: {
    regular: Number,
    ac: Number
  },
  capacity: {
    total: { type: Number, default: 50 },
    available: { type: Number, default: 50 }
  },
  vehicleType: {
    type: String,
    enum: ['AC', 'NON_AC', 'DELUXE'],
    default: 'NON_AC'
  },
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  }
});

// Index for geospatial queries
busSchema.index({ 'currentLocation': '2dsphere' });

// Method to get ETA to next stop
busSchema.methods.getETA = function() {
  return '10 mins'; // Implement actual calculation logic
};

// Method to find nearby buses
busSchema.statics.findNearby = function(coordinates, maxDistance = 5000) {
  return this.find({
    currentLocation: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [coordinates.lng, coordinates.lat]
        },
        $maxDistance: maxDistance
      }
    }
  });
};

export default mongoose.model('Bus', busSchema);