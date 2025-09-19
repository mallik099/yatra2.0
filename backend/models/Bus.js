import mongoose from 'mongoose';

const busSchema = new mongoose.Schema({
  busNumber: { type: String, required: true, unique: true },
  route: { type: String, required: true },
  currentLocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  capacity: { type: Number, default: 50 },
  currentPassengers: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive', 'maintenance'], default: 'active' },
  lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.model('Bus', busSchema);