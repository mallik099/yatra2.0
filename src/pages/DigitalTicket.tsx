import React, { useState, useEffect } from 'react';
import { QrCode, Download, Clock, MapPin, User } from 'lucide-react';

interface Ticket {
  id: string;
  route: string;
  from: string;
  to: string;
  fare: number;
  date: string;
  time: string;
  qrCode: string;
  status: 'active' | 'used' | 'expired';
}

const DigitalTicket: React.FC = () => {
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [recentTickets, setRecentTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    // Mock ticket data
    const mockTicket: Ticket = {
      id: 'TKT001',
      route: '100K - Secunderabad to Koti',
      from: 'Secunderabad',
      to: 'Koti',
      fare: 25,
      date: '2024-01-15',
      time: '14:30',
      qrCode: 'YATRA_TKT001_20240115_1430',
      status: 'active'
    };

    const mockRecent: Ticket[] = [
      { id: 'TKT002', route: '156 - Mehdipatnam to KPHB', from: 'Mehdipatnam', to: 'KPHB', fare: 30, date: '2024-01-14', time: '09:15', qrCode: 'YATRA_TKT002', status: 'used' },
      { id: 'TKT003', route: '290U - LB Nagar to Gachibowli', from: 'LB Nagar', to: 'Gachibowli', fare: 35, date: '2024-01-13', time: '18:45', qrCode: 'YATRA_TKT003', status: 'used' }
    ];

    setActiveTicket(mockTicket);
    setRecentTickets(mockRecent);
  }, []);

  const generateQRCode = (data: string) => {
    // Simple QR code representation
    return (
      <div className="w-32 h-32 bg-black mx-auto flex items-center justify-center">
        <div className="grid grid-cols-8 gap-px">
          {Array.from({ length: 64 }, (_, i) => (
            <div
              key={i}
              className={`w-1 h-1 ${Math.random() > 0.5 ? 'bg-white' : 'bg-black'}`}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Active Ticket */}
      {activeTicket && (
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6 border-l-4 border-teal-600">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Active Ticket</h2>
            <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
              {activeTicket.status.toUpperCase()}
            </span>
          </div>

          <div className="text-center mb-6">
            {generateQRCode(activeTicket.qrCode)}
            <p className="text-xs text-gray-500 mt-2">Scan to validate</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Route</span>
              <span className="font-medium">{activeTicket.route}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">From</span>
              <span className="font-medium">{activeTicket.from}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">To</span>
              <span className="font-medium">{activeTicket.to}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Fare</span>
              <span className="font-bold text-teal-600">₹{activeTicket.fare}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Date & Time</span>
              <span className="font-medium">{activeTicket.date} {activeTicket.time}</span>
            </div>
          </div>

          <button className="w-full mt-4 bg-teal-600 text-white py-3 rounded-xl flex items-center justify-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Download Ticket</span>
          </button>
        </div>
      )}

      {/* Recent Tickets */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">Recent Tickets</h3>
        <div className="space-y-3">
          {recentTickets.map((ticket) => (
            <div key={ticket.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <QrCode className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-sm">{ticket.from} → {ticket.to}</p>
                  <p className="text-xs text-gray-500">{ticket.date} {ticket.time}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">₹{ticket.fare}</p>
                <span className="text-xs text-gray-500">{ticket.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DigitalTicket;