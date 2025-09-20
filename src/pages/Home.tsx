import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Search, Clock, Navigation, Moon, Sun } from 'lucide-react';

const Home: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode 
        ? 'min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50'
    }>
      {/* Dark Mode Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={darkMode 
              ? 'p-3 rounded-full backdrop-blur-md border bg-white/10 border-white/20 text-white hover:bg-white/20' 
              : 'p-3 rounded-full backdrop-blur-md border bg-white/80 border-white/40 text-gray-700 hover:bg-white/90'
          }
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="text-6xl mr-4">🚍</div>
            <h1 className={`text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
              Yatra
            </h1>
          </div>
          <p className={`text-xl mb-3 font-medium ${
            darkMode ? 'text-blue-200' : 'text-blue-800'
          }`}>
            Telangana Public Transport Tracker
          </p>
          <p className={`text-lg ${
            darkMode ? 'text-purple-200' : 'text-purple-700'
          }`}>
            Real-time bus tracking for TSRTC services
          </p>
        </div>

        {/* Main Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          <Link 
            to="/dashboard" 
            className={`group relative overflow-hidden rounded-3xl p-8 backdrop-blur-md border ${
              darkMode 
                ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20' 
                : 'bg-white/60 border-white/40 hover:bg-white/80 hover:border-white/60'
            }`}>

            <div className="relative flex items-center space-x-6">
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-4 rounded-2xl shadow-lg">
                <Navigation className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className={`text-2xl font-bold mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-800'
                }`}>Passenger App</h3>
                <p className={`text-lg ${
                  darkMode ? 'text-teal-200' : 'text-teal-700'
                }`}>Modern passenger experience</p>
              </div>
            </div>
          </Link>

          <Link 
            to="/live" 
            className={`group relative overflow-hidden rounded-3xl p-8 backdrop-blur-md border ${
              darkMode 
                ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20' 
                : 'bg-white/60 border-white/40 hover:bg-white/80 hover:border-white/60'
            }`}>

            <div className="relative flex items-center space-x-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl shadow-lg">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className={`text-2xl font-bold mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-800'
                }`}>Live Tracking</h3>
                <p className={`text-lg ${
                  darkMode ? 'text-blue-200' : 'text-blue-700'
                }`}>Track buses in real-time</p>
              </div>
            </div>
          </Link>

          <Link 
            to="/search" 
            className={`group relative overflow-hidden rounded-3xl p-8 backdrop-blur-md border ${
              darkMode 
                ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20' 
                : 'bg-white/60 border-white/40 hover:bg-white/80 hover:border-white/60'
            }`}>

            <div className="relative flex items-center space-x-6">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-2xl shadow-lg">
                <Search className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className={`text-2xl font-bold mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-800'
                }`}>Route Search</h3>
                <p className={`text-lg ${
                  darkMode ? 'text-purple-200' : 'text-purple-700'
                }`}>Find buses between stops</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <h2 className={`text-4xl font-bold text-center mb-12 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>Features</h2>
          <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {[
              { icon: Clock, title: 'Real-time ETAs', desc: 'Get accurate arrival times', color: 'from-blue-500 to-cyan-500' },
              { icon: MapPin, title: 'Live Location', desc: 'See exact bus positions on the map', color: 'from-green-500 to-emerald-500' },
              { icon: Navigation, title: 'Route Planning', desc: 'Find the best routes for your journey', color: 'from-purple-500 to-pink-500' },
              { icon: Search, title: 'Smart Search', desc: 'Intelligent route suggestions', color: 'from-teal-500 to-blue-500' }
            ].map((feature, index) => (
              <div key={index} className={`group rounded-3xl p-8 backdrop-blur-md border ${
                darkMode 
                  ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                  : 'bg-white/60 border-white/40 hover:bg-white/80'
              }`}>
                <div className={`bg-gradient-to-br ${feature.color} p-4 rounded-2xl w-fit mx-auto mb-6 shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-xl font-bold mb-3 text-center ${
                  darkMode ? 'text-white' : 'text-gray-800'
                }`}>{feature.title}</h3>
                <p className={`text-center ${
                  darkMode ? 'text-blue-200' : 'text-blue-700'
                }`}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className={`rounded-3xl p-12 backdrop-blur-md border relative overflow-hidden ${
          darkMode 
            ? 'bg-white/5 border-white/10' 
            : 'bg-white/60 border-white/40'
        }`}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
          <div className="relative grid md:grid-cols-3 gap-12 text-center">
            {[
              { number: '500+', label: 'Active Buses', color: 'from-blue-500 to-cyan-500' },
              { number: '50+', label: 'Routes Covered', color: 'from-green-500 to-emerald-500' },
              { number: '24/7', label: 'Live Tracking', color: 'from-purple-500 to-pink-500' }
            ].map((stat, index) => (
              <div key={index} className="group">
                <div className={`text-5xl font-bold mb-4 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.number}
                </div>
                <p className={`text-xl font-medium ${
                  darkMode ? 'text-blue-200' : 'text-blue-800'
                }`}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;