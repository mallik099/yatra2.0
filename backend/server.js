import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import busRoutes from './routes/buses.js';
import routeRoutes from './routes/routes.js';
import enhancedBusRoutes from './routes/enhanced-buses.js';
import adminRoutes from './routes/admin.js';
import driverRoutes from './routes/driver.js';
import passengerRoutes from './routes/passenger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/buses', busRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api', enhancedBusRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api', passengerRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});