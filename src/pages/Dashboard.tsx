import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Search, 
  ArrowUpDown, 
  Star, 
  Heart, 
  Navigation,
  Wifi,
  Snowflake,
  Users,
  Clock
} from 'lucide-react';
import { Card } from '../components/ui/simple-card';
import { Button } from '../components/ui/simple-button';
import BottomNavigation from '../components/BottomNavigation';
import TicketCard from '../components/TicketCard';

const Dashboard: React.FC = () => {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');

  const swapLocations = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
  };

  const quickAccessCards = [
    {
      icon: MapPin,
      title: 'Nearby Stops',
      subtitle: '5 stops within 500m',
      emoji: '🚌',
      link: '/live'
    },
    {
      icon: Star,
      title: 'Popular Routes',
      subtitle: '100K, 156, 290U',
      emoji: '⭐',
      link: '/search'
    },
    {
      icon: Heart,
      title: 'Saved Routes',
      subtitle: '3 favorite routes',
      emoji: '❤️',
      link: '/saved'
    }
  ];

  const nearbyBuses = [
    {
      number: '100K',
      route: 'Secunderabad → Koti',
      eta: '3 min',
      facilities: ['AC', 'WiFi'],
      occupancy: 'Medium'
    },
    {
      number: '156',
      route: 'Mehdipatnam → KPHB',
      eta: '7 min',
      facilities: ['AC'],
      occupancy: 'Low'
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Header with Greeting */}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 px-6 py-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-xl">👤</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Hello, Rakesh 👋</h1>
              <p className="text-blue-200">Where are you going today?</p>
            </div>
          </div>
          <div className="text-2xl">🚍</div>
        </div>

        {/* Search Bar */}
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-xl rounded-3xl p-5 shadow-xl border border-white/10 -mt-4 mx-2">
          <div className="flex items-center space-x-3">
            <div className="flex-1 space-y-3">
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-green-500 rounded-full"></div>
                <input
                  type="text"
                  placeholder="From (Current location)"
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border-0 rounded-2xl font-medium text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-400 focus:bg-white/20 transition-all"
                />
              </div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full"></div>
                <input
                  type="text"
                  placeholder="To (Destination)"
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border-0 rounded-2xl font-medium text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-400 focus:bg-white/20 transition-all"
                />
              </div>
            </div>
            <Button
              onClick={swapLocations}
              variant="ghost"
              size="icon"
              className="rounded-full h-10 w-10 bg-blue-50 hover:bg-blue-100 transition-all"
            >
              <ArrowUpDown className="w-5 h-5 text-blue-600" />
            </Button>
          </div>
          <Link to="/search">
            <Button className="w-full mt-5 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white rounded-2xl py-4 font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]">
              <Search className="w-5 h-5 mr-2" />
              Find Routes
            </Button>
          </Link>
        </div>
      </div>

      <div className="px-6 py-4 space-y-6">
        {/* Quick Access Cards */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Quick Access</h2>
          <div className="grid grid-cols-3 gap-4">
            {quickAccessCards.map((card, index) => (
              <Link key={index} to={card.link}>
                <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm p-5 rounded-3xl text-center shadow-lg border border-white/20 hover:shadow-xl hover:scale-105 hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">{card.emoji}</span>
                  </div>
                  <h3 className="font-bold text-sm text-white mb-1">{card.title}</h3>
                  <p className="text-xs text-blue-200">{card.subtitle}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Map Preview */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Live Map</h2>
            <Link to="/live">
              <Button variant="ghost" size="sm" className="text-white font-semibold">
                <Navigation className="w-4 h-4 mr-1" />
                Navigate
              </Button>
            </Link>
          </div>
          <Link to="/live">
            <div className="bg-gradient-to-br from-teal-500/20 to-blue-500/20 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20 hover:shadow-xl hover:from-teal-500/30 hover:to-blue-500/30 transition-all">
              <div className="h-32 bg-gradient-to-br from-blue-100 via-teal-50 to-green-100 rounded-2xl relative overflow-hidden">
                {/* Mini Map Background */}
                <div className="absolute inset-0">
                  <svg className="w-full h-full" viewBox="0 0 200 120">
                    {/* Roads */}
                    <path d="M20 60 L180 60" stroke="#e5e7eb" strokeWidth="3" />
                    <path d="M100 20 L100 100" stroke="#e5e7eb" strokeWidth="2" />
                    <path d="M60 30 L140 90" stroke="#e5e7eb" strokeWidth="2" />
                    
                    {/* Bus Icons */}
                    <circle cx="80" cy="60" r="4" fill="#0d9488" />
                    <circle cx="120" cy="60" r="4" fill="#3b82f6" />
                    <circle cx="100" cy="40" r="4" fill="#059669" />
                    
                    {/* Current Location */}
                    <circle cx="100" cy="60" r="6" fill="#ef4444" stroke="white" strokeWidth="2" />
                  </svg>
                </div>
                
                {/* Overlay Content */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-teal-500/5"></div>
                <div className="absolute bottom-2 left-2 right-2 text-center">
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2">
                    <p className="text-xs font-semibold text-blue-700">View Live Buses</p>
                    <p className="text-xs text-blue-600">3 buses nearby</p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Digital Ticket */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Active Ticket</h2>
          <TicketCard />
        </div>

        {/* Nearby Buses */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Nearby Buses</h2>
            <Link to="/live" className="text-white font-semibold">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {nearbyBuses.map((bus, index) => (
              <div key={index} className="bg-gradient-to-br from-white/80 to-blue-50/80 backdrop-blur-md rounded-3xl p-5 shadow-lg border border-white/30 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-4 py-2 rounded-2xl font-bold">
                        {bus.number}
                      </div>
                      <div className="flex items-center space-x-2">
                        {bus.facilities.includes('AC') && (
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                            <Snowflake className="w-3 h-3 text-blue-600" />
                          </div>
                        )}
                        {bus.facilities.includes('WiFi') && (
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                            <Wifi className="w-3 h-3 text-green-600" />
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="font-semibold text-blue-800 mb-2">{bus.route}</p>
                    <div className="flex items-center text-sm text-purple-600">
                      <Users className="w-4 h-4 mr-1" />
                      {bus.occupancy}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-blue-600 font-bold mb-3">
                      <Clock className="w-4 h-4 mr-1" />
                      {bus.eta}
                    </div>
                    <Link to="/live">
                      <Button size="sm" className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white rounded-2xl px-6 py-2 font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                        Track
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNavigation />
      
      {/* Bottom padding to account for fixed navigation */}
      <div className="h-20"></div>
    </div>
  );
};

export default Dashboard;