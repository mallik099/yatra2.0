import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { realTimeGovApi } from '../services/realTimeGovApi';

const ApiTester: React.FC = () => {
  const [apiStatus, setApiStatus] = useState({
    tsrtc: false,
    traffic: false,
    digitalIndia: false,
    lastChecked: new Date()
  });
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);

  const testAllApis = async () => {
    setTesting(true);
    setTestResults([]);
    
    try {
      // Test API health
      const health = await realTimeGovApi.checkApiHealth();
      setApiStatus({ ...health, lastChecked: new Date() });
      
      const results = [];
      
      // Test TSRTC Live Buses
      try {
        const buses = await realTimeGovApi.getLiveBuses();
        results.push({
          api: 'TSRTC Live Buses',
          status: 'success',
          data: `${buses.length} buses loaded`,
          url: 'https://api.tsrtc.gov.in/v1/buses/live'
        });
      } catch (error) {
        results.push({
          api: 'TSRTC Live Buses',
          status: 'error',
          data: error.message,
          url: 'https://api.tsrtc.gov.in/v1/buses/live'
        });
      }
      
      // Test Bus Details
      try {
        const busDetails = await realTimeGovApi.getBusDetails('TS07U1001');
        results.push({
          api: 'Bus Details',
          status: busDetails ? 'success' : 'warning',
          data: busDetails ? 'Bus details loaded' : 'No data found',
          url: 'https://api.tsrtc.gov.in/v1/buses/{vehicleId}'
        });
      } catch (error) {
        results.push({
          api: 'Bus Details',
          status: 'error',
          data: error.message,
          url: 'https://api.tsrtc.gov.in/v1/buses/{vehicleId}'
        });
      }
      
      // Test Nearby Buses
      try {
        const nearbyBuses = await realTimeGovApi.getNearbyBuses(17.385, 78.486);
        results.push({
          api: 'Nearby Buses',
          status: 'success',
          data: `${nearbyBuses.length} nearby buses found`,
          url: 'https://api.tsrtc.gov.in/v1/buses/nearby'
        });
      } catch (error) {
        results.push({
          api: 'Nearby Buses',
          status: 'error',
          data: error.message,
          url: 'https://api.tsrtc.gov.in/v1/buses/nearby'
        });
      }
      
      // Test Traffic Data
      try {
        const trafficData = await realTimeGovApi.getTrafficData('100K');
        results.push({
          api: 'Traffic Data',
          status: trafficData ? 'success' : 'warning',
          data: trafficData ? 'Traffic data loaded' : 'No traffic data',
          url: 'https://api.traffic.gov.in/v1/routes/{routeId}/traffic'
        });
      } catch (error) {
        results.push({
          api: 'Traffic Data',
          status: 'error',
          data: error.message,
          url: 'https://api.traffic.gov.in/v1/routes/{routeId}/traffic'
        });
      }
      
      // Test UPI Payment
      try {
        const payment = await realTimeGovApi.initiateUPIPayment(25, '100K', 'test_user');
        results.push({
          api: 'UPI Payment',
          status: payment.success ? 'success' : 'warning',
          data: payment.transactionId ? `Transaction: ${payment.transactionId}` : 'Payment failed',
          url: 'https://api.digitalindia.gov.in/v1/payments/upi/initiate'
        });
      } catch (error) {
        results.push({
          api: 'UPI Payment',
          status: 'error',
          data: error.message,
          url: 'https://api.digitalindia.gov.in/v1/payments/upi/initiate'
        });
      }
      
      setTestResults(results);
    } catch (error) {
      console.error('API testing failed:', error);
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    testAllApis();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'error': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Shield className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-bold text-gray-800">Government API Status</h3>
            <p className="text-sm text-gray-600">Real-time connectivity testing</p>
          </div>
        </div>
        <button
          onClick={testAllApis}
          disabled={testing}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${testing ? 'animate-spin' : ''}`} />
          <span>{testing ? 'Testing...' : 'Test APIs'}</span>
        </button>
      </div>

      {/* API Status Overview */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className={`p-3 rounded-lg border ${apiStatus.tsrtc ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center space-x-2">
            {apiStatus.tsrtc ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
            <span className="text-sm font-semibold">TSRTC</span>
          </div>
        </div>
        <div className={`p-3 rounded-lg border ${apiStatus.traffic ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center space-x-2">
            {apiStatus.traffic ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
            <span className="text-sm font-semibold">Traffic</span>
          </div>
        </div>
        <div className={`p-3 rounded-lg border ${apiStatus.digitalIndia ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center space-x-2">
            {apiStatus.digitalIndia ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
            <span className="text-sm font-semibold">Digital India</span>
          </div>
        </div>
      </div>

      {/* Detailed Test Results */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-700">API Test Results</h4>
        {testResults.map((result, index) => (
          <div key={index} className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                {getStatusIcon(result.status)}
                <div>
                  <h5 className="font-semibold text-gray-800">{result.api}</h5>
                  <p className="text-sm text-gray-600">{result.data}</p>
                  <p className="text-xs text-gray-500 mt-1">{result.url}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-xs text-gray-500">
        Last checked: {apiStatus.lastChecked.toLocaleTimeString()}
      </div>
    </div>
  );
};

export default ApiTester;