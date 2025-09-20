import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Clock, Download } from 'lucide-react';
import { Button } from '../components/ui/simple-button';
import { Badge } from '../components/ui/simple-badge';
import BottomNavigation from '../components/BottomNavigation';

const MyTickets: React.FC = () => {
  const allTickets = [
    {
      id: 'TKT001',
      route: '100K - Secunderabad → Koti',
      date: '2024-01-15',
      time: '09:30 AM',
      fare: '₹25',
      status: 'Completed',
      busNumber: '100K',
      from: 'Secunderabad Railway Station',
      to: 'Koti Bus Station'
    },
    {
      id: 'TKT002',
      route: '156 - Mehdipatnam → KPHB',
      date: '2024-01-14',
      time: '02:15 PM',
      fare: '₹30',
      status: 'Completed',
      busNumber: '156',
      from: 'Mehdipatnam',
      to: 'KPHB Colony'
    },
    {
      id: 'TKT003',
      route: '290U - LB Nagar → Gachibowli',
      date: '2024-01-13',
      time: '06:45 PM',
      fare: '₹35',
      status: 'Completed',
      busNumber: '290U',
      from: 'LB Nagar',
      to: 'Gachibowli IT Hub'
    },
    {
      id: 'TKT004',
      route: '218 - Ameerpet → Uppal',
      date: '2024-01-12',
      time: '11:20 AM',
      fare: '₹28',
      status: 'Cancelled',
      busNumber: '218',
      from: 'Ameerpet Metro',
      to: 'Uppal X Roads'
    },
    {
      id: 'TKT005',
      route: '100K - Koti → Secunderabad',
      date: '2024-01-11',
      time: '07:00 PM',
      fare: '₹25',
      status: 'Completed',
      busNumber: '100K',
      from: 'Koti Bus Station',
      to: 'Secunderabad Railway Station'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      case 'Active': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <Link to="/profile">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">My Tickets</h1>
            <p className="text-sm text-gray-600">{allTickets.length} tickets found</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-4">
        {/* Tickets List */}
        <div className="space-y-4">
          {allTickets.map((ticket) => (
            <div key={ticket.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="bg-teal-600 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                      {ticket.busNumber}
                    </div>
                    <Badge variant="secondary" className={`text-xs ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{ticket.route}</h3>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-3 h-3 mr-1" />
                      {ticket.date} at {ticket.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-3 h-3 mr-1" />
                      {ticket.from} → {ticket.to}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-teal-600 mb-2">{ticket.fare}</p>
                  <Button size="sm" variant="outline" className="text-xs">
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
              
              <div className="border-t pt-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">Ticket ID: {ticket.id}</p>
                  <div className="flex space-x-2">
                    {ticket.status === 'Completed' && (
                      <Button size="sm" variant="ghost" className="text-teal-600 text-xs">
                        Book Again
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" className="text-gray-600 text-xs">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
      
      {/* Bottom padding */}
      <div className="h-20"></div>
    </div>
  );
};

export default MyTickets;