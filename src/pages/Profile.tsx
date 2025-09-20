import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  CreditCard, 
  Ticket, 
  Settings, 
  HelpCircle, 
  Bell, 
  Globe, 
  Moon, 
  Plus,
  Eye,
  Phone,
  X,
  Shield,
  UserPlus,
  Edit3,
  ArrowLeft,
  MapPin
} from 'lucide-react';
import '../styles/profile.css';
import { sosService } from '../services/sosService';

interface Ticket {
  id: string;
  route: string;
  date: string;
  amount: number;
  status: 'active' | 'completed';
}

interface EmergencyContact {
  name: string;
  phone: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [showSOSConfirm, setShowSOSConfirm] = useState(false);
  const [showSOSSuccess, setShowSOSSuccess] = useState(false);
  const [showContactPicker, setShowContactPicker] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [emergencyContact, setEmergencyContact] = useState<EmergencyContact | null>(null);
  const [isSOSLoading, setIsSOSLoading] = useState(false);
  
  const passengerName = 'Rajesh Kumar';
  const passengerPhone = '+91 98765 43210';

  // Mock contacts for demo
  const mockContacts = [
    { name: 'Mom', phone: '+91 98765 43210' },
    { name: 'Dad', phone: '+91 98765 43211' },
    { name: 'Spouse', phone: '+91 98765 43212' },
    { name: 'Brother', phone: '+91 98765 43213' }
  ];

  const tickets: Ticket[] = [
    { id: '001', route: '100K - Secunderabad to Koti', date: '2024-01-15', amount: 25, status: 'active' },
    { id: '002', route: '156 - Mehdipatnam to KPHB', date: '2024-01-14', amount: 30, status: 'completed' },
    { id: '003', route: '290U - LB Nagar to Gachibowli', date: '2024-01-13', amount: 35, status: 'completed' }
  ];

  const handleSOSFirst = () => {
    setShowSOSConfirm(true);
  };

  const handleSOSConfirm = async () => {
    if (!emergencyContact) return;
    
    setIsSOSLoading(true);
    try {
      await sosService.triggerSOS(emergencyContact, passengerName, passengerPhone);
      setShowSOSConfirm(false);
      setShowSOSSuccess(true);
      setTimeout(() => setShowSOSSuccess(false), 3000);
    } catch (error) {
      console.error('SOS failed:', error);
      alert('SOS failed. Please try again or call emergency services directly.');
    } finally {
      setIsSOSLoading(false);
    }
  };

  const handleSOSCancel = () => {
    setShowSOSConfirm(false);
  };

  const selectEmergencyContact = (contact: EmergencyContact) => {
    setEmergencyContact(contact);
    setShowContactPicker(false);
    // Save to localStorage
    localStorage.setItem('emergencyContact', JSON.stringify(contact));
  };
  
  // Load emergency contact on component mount
  useEffect(() => {
    const saved = localStorage.getItem('emergencyContact');
    if (saved) {
      setEmergencyContact(JSON.parse(saved));
    }
    // Request notification permission
    sosService.requestNotificationPermission();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-teal-600 text-white p-6 rounded-b-3xl">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-teal-700 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-teal-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Rajesh Kumar</h2>
            <p className="text-teal-100">rajesh.kumar@email.com</p>
            <p className="text-teal-100">+91 98765 43210</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* My Tickets */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <Ticket className="w-5 h-5 text-teal-600" />
            <h3 className="font-semibold text-gray-800">My Tickets</h3>
          </div>
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex-1">
                  <p className="font-medium text-sm">{ticket.route}</p>
                  <p className="text-xs text-gray-500">{ticket.date}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                    ticket.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {ticket.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{ticket.amount}</p>
                  <button className="text-teal-600 text-xs flex items-center">
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wallet & Payments */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <CreditCard className="w-5 h-5 text-teal-600" />
            <h3 className="font-semibold text-gray-800">Wallet & Payments</h3>
          </div>
          <div className="bg-teal-50 rounded-xl p-4 mb-3">
            <p className="text-sm text-gray-600">Current Balance</p>
            <p className="text-2xl font-bold text-teal-600">₹150.00</p>
          </div>
          <button className="w-full bg-teal-600 text-white py-3 rounded-xl flex items-center justify-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Money</span>
          </button>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <Settings className="w-5 h-5 text-teal-600" />
            <h3 className="font-semibold text-gray-800">Settings</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <Bell className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Notifications</span>
              </div>
              <div className="w-10 h-6 bg-teal-600 rounded-full relative">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
              </div>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <Globe className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Language</span>
              </div>
              <span className="text-sm text-gray-500">English</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <Moon className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Dark Mode</span>
              </div>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`w-10 h-6 rounded-full relative ${darkMode ? 'bg-teal-600' : 'bg-gray-300'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
                  darkMode ? 'right-1' : 'left-1'
                }`}></div>
              </button>
            </div>
          </div>
        </div>

        {/* Emergency SOS */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-4 shadow-sm border border-red-100">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-red-800">Emergency SOS</h3>
          </div>
          <div className="space-y-3">
            <div className="bg-white rounded-xl p-3">
              <p className="text-sm text-gray-600 mb-2">Emergency Contact</p>
              {emergencyContact ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{emergencyContact.name}</p>
                    <p className="text-sm text-gray-500">{emergencyContact.phone}</p>
                  </div>
                  <button 
                    onClick={() => setShowContactPicker(true)}
                    className="text-red-600 p-2"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowContactPicker(true)}
                  className="w-full bg-red-100 text-red-700 py-3 rounded-xl flex items-center justify-center space-x-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Select Emergency Contact</span>
                </button>
              )}
            </div>
            <div className="bg-white rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-2">SOS will automatically:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center space-x-1">
                  <Phone className="w-3 h-3 text-red-500" />
                  <span>Call 100 & 108</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-red-500" />
                  <span>Send GPS location</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Support & Feedback */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <HelpCircle className="w-5 h-5 text-teal-600" />
            <h3 className="font-semibold text-gray-800">Support & Feedback</h3>
          </div>
          <div className="space-y-3">
            <button className="w-full text-left py-2 text-sm text-gray-700">FAQ & Help Center</button>
            <button className="w-full text-left py-2 text-sm text-gray-700 flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              Contact Support
            </button>
            <button className="w-full text-left py-2 text-sm text-gray-700">Send Feedback</button>
          </div>
        </div>
      </div>

      {/* SOS Emergency Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <button
          onClick={handleSOSFirst}
          disabled={!emergencyContact}
          className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg ${
            emergencyContact 
              ? 'bg-red-600 text-white active:bg-red-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          🚨 SOS EMERGENCY
        </button>
        {!emergencyContact && (
          <p className="text-xs text-gray-500 text-center mt-2">
            Select emergency contact to enable SOS
          </p>
        )}
      </div>

      {/* Contact Picker Modal */}
      {showContactPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Select Emergency Contact</h3>
              <button onClick={() => setShowContactPicker(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {mockContacts.map((contact, index) => (
                <button
                  key={index}
                  onClick={() => selectEmergencyContact(contact)}
                  className="w-full text-left p-3 rounded-xl hover:bg-gray-50 border border-gray-200"
                >
                  <p className="font-medium text-gray-800">{contact.name}</p>
                  <p className="text-sm text-gray-500">{contact.phone}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SOS Confirmation Modal */}
      {showSOSConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚨</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Confirm SOS Alert</h3>
              <p className="text-sm text-gray-600 mb-2">
                This will immediately:
              </p>
              <ul className="text-xs text-gray-500 text-left space-y-1">
                <li>📞 Call Police (100) & Ambulance (108)</li>
                <li>📍 Send your live GPS location</li>
                <li>📱 Alert <strong>{emergencyContact?.name}</strong> via SMS</li>
                <li>🔔 Send push notification</li>
              </ul>
            </div>
            <div className="space-y-3">
              <button
                onClick={handleSOSConfirm}
                disabled={isSOSLoading}
                className={`w-full py-3 rounded-xl font-semibold ${
                  isSOSLoading 
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                    : 'bg-red-600 text-white active:bg-red-700'
                }`}
              >
                {isSOSLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>SENDING SOS...</span>
                  </div>
                ) : (
                  'SEND SOS ALERT'
                )}
              </button>
              <button
                onClick={handleSOSCancel}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold flex items-center justify-center"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SOS Success Modal */}
      {showSOSSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">SOS Alert Sent!</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>✓ Called Police (100) & Ambulance (108)</p>
                <p>✓ Sent location to <strong>{emergencyContact?.name}</strong></p>
                <p>✓ Emergency services notified</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;