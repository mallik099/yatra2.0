import React from 'react';
import { Clock, MapPin, Zap } from 'lucide-react';

interface ETADisplayProps {
  eta: string;
  confidence: 'high' | 'medium' | 'low';
  nextStop: string;
  size?: 'small' | 'medium' | 'large';
  showConfidence?: boolean;
}

// Move functions outside component to prevent recreation on each render
const getConfidenceColor = (confidence: string) => {
  switch (confidence) {
    case 'high': return 'text-green-600 bg-green-50 border-green-200';
    case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'low': return 'text-red-600 bg-red-50 border-red-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

const getETATextColor = (confidence: string) => {
  switch (confidence) {
    case 'high': return 'text-green-700';
    case 'medium': return 'text-yellow-700';
    case 'low': return 'text-red-700';
    default: return 'text-gray-700';
  }
};

const getSizeClasses = (size: string) => {
  switch (size) {
    case 'small':
      return {
        container: 'p-2',
        eta: 'text-sm font-semibold',
        label: 'text-xs',
        icon: 'w-3 h-3'
      };
    case 'large':
      return {
        container: 'p-4',
        eta: 'text-2xl font-bold',
        label: 'text-sm',
        icon: 'w-5 h-5'
      };
    default:
      return {
        container: 'p-3',
        eta: 'text-lg font-bold',
        label: 'text-xs',
        icon: 'w-4 h-4'
      };
  }
};

const ETADisplay: React.FC<ETADisplayProps> = ({
  eta,
  confidence,
  nextStop,
  size = 'medium',
  showConfidence = true
}) => {

  const classes = getSizeClasses(size);
  const isArriving = eta.toLowerCase().includes('arriving');

  return (
    <div className={`rounded-lg border-2 ${getConfidenceColor(confidence)} ${classes.container}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {isArriving ? (
            <Zap className={`${classes.icon} ${getETATextColor(confidence)}`} />
          ) : (
            <Clock className={`${classes.icon} ${getETATextColor(confidence)}`} />
          )}
          <div>
            <div className={`${classes.eta} ${getETATextColor(confidence)}`}>
              {eta}
            </div>
            <div className={`${classes.label} text-gray-600`}>
              {isArriving ? 'Arriving now' : 'ETA'}
            </div>
          </div>
        </div>
        
        {showConfidence && (
          <div className="text-right">
            <div className={`${classes.label} ${getETATextColor(confidence)} font-medium`}>
              {confidence.toUpperCase()}
            </div>
            <div className={`${classes.label} text-gray-500`}>
              confidence
            </div>
          </div>
        )}
      </div>
      
      {nextStop && (
        <div className="mt-2 pt-2 border-t border-current border-opacity-20">
          <div className="flex items-center space-x-1">
            <MapPin className={`${classes.icon} text-gray-500`} />
            <span className={`${classes.label} text-gray-600`}>
              Next: {nextStop}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ETADisplay;