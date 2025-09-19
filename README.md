# 🚍 Yatra - Live Bus Tracking App

> **Rapido-style bus tracking for passengers**

## 🌟 Overview

Yatra is a simple, real-time bus tracking app designed with a modern, Rapido-inspired UI for passengers to track buses and get live ETAs.

## 🔄 How It Works

1. **Mock Data** simulates live bus locations
2. **Frontend** displays buses on interactive map
3. **ETA Calculation** shows arrival times
4. **Real-time Updates** refresh every 10 seconds

## 🎯 Core Features

### 🚌 Passenger App (Prototype)
- **Live bus tracking** on interactive map
- **ETA countdown** ("Bus arriving in 5 min")
- **Nearest stop suggestion** via GPS
- **Simple route search** by bus number

## 🛠️ Technology Stack

### Frontend
- **React.js** with TypeScript
- **Vite** for fast development
- **shadcn-ui** component library
- **Tailwind CSS** for styling
- **React Router** for navigation

### Backend (Mock)
- **JSON files** for mock data
- **Local storage** for prototype
- **Simulated APIs** for testing

### Maps & Location
- **Google Maps API** / OpenStreetMap integration
- **Real-time GPS tracking**
- **Geolocation services**

### Deployment
- **Docker** containerization
- **AWS/GCP/Azure** cloud deployment
- **Nginx** reverse proxy
- **Firebase Cloud Messaging** for notifications

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd smartcommute

# Install frontend dependencies
npm install

# Start development server
npm run dev          # Frontend (port 5173)
```



## 🏢 Module Structure

```
src/
├── components/        # Map, ETA, Search components
├── pages/            # Main tracking pages
├── services/         # Mock API calls
├── utils/           # Helper functions
└── types/           # TypeScript types
```

## 📱 Access

- **Live Map**: `/` - Main bus tracking interface
- **Route Search**: `/search` - Find buses by number
- **Nearby Stops**: `/stops` - Find nearest stops



## 🔧 Mock APIs

- Mock bus locations with simulated movement
- Static bus stops data
- Calculated ETAs based on distance

## 🎨 Design

- **Minimal**: Clean gray/white theme
- **Mobile-first**: Rapido-style interface
- **Live updates**: Real-time bus positions
- **ETA display**: Countdown timers





## 🧪 Testing

```bash
# Run tests
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Wiki](https://github.com/your-repo/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)



---

**Built with ❤️ for smarter, greener urban transportation**
