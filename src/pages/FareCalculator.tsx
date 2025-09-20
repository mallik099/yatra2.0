import React, { useState, useEffect } from 'react';
import { Calculator, MapPin, CreditCard, Smartphone, Wallet } from 'lucide-react';

interface FareData {
  distance: number;
  baseFare: number;
  totalFare: number;
  estimatedTime: string;
}

const FareCalculator: React.FC = () => {
  const [fromStop, setFromStop] = useState('');
  const [toStop, setToStop] = useState('');
  const [fareData, setFareData] = useState<FareData | null>(null);
  const [selectedPayment, setSelectedPayment] = useState('upi');

  const stops = [
    'Secunderabad', 'Koti', 'Mehdipatnam', 'KPHB', 'LB Nagar', 
    'Gachibowli', 'Ameerpet', 'Uppal', 'Dilsukhnagar', 'Kukatpally'
  ];

  const calculateFare = () => {
    if (!fromStop || !toStop || fromStop === toStop) return;

    // Mock calculation based on distance
    const distance = Math.random() * 20 + 5; // 5-25 km
    const baseFare = 15;
    const perKmRate = 1.5;
    const totalFare = Math.round(baseFare + (distance * perKmRate));
    const estimatedTime = Math.round(distance * 2.5) + ' mins';

    setFareData({
      distance: Math.round(distance * 10) / 10,
      baseFare,
      totalFare,
      estimatedTime
    });
  };

  useEffect(() => {
    if (fromStop && toStop) {
      calculateFare();
    }
  }, [fromStop, toStop]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-4">
        <div className="flex items-center space-x-3 mb-6">
          <Calculator className="w-6 h-6 text-teal-600" />
          <h2 className="text-xl font-bold text-gray-800">Fare Calculator</h2>
        </div>

        {/* Route Selection */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
            <select
              value={fromStop}
              onChange={(e) => setFromStop(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="">Select starting point</option>
              {stops.map((stop) => (
                <option key={stop} value={stop}>{stop}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
            <select
              value={toStop}
              onChange={(e) => setToStop(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="">Select destination</option>
              {stops.map((stop) => (
                <option key={stop} value={stop}>{stop}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Fare Breakdown */}
        {fareData && (
          <div className="bg-teal-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-teal-800 mb-3">Fare Breakdown</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Distance</span>
                <span className="font-medium">{fareData.distance} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Base Fare</span>
                <span className="font-medium">₹{fareData.baseFare}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Distance Charge</span>
                <span className="font-medium">₹{fareData.totalFare - fareData.baseFare}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Time</span>
                <span className="font-medium">{fareData.estimatedTime}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between text-lg font-bold text-teal-600">
                <span>Total Fare</span>
                <span>₹{fareData.totalFare}</span>
              </div>
            </div>
          </div>
        )}

        {/* Payment Options */}
        {fareData && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Payment Method</h3>
            <div className="space-y-2">
              {[
                { id: 'upi', label: 'UPI Payment', icon: Smartphone },
                { id: 'wallet', label: 'Yatra Wallet', icon: Wallet },
                { id: 'card', label: 'Credit/Debit Card', icon: CreditCard }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setSelectedPayment(id)}
                  className={`w-full p-3 rounded-xl border-2 flex items-center space-x-3 ${
                    selectedPayment === id
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <Icon className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </div>

            <button className="w-full bg-teal-600 text-white py-4 rounded-xl font-semibold text-lg">
              Book Ticket - ₹{fareData.totalFare}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FareCalculator;