import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, MapPin, User, Heart } from 'lucide-react';

const BottomNavigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    {
      icon: Home,
      label: 'Home',
      path: '/home',
      activeColor: 'text-teal-600'
    },
    {
      icon: MapPin,
      label: 'Live',
      path: '/live',
      activeColor: 'text-green-600'
    },
    {
      icon: Search,
      label: 'Search',
      path: '/search',
      activeColor: 'text-blue-600'
    },
    {
      icon: Heart,
      label: 'Saved',
      path: '/saved',
      activeColor: 'text-red-600'
    },
    {
      icon: User,
      label: 'Profile',
      path: '/profile',
      activeColor: 'text-purple-600'
    }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-gray-900/95 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-700 z-50">
      <div className="grid grid-cols-5 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-3 px-2 rounded-2xl transition-all duration-300 ${
                active 
                  ? `text-white bg-gray-700 shadow-lg scale-105` 
                  : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
              }`}
            >
              <div className={`${active ? 'bg-teal-600 p-2 rounded-xl shadow-lg' : ''}`}>
                <Icon className={`w-5 h-5 ${active ? 'text-white' : ''} transition-all duration-200`} />
              </div>
              <span className={`text-xs font-medium mt-1 ${active ? 'font-bold' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;