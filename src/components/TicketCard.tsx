import React from 'react';
import { Download, Smartphone } from 'lucide-react';
import { Card } from './ui/simple-card';
import { Button } from './ui/simple-button';

const TicketCard: React.FC = () => {
  return (
    <div className="bg-gray-800 rounded-3xl shadow-lg border border-gray-700 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-white">Digital Ticket</h3>
            <p className="text-sm text-gray-300">100K - Secunderabad → Koti</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">₹25</p>
            <p className="text-xs text-gray-400">Valid Today</p>
          </div>
        </div>

        {/* QR Code */}
        <div className="flex justify-center mb-4">
          <div className="w-28 h-28 bg-white border-2 border-gray-100 rounded-2xl flex items-center justify-center shadow-inner">
            <svg width="80" height="80" viewBox="0 0 120 120">
              <rect width="120" height="120" fill="white"/>
              <g fill="black">
                <rect x="0" y="0" width="8" height="8"/>
                <rect x="16" y="0" width="8" height="8"/>
                <rect x="32" y="0" width="8" height="8"/>
                <rect x="56" y="0" width="8" height="8"/>
                <rect x="80" y="0" width="8" height="8"/>
                <rect x="96" y="0" width="8" height="8"/>
                <rect x="112" y="0" width="8" height="8"/>
                <rect x="0" y="16" width="8" height="8"/>
                <rect x="48" y="16" width="8" height="8"/>
                <rect x="64" y="16" width="8" height="8"/>
                <rect x="112" y="16" width="8" height="8"/>
                <rect x="0" y="32" width="8" height="8"/>
                <rect x="16" y="32" width="8" height="8"/>
                <rect x="32" y="32" width="8" height="8"/>
                <rect x="80" y="32" width="8" height="8"/>
                <rect x="96" y="32" width="8" height="8"/>
                <rect x="112" y="32" width="8" height="8"/>
                <rect x="64" y="48" width="8" height="8"/>
                <rect x="80" y="48" width="8" height="8"/>
                <rect x="0" y="64" width="8" height="8"/>
                <rect x="32" y="64" width="8" height="8"/>
                <rect x="48" y="64" width="8" height="8"/>
                <rect x="96" y="64" width="8" height="8"/>
                <rect x="112" y="64" width="8" height="8"/>
                <rect x="0" y="80" width="8" height="8"/>
                <rect x="16" y="80" width="8" height="8"/>
                <rect x="64" y="80" width="8" height="8"/>
                <rect x="96" y="80" width="8" height="8"/>
                <rect x="0" y="96" width="8" height="8"/>
                <rect x="48" y="96" width="8" height="8"/>
                <rect x="80" y="96" width="8" height="8"/>
                <rect x="112" y="96" width="8" height="8"/>
                <rect x="16" y="112" width="8" height="8"/>
                <rect x="32" y="112" width="8" height="8"/>
                <rect x="64" y="112" width="8" height="8"/>
                <rect x="96" y="112" width="8" height="8"/>
              </g>
            </svg>
          </div>
        </div>

        <div className="text-center mb-4">
          <p className="text-sm font-semibold text-white">Scan QR at bus entry</p>
          <p className="text-xs text-gray-400">ID: YTR240115001</p>
        </div>

        {/* Download App Section */}
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-teal-100 rounded-2xl flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-bold text-white">Get Yatra App</p>
                <p className="text-xs text-gray-300">Better mobile experience</p>
              </div>
            </div>
            <Button size="sm" className="bg-white hover:bg-gray-100 text-black rounded-2xl px-4 py-2 font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;