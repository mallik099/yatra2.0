import React, { useState, useEffect } from 'react';
import { Bell, X, Clock, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface Notification {
  id: string;
  type: 'arrival' | 'delay' | 'update' | 'booking' | 'alert';
  priority: 'critical' | 'high' | 'normal' | 'low';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  busNumber?: string;
  eta?: number;
  routeName?: string;
  stopName?: string;
}

const NotificationSystem: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showPanel, setShowPanel] = useState(false);
  const [filter, setFilter] = useState<'all' | 'arrivals' | 'critical' | 'unread'>('all');

  useEffect(() => {
    // Mock notifications
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'arrival',
        priority: 'high',
        title: 'Bus Arriving Soon',
        message: 'Arriving at Paradise Circle',
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        read: false,
        busNumber: '100K',
        eta: 2,
        stopName: 'Paradise Circle'
      },
      {
        id: '2',
        type: 'delay',
        priority: 'critical',
        title: 'Route Delayed',
        message: 'Heavy traffic on Begumpet route',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        read: false,
        busNumber: '156',
        routeName: 'Mehdipatnam ↔ KPHB'
      },
      {
        id: '3',
        type: 'booking',
        priority: 'normal',
        title: 'Ticket Confirmed',
        message: 'Secunderabad to Koti journey',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: true,
        busNumber: '100K'
      },
      {
        id: '4',
        type: 'arrival',
        priority: 'critical',
        title: 'Bus Arriving Now',
        message: 'Boarding at Ameerpet Metro',
        timestamp: new Date(Date.now() - 30 * 1000),
        read: false,
        busNumber: '218',
        eta: 0,
        stopName: 'Ameerpet Metro'
      }
    ];

    setNotifications(mockNotifications);

    // Simulate real-time notifications
    const interval = setInterval(() => {
      const busNum = `${Math.floor(Math.random() * 300) + 100}K`;
      const eta = Math.floor(Math.random() * 10) + 1;
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: 'update',
        priority: eta <= 3 ? 'high' : 'normal',
        title: eta <= 3 ? 'Bus Arriving Soon' : 'Bus Update',
        message: `Now ${eta} minutes away`,
        timestamp: new Date(),
        read: false,
        busNumber: busNum,
        eta,
        stopName: 'Your Stop'
      };

      setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getIcon = (notification: Notification) => {
    const iconClass = `w-5 h-5 ${notification.priority === 'critical' ? 'animate-pulse' : ''}`;
    switch (notification.type) {
      case 'arrival': return <span className="text-2xl">🚍</span>;
      case 'delay': return <AlertTriangle className={`${iconClass} text-red-600`} />;
      case 'booking': return <CheckCircle className={`${iconClass} text-green-600`} />;
      case 'alert': return <AlertTriangle className={`${iconClass} text-red-600`} />;
      default: return <Info className={`${iconClass} text-blue-600`} />;
    }
  };

  const getNotificationStyle = (notification: Notification) => {
    const baseStyle = 'border-l-4';
    if (notification.priority === 'critical') {
      return `${baseStyle} border-l-red-500 bg-red-50 shadow-md`;
    }
    if (notification.priority === 'high') {
      return `${baseStyle} border-l-orange-500 bg-orange-50`;
    }
    switch (notification.type) {
      case 'arrival': return `${baseStyle} border-l-green-500 bg-green-50`;
      case 'delay': return `${baseStyle} border-l-red-500 bg-red-50`;
      case 'booking': return `${baseStyle} border-l-blue-500 bg-blue-50`;
      default: return `${baseStyle} border-l-gray-500 bg-gray-50`;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const filteredNotifications = notifications.filter(n => {
    switch (filter) {
      case 'arrivals': return n.type === 'arrival';
      case 'critical': return n.priority === 'critical' || n.priority === 'high';
      case 'unread': return !n.read;
      default: return true;
    }
  }).sort((a, b) => {
    if (a.priority === 'critical' && b.priority !== 'critical') return -1;
    if (b.priority === 'critical' && a.priority !== 'critical') return 1;
    if (a.priority === 'high' && b.priority === 'normal') return -1;
    if (b.priority === 'high' && a.priority === 'normal') return 1;
    return b.timestamp.getTime() - a.timestamp.getTime();
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const criticalCount = notifications.filter(n => (n.priority === 'critical' || n.priority === 'high') && !n.read).length;

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const getEtaDisplay = (eta?: number) => {
    if (eta === undefined) return null;
    if (eta === 0) return <span className="text-red-600 font-bold animate-pulse">ARRIVING NOW</span>;
    if (eta <= 2) return <span className="text-orange-600 font-semibold">{eta} min away</span>;
    return <span className="text-blue-600">{eta} min away</span>;
  };

  return (
    <>
      {/* Notification Bell */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="fixed top-4 right-4 z-40 bg-teal-600 text-white p-3 rounded-full shadow-lg"
      >
        <Bell className="w-5 h-5" />
        {criticalCount > 0 ? (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {criticalCount > 9 ? '9+' : criticalCount}
          </span>
        ) : unreadCount > 0 ? (
          <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        ) : null}
      </button>

      {/* Notification Panel */}
      {showPanel && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="toast-notification absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold" style={{ color: '#1f2937' }}>Notifications</h2>
                <button
                  onClick={() => setShowPanel(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                  style={{ color: '#6b7280' }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {(['all', 'arrivals', 'critical', 'unread'] as const).map((filterType) => (
                  <button
                    key={filterType}
                    onClick={() => setFilter(filterType)}
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                      filter === filterType 
                        ? 'bg-teal-600 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {filterType === 'all' ? 'All' : 
                     filterType === 'arrivals' ? 'Arrivals' :
                     filterType === 'critical' ? 'Important' : 'Unread'}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-y-auto h-full pb-20">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p style={{ color: '#6b7280' }}>No notifications yet</p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => markAsRead(notification.id)}
                      className={`toast-notification p-4 rounded-xl border cursor-pointer transition-all ${
                        notification.read ? 'bg-gray-50 border-gray-200' : getNotificationStyle(notification)
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {getIcon(notification)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`text-sm font-semibold ${
                              notification.read ? 'text-gray-600' : 'text-gray-800'
                            }`} style={{ color: notification.read ? '#6b7280' : '#1f2937' }}>
                              {notification.title}
                            </h3>
                            {notification.busNumber && (
                              <span className="bg-teal-600 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                                {notification.busNumber}
                              </span>
                            )}
                            {!notification.read && (
                              <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                            )}
                          </div>
                          {notification.stopName && (
                            <p className="text-xs font-medium mb-1" style={{ color: '#6b7280' }}>
                              📍 {notification.stopName}
                            </p>
                          )}
                          <p className={`text-sm mt-1 ${
                            notification.read ? 'text-gray-500' : 'text-gray-700'
                          }`} style={{ color: notification.read ? '#9ca3af' : '#4b5563' }}>
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center text-xs" style={{ color: '#9ca3af' }}>
                              <Clock className="w-3 h-3 mr-1" />
                              {formatTime(notification.timestamp)}
                            </div>
                            {notification.eta !== undefined && (
                              <div className="text-xs font-semibold">
                                {getEtaDisplay(notification.eta)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Push Notification Toast */}
      {notifications.length > 0 && !notifications[0].read && (
        <div className="toast-notification fixed top-20 right-4 z-30 bg-white rounded-xl shadow-lg border p-4 max-w-sm animate-slide-in">
          <div className="flex items-start space-x-3">
            {getIcon(notifications[0])}
            <div className="flex-1">
              <h4 className="font-medium" style={{ color: '#1f2937' }}>{notifications[0].title}</h4>
              <p className="text-sm mt-1" style={{ color: '#4b5563' }}>{notifications[0].message}</p>
            </div>
            <button
              onClick={() => markAsRead(notifications[0].id)}
              className="hover:text-gray-600"
              style={{ color: '#9ca3af' }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationSystem;