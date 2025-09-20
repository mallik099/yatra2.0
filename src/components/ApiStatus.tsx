import React from 'react';
import { Wifi, WifiOff, Database } from 'lucide-react';

interface ApiStatusProps {
  isUsingMockData?: boolean;
  className?: string;
}

const ApiStatus: React.FC<ApiStatusProps> = ({ 
  isUsingMockData = true, 
  className = "" 
}) => {
  return (
    <div className={`flex items-center space-x-2 text-sm ${className}`}>
      {isUsingMockData ? (
        <>
          <Database className="w-4 h-4 text-blue-500" />
          <span className="text-blue-600 font-medium">Demo Mode</span>
          <span className="text-gray-500">• Using sample data</span>
        </>
      ) : (
        <>
          <Wifi className="w-4 h-4 text-green-500" />
          <span className="text-green-600 font-medium">Live Data</span>
          <span className="text-gray-500">• Real-time updates</span>
        </>
      )}
    </div>
  );
};

export default ApiStatus;