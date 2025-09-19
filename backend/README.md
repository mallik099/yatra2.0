# Yatra Backend

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure MongoDB Atlas:
   - Create account at https://cloud.mongodb.com
   - Create cluster and get connection string
   - Update `.env` file with your credentials

3. Start server:
```bash
npm run dev
```

## API Endpoints

### Buses
- `GET /api/buses` - Get all active buses
- `GET /api/buses/:busNumber` - Get specific bus
- `PUT /api/buses/:busNumber/location` - Update bus location

### Routes
- `GET /api/routes` - Get all routes
- `GET /api/routes/:routeId` - Get specific route

### Health
- `GET /api/health` - Server health check