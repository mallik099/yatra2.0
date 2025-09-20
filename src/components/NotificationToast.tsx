import React, { useState, useEffect } from 'react';
import { X, Clock, AlertTriangle, CheckCircle, MapPin } from 'lucide-react';
import { Card } from './ui/simple-card';
import { Button } from './ui/simple-button';

interface Notification {
  id: string;
  type: 'arrival' | 'delay' | 'reminder' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  busNumber?: string;
  eta?: string;
}

const NotificationToast: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Mock notifications for demo
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'arrival',
        title: 'Bus Arriving Soon',
        message: 'Bus 100K will arrive at Paradise Circle in 2 minutes',
        timestamp: new Date(),
        busNumber: '100K',
        eta: '2 min'
      }
    ];

    // Simulate receiving notifications
    const timer = setTimeout(() => {
      setNotifications(mockNotifications);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'arrival':
        return <MapPin className="w-5 h-5 text-teal-600" />;
      case 'delay':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'reminder':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'arrival':
        return 'border-l-teal-500 bg-teal-50';
      case 'delay':
        return 'border-l-amber-500 bg-amber-50';
      case 'reminder':
        return 'border-l-blue-500 bg-blue-50';
      case 'success':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <Card 
          key={notification.id} 
          className={`toast-notification border-l-4 ${getNotificationColor(notification.type)} shadow-lg animate-in slide-in-from-right duration-300`}
        >
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="mt-0.5">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-sm" style={{ color: '#1f2937' }}>
                      {notification.title}
                    </h4>
                    {notification.busNumber && (
                      <span className="bg-teal-600 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                        {notification.busNumber}
                      </span>
                    )}
                  </div>
                  <p className="text-sm mb-2" style={{ color: '#4b5563' }}>
                    {notification.message}
                  </p>
                  {notification.eta && (
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-teal-600" />
                      <span className="text-xs font-semibold" style={{ color: '#0d9488' }}>
                        ETA: {notification.eta}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeNotification(notification.id)}
                className="h-6 w-6 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default NotificationToast;