import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Bus from './models/Bus.js';

dotenv.config();

const seedTSRTCBuses = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing buses
    await Bus.deleteMany({});
    console.log('Cleared existing bus data');
    
    // TSRTC Bus data for Hyderabad routes
    const tsrtcBuses = [
      {
        busNumber: '100K',
        currentLocation: { lat: 17.4416, lng: 78.5009 },
        route: {
          source: 'Secunderabad',
          destination: 'Koti',
          nextStop: 'Paradise Circle',
          stops: [
            { name: 'Secunderabad Railway Station', location: { lat: 17.4399, lng: 78.5014 } },
            { name: 'Paradise Circle', location: { lat: 17.4326, lng: 78.4969 } },
            { name: 'Begumpet', location: { lat: 17.4435, lng: 78.4677 } },
            { name: 'Koti', location: { lat: 17.3753, lng: 78.4815 } }
          ]
        },
        status: 'ON_ROUTE',
        fare: { regular: 25, ac: 35 },
        capacity: { total: 50, available: 18 },
        vehicleType: 'NON_AC'
      },
      {
        busNumber: '156',
        currentLocation: { lat: 17.3616, lng: 78.4747 },
        route: {
          source: 'Mehdipatnam',
          destination: 'KPHB',
          nextStop: 'Tolichowki',
          stops: [
            { name: 'Mehdipatnam', location: { lat: 17.3969, lng: 78.4194 } },
            { name: 'Tolichowki', location: { lat: 17.4089, lng: 78.4089 } },
            { name: 'Banjara Hills', location: { lat: 17.4239, lng: 78.4738 } },
            { name: 'KPHB', location: { lat: 17.4851, lng: 78.3912 } }
          ]
        },
        status: 'ON_ROUTE',
        fare: { regular: 35, ac: 45 },
        capacity: { total: 45, available: 27 },
        vehicleType: 'AC'
      },
      {
        busNumber: '290U',
        currentLocation: { lat: 17.3510, lng: 78.5532 },
        route: {
          source: 'LB Nagar',
          destination: 'Gachibowli',
          nextStop: 'Dilsukhnagar',
          stops: [
            { name: 'LB Nagar', location: { lat: 17.3510, lng: 78.5532 } },
            { name: 'Dilsukhnagar', location: { lat: 17.3687, lng: 78.5244 } },
            { name: 'Chaitanyapuri', location: { lat: 17.3850, lng: 78.5070 } },
            { name: 'Gachibowli', location: { lat: 17.4399, lng: 78.3648 } }
          ]
        },
        status: 'DELAYED',
        fare: { regular: 40, ac: 50 },
        capacity: { total: 55, available: 15 },
        vehicleType: 'DELUXE'
      },
      {
        busNumber: '218',
        currentLocation: { lat: 17.4065, lng: 78.4482 },
        route: {
          source: 'Ameerpet',
          destination: 'Uppal',
          nextStop: 'SR Nagar',
          stops: [
            { name: 'Ameerpet Metro', location: { lat: 17.4374, lng: 78.4482 } },
            { name: 'SR Nagar', location: { lat: 17.4065, lng: 78.4482 } },
            { name: 'Habsiguda', location: { lat: 17.4065, lng: 78.5482 } },
            { name: 'Uppal', location: { lat: 17.4065, lng: 78.5682 } }
          ]
        },
        status: 'ON_ROUTE',
        fare: { regular: 30, ac: 40 },
        capacity: { total: 50, available: 32 },
        vehicleType: 'NON_AC'
      },
      {
        busNumber: '5K',
        currentLocation: { lat: 17.4126, lng: 78.4392 },
        route: {
          source: 'Afzalgunj',
          destination: 'Jubilee Hills',
          nextStop: 'Nampally',
          stops: [
            { name: 'Afzalgunj', location: { lat: 17.3753, lng: 78.4815 } },
            { name: 'Nampally', location: { lat: 17.3850, lng: 78.4867 } },
            { name: 'Lakdikapul', location: { lat: 17.4026, lng: 78.4392 } },
            { name: 'Jubilee Hills', location: { lat: 17.4326, lng: 78.4069 } }
          ]
        },
        status: 'ON_ROUTE',
        fare: { regular: 20, ac: 30 },
        capacity: { total: 45, available: 23 },
        vehicleType: 'AC'
      },
      {
        busNumber: '49M',
        currentLocation: { lat: 17.4485, lng: 78.3684 },
        route: {
          source: 'MGBS',
          destination: 'HITEC City',
          nextStop: 'Mehdipatnam',
          stops: [
            { name: 'MGBS', location: { lat: 17.3616, lng: 78.4747 } },
            { name: 'Mehdipatnam', location: { lat: 17.3969, lng: 78.4194 } },
            { name: 'Madhapur', location: { lat: 17.4485, lng: 78.3915 } },
            { name: 'HITEC City', location: { lat: 17.4485, lng: 78.3684 } }
          ]
        },
        status: 'ON_ROUTE',
        fare: { regular: 45, ac: 55 },
        capacity: { total: 60, available: 12 },
        vehicleType: 'DELUXE'
      }
    ];
    
    // Insert buses
    await Bus.insertMany(tsrtcBuses);
    console.log(`Seeded ${tsrtcBuses.length} TSRTC buses successfully`);
    
    // Display seeded data
    const buses = await Bus.find({});
    console.log('\nSeeded buses:');
    buses.forEach(bus => {
      console.log(`- ${bus.busNumber}: ${bus.route.source} → ${bus.route.destination} (${bus.status})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedTSRTCBuses();