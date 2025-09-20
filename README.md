# 🚍 Yatra - Telangana Public Transport Tracker

> **Real-time bus tracking for Telangana State Road Transport Corporation (TSRTC)**

## 🌟 Overview

Yatra is a clean, modern web app for tracking TSRTC buses in real-time across Telangana state. Built specifically for commuters in Hyderabad and other major cities in Telangana.

## 🎯 Features

### 🚌 Core Functionality
- **Live Bus Tracking** - Real-time bus locations on interactive map
- **Route Search** - Find buses between any two stops
- **ETA Information** - Accurate arrival time predictions
- **Popular Routes** - Quick access to commonly used routes
- **Mobile Responsive** - Optimized for mobile devices

### 📍 Coverage Areas
- **Hyderabad** (Primary focus)
- **Warangal** (Future expansion)
- **Nizamabad** (Future expansion)
- **Karimnagar** (Future expansion)
- **Khammam** (Future expansion)

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: shadcn/ui + Tailwind CSS
- **Maps**: Leaflet + OpenStreetMap
- **Routing**: React Router v6
- **Icons**: Lucide React

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd yatra

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

### Build for Production

```bash
npm run build
npm run preview
```

## 📱 App Structure

```
src/
├── components/
│   └── ui/              # shadcn/ui components
├── pages/
│   ├── Home.tsx         # Landing page
│   ├── LiveTracking.tsx # Real-time bus map
│   └── RouteSearch.tsx  # Route finder
├── data/
│   └── sampleData.ts    # TSRTC bus data
├── config/
│   └── constants.ts     # App configuration
└── App.tsx              # Main app component
```

## 🗺️ Routes

- `/` - Home page with quick actions
- `/live` - Live bus tracking map
- `/search` - Route search and planning

## 🚌 Sample Bus Routes

The app includes sample data for popular Hyderabad routes:
- **100K**: Secunderabad ↔ Koti
- **156**: Mehdipatnam ↔ KPHB
- **290U**: LB Nagar ↔ Gachibowli
- **218**: Ameerpet ↔ Uppal

## 🎨 Design

- **Clean & Minimal**: Focus on essential functionality
- **Mobile-First**: Optimized for smartphone usage
- **Accessible**: High contrast and readable fonts
- **Fast**: Lightweight and performant

## 🔧 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Adding New Routes

1. Update `src/data/sampleData.ts` with new bus data
2. Add route information to the search functionality
3. Update map markers and popups as needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and feature requests, please use the GitHub Issues page.

---

**Built for Telangana commuters with ❤️**