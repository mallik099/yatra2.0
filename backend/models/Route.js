import mongoose from 'mongoose';

const routeSchema = new mongoose.Schema({
  routeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  stops: [{
    name: { type: String, required: true },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },
    order: { type: Number, required: true }
  }],
  estimatedDuration: { type: Number, required: true }
});

export default mongoose.model('Route', routeSchema);