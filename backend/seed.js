import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Bus from './models/Bus.js';
import Route from './models/Route.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Clear existing data
    await Bus.deleteMany({});
    await Route.deleteMany({});
    
    // Seed routes for Telangana
    const routes = [
      {
        routeId: 'HYD001',
        name: 'Secunderabad - Gachibowli',
        stops: [
          { name: 'Secunderabad Railway Station', location: { lat: 17.4399, lng: 78.5014 }, order: 1 },
          { name: 'Ameerpet Metro', location: { lat: 17.4374, lng: 78.4482 }, order: 2 },
          { name: 'HITEC City', location: { lat: 17.4485, lng: 78.3684 }, order: 3 },
          { name: 'Gachibowli', location: { lat: 17.4399, lng: 78.3648 }, order: 4 }
        ],
        estimatedDuration: 60
      }
    ];
    
    // Seed buses for Telangana
    const buses = [
      {
        busNumber: 'TS07UA1234',
        route: 'HYD001',
        currentLocation: { lat: 17.4399, lng: 78.5014 },
        currentPassengers: 32
      },
      {
        busNumber: 'TS09UB5678',
        route: 'HYD001',
        currentLocation: { lat: 17.4374, lng: 78.4482 },
        currentPassengers: 18
      }
    ];
    
    await Route.insertMany(routes);
    await Bus.insertMany(buses);
    
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();