import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  MapPin, 
  Clock, 
  Star,
  ArrowRight,
  Bookmark,
  Navigation
} from 'lucide-react';
import { Button } from '../components/ui/simple-button';
import BottomNavigation from '../components/BottomNavigation';

const Saved: React.FC = () => {
  const savedRoutes = [
    {
      id: '1',
      name: '100K - Secunderabad → Koti',
      frequency: 'Daily commute',
      lastUsed: '2 hours ago',
      isFavorite: true
    },
    {
      id: '2', 
      name: '156 - Mehdipatnam → KPHB',
      frequency: 'Weekly',
      lastUsed: '3 days ago',
      isFavorite: true
    },
    {
      id: '3',
      name: '290U - LB Nagar → Gachibowli', 
      frequency: 'Occasional',
      lastUsed: '1 week ago',
      isFavorite: false
    }
  ];

  const savedPlaces = [
    {
      id: '1',
      name: 'Home',
      address: 'Secunderabad Railway Station',
      type: 'home',
      icon: '🏠'
    },
    {
      id: '2',
      name: 'Office',
      address: 'Gachibowli IT Hub',
      type: 'work',
      icon: '🏢'
    },
    {
      id: '3',
      name: 'Shopping Mall',
      address: 'Forum Sujana Mall, Kukatpally',
      type: 'shopping',
      icon: '🛍️'
    }
  ];

  const frequentPlaces = [
    {
      id: '1',
      name: 'Ameerpet Metro Station',
      visits: 45,
      lastVisit: 'Today'
    },
    {
      id: '2', 
      name: 'Begumpet Airport',
      visits: 12,
      lastVisit: '3 days ago'
    },
    {
      id: '3',
      name: 'Hitech City',
      visits: 28,
      lastVisit: 'Yesterday'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Saved</h1>
            <p className="text-sm text-gray-600">Your favorite routes and places</p>
          </div>
          <Heart className="w-6 h-6 text-red-500" />
        </div>
      </div>

      <div className="px-6 py-4 space-y-6">
        {/* Saved Routes */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Saved Routes</h2>
            <Button variant="ghost" size="sm" className="text-teal-600 text-sm">
              Edit
            </Button>
          </div>
          <div className="space-y-3">
            {savedRoutes.map((route) => (
              <div key={route.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-sm text-gray-900">{route.name}</h3>
                      {route.isFavorite && (
                        <Heart className="w-3 h-3 text-red-500 fill-current" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{route.frequency}</p>
                    <p className="text-xs text-gray-500">Last used: {route.lastUsed}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Saved Places */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Saved Places</h2>
            <Button variant="ghost" size="sm" className="text-teal-600 text-sm">
              <MapPin className="w-3 h-3 mr-1" />
              Add
            </Button>
          </div>
          <div className="space-y-3">
            {savedPlaces.map((place) => (
              <div key={place.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="text-xl">{place.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm text-gray-900">{place.name}</h3>
                    <p className="text-xs text-gray-600">{place.address}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-teal-600">
                    <Navigation className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Frequently Visited */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Frequently Visited</h2>
            <Button variant="ghost" size="sm" className="text-teal-600 text-sm">
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {frequentPlaces.map((place) => (
              <div key={place.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-gray-900">{place.name}</h3>
                      <p className="text-xs text-gray-600">{place.visits} visits • {place.lastVisit}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="text-gray-400">
                      <Bookmark className="w-3 h-3" />
                    </Button>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="py-3 rounded-lg border-teal-200 text-teal-700 hover:bg-teal-50 text-sm">
            <Star className="w-3 h-3 mr-1" />
            Add Favorite
          </Button>
          <Button variant="outline" className="py-3 rounded-lg border-blue-200 text-blue-700 hover:bg-blue-50 text-sm">
            <MapPin className="w-3 h-3 mr-1" />
            Add Place
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
      
      {/* Bottom padding */}
      <div className="h-20"></div>
    </div>
  );
};

export default Saved;