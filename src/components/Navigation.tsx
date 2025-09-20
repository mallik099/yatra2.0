import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MapPin, Search } from 'lucide-react';

const Navigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/live', icon: MapPin, label: 'Live' },
    { path: '/search', icon: Search, label: 'Search' }
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-6 py-3 shadow-2xl">
        <div className="flex items-center space-x-8">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`relative flex flex-col items-center py-2 px-4 rounded-2xl transition-all duration-300 group ${
                  isActive ? 'text-white' : 'text-gray-600 hover:text-white'
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg"></div>
                )}
                <div className="relative z-10 flex flex-col items-center">
                  <Icon className={`w-6 h-6 mb-1 transition-transform duration-300 ${
                    isActive ? 'scale-110' : 'group-hover:scale-110'
                  }`} />
                  <span className="text-xs font-medium">{label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;