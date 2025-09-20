import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
import L from 'leaflet';
import { realTimeGovApi } from '../services/realTimeGovApi';
import { tsrtcApi, TSRTCBus, TSRTCBusStop } from '../services/tsrtcApiService';
import { AlertTriangle, Navigation, Clock, Users } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import './EnhancedMap.css';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Bus stop icon - larger and more visible
const createBusStopIcon = (isMajor = false) => {
  const size = isMajor ? 16 : 12;
  const borderSize = isMajor ? 4 : 3;
  const totalSize = size + (borderSize * 2);
  
  return L.divIcon({
    html: `
      <div style="
        background: ${isMajor ? '#1e40af' : '#3b82f6'};
        width: ${size}px;
        height: ${size}px;
        border-radius: ${isMajor ? '4px' : '3px'};
        border: ${borderSize}px solid white;
        box-shadow: 0 ${isMajor ? '4px 12px' : '3px 8px'} rgba(0,0,0,${isMajor ? '0.5' : '0.4'});
        position: relative;
        ${isMajor ? 'animation: pulse 2s infinite;' : ''}
      ">
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: ${isMajor ? '6px' : '4px'};
          height: ${isMajor ? '6px' : '4px'};
          background: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    className: `bus-stop-marker ${isMajor ? 'major-stop' : 'regular-stop'}`,
    iconSize: [totalSize, totalSize],
    iconAnchor: [totalSize/2, totalSize/2]
  });
};

// Custom bus icon
const createBusIcon = (status: string, occupancy: string) => {
  const color = status === 'ACTIVE' ? '#10b981' : status === 'BREAKDOWN' ? '#ef4444' : '#f59e0b';
  const size = occupancy === 'HIGH' || occupancy === 'FULL' ? 'large' : 'normal';
  
  return L.divIcon({
    html: `
      <div style="
        background: ${color};
        width: ${size === 'large' ? '16px' : '12px'};
        height: ${size === 'large' ? '16px' : '12px'};
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 4px;
          height: 4px;
          background: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    className: 'custom-bus-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

// Traffic incident icon
const createTrafficIcon = (severity: string) => {
  const color = severity === 'HIGH' ? '#ef4444' : severity === 'MEDIUM' ? '#f59e0b' : '#10b981';
  
  return L.divIcon({
    html: `
      <div style="
        background: ${color};
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>
    `,
    className: 'traffic-marker',
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
};

interface EnhancedMapProps {
  buses: any[];
  onBusSelect?: (bus: any) => void;
  selectedBus?: any;
  showTraffic?: boolean;
  showRoutes?: boolean;
}

const EnhancedMap: React.FC<EnhancedMapProps> = ({ 
  buses, 
  onBusSelect, 
  selectedBus, 
  showTraffic = true, 
  showRoutes = true 
}) => {
  const [trafficData, setTrafficData] = useState<any[]>([]);
  const [routeLines, setRouteLines] = useState<any[]>([]);
  const [tsrtcBusStops, setTsrtcBusStops] = useState<TSRTCBusStop[]>([]);
  const [tsrtcBuses, setTsrtcBuses] = useState<TSRTCBus[]>([]);
  const [loading, setLoading] = useState(true);

  // Hyderabad center coordinates
  const center: [number, number] = [17.385044, 78.486671];
  const [currentZoom, setCurrentZoom] = useState(12);

  // Load all TSRTC data
  const loadTSRTCData = async () => {
    try {
      console.log('🔄 Loading TSRTC data...');
      
      // Load all buses and bus stops from TSRTC API
      const [busesData, stopsData] = await Promise.all([
        tsrtcApi.getAllBuses(),
        tsrtcApi.getAllBusStops()
      ]);
      
      setTsrtcBuses(busesData);
      setTsrtcBusStops(stopsData);
      
      console.log(`✅ Loaded ${busesData.length} buses and ${stopsData.length} stops`);
      
    } catch (error) {
      console.error('❌ Error loading TSRTC data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate ETA from ISO string
  const calculateETA = (estimatedArrival: string): string => {
    const arrivalTime = new Date(estimatedArrival);
    const now = new Date();
    const diffMinutes = Math.floor((arrivalTime.getTime() - now.getTime()) / (1000 * 60));
    
    if (diffMinutes <= 0) return 'Arriving now';
    if (diffMinutes <= 2) return '1-2 mins';
    if (diffMinutes <= 5) return '3-5 mins';
    if (diffMinutes <= 10) return '5-10 mins';
    return `${diffMinutes} mins`;
  };

  // Load traffic data
  useEffect(() => {
    const loadTrafficData = async () => {
      if (!showTraffic) return;
      
      try {
        const routes = ['100K', '156', '290U', '218', '5K'];
        const trafficPromises = routes.map(route => realTimeGovApi.getTrafficData(route));
        const trafficResults = await Promise.all(trafficPromises);
        
        const incidents = trafficResults.flatMap((traffic, index) => {
          if (!traffic || !traffic.incidents) return [];
          
          return traffic.incidents.map((incident: any, incidentIndex: number) => ({
            id: `${routes[index]}_${incidentIndex}`,
            ...incident,
            routeId: routes[index],
            position: [
              17.385 + (Math.random() - 0.5) * 0.1,
              78.486 + (Math.random() - 0.5) * 0.1
            ] as [number, number]
          }));
        });
        
        setTrafficData(incidents);
      } catch (error) {
        console.error('Error loading traffic data:', error);
      }
    };

    loadTrafficData();
    const interval = setInterval(loadTrafficData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [showTraffic]);

    loadTSRTCData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(loadTSRTCData, 30000);
    return () => clearInterval(interval);
  }, [showRoutes]);

    // Get bus stops for a specific route
    const getBusStopsForRoute = (routeId: string) => {
      const busStopsData: { [key: string]: any[] } = {
        '100K': [
          { id: 'SEC_01', name: 'Secunderabad Railway Station', position: [17.4399, 78.4983], routes: ['100K', '5K', '8A'] },
          { id: 'PAR_01', name: 'Paradise Circle', position: [17.4126, 78.4747], routes: ['100K', '156'] },
          { id: 'AME_01', name: 'Ameerpet Metro', position: [17.3850, 78.4867], routes: ['100K', '156', '218'] },
          { id: 'PUN_01', name: 'Punjagutta', position: [17.4240, 78.4480], routes: ['100K'] },
          { id: 'LAK_01', name: 'Lakdi Ka Pul', position: [17.3970, 78.4560], routes: ['100K'] },
          { id: 'KOT_01', name: 'Koti', position: [17.3616, 78.4747], routes: ['100K', '5K'] },
          { id: 'ABI_01', name: 'Abids', position: [17.3753, 78.4744], routes: ['100K', '5K', '8A'] }
        ],
        '156': [
          { id: 'MEH_01', name: 'Mehdipatnam', position: [17.3936, 78.4206], routes: ['156'] },
          { id: 'TOL_01', name: 'Tolichowki', position: [17.4020, 78.4350], routes: ['156'] },
          { id: 'AME_01', name: 'Ameerpet Metro', position: [17.3850, 78.4867], routes: ['100K', '156', '218'] },
          { id: 'BEG_01', name: 'Begumpet', position: [17.4435, 78.4645], routes: ['156', '218'] },
          { id: 'KPH_01', name: 'KPHB Colony', position: [17.4485, 78.3908], routes: ['156'] },
          { id: 'KUK_01', name: 'Kukatpally', position: [17.4840, 78.4070], routes: ['156'] },
          { id: 'JUB_01', name: 'Jubilee Hills', position: [17.4239, 78.4738], routes: ['156'] }
        ],
        '290U': [
          { id: 'LBN_01', name: 'LB Nagar', position: [17.3421, 78.5515], routes: ['290U'] },
          { id: 'UPP_01', name: 'Uppal X Roads', position: [17.4067, 78.5540], routes: ['290U', '218'] },
          { id: 'SEC_01', name: 'Secunderabad Railway Station', position: [17.4399, 78.4983], routes: ['100K', '5K', '8A', '290U'] },
          { id: 'HIT_01', name: 'HITEC City', position: [17.4435, 78.3772], routes: ['290U'] },
          { id: 'GAC_01', name: 'Gachibowli', position: [17.4399, 78.3482], routes: ['290U'] },
          { id: 'MAD_01', name: 'Madhapur', position: [17.4483, 78.3915], routes: ['290U'] },
          { id: 'KON_01', name: 'Kondapur', position: [17.4615, 78.3570], routes: ['290U'] }
        ]
      };
      
      // Add common stops that serve multiple routes
      const commonStops = [
        { id: 'CHR_01', name: 'Charminar', position: [17.3616, 78.4747], routes: ['8A', '5K'] },
        { id: 'AFZ_01', name: 'Afzalgunj', position: [17.3700, 78.4800], routes: ['5K'] },
        { id: 'BAN_01', name: 'Banjara Hills', position: [17.4126, 78.4482], routes: ['156'] },
        { id: 'HIR_01', name: 'Hitech City', position: [17.4483, 78.3808], routes: ['290U'] },
        { id: 'SHI_01', name: 'Shilparamam', position: [17.4600, 78.3700], routes: ['290U'] }
      ];
      
      return [...(busStopsData[routeId] || []), ...commonStops.filter(stop => stop.routes.includes(routeId))];
    };

    loadRoutes();
  }, [showRoutes]);

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute top-4 left-4 bg-white rounded-lg px-3 py-2 shadow-lg z-[1000]">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-gray-600">Loading TSRTC data...</span>
          </div>
        </div>
      )}
      
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
        whenReady={(map) => {
          map.target.on('zoomend', () => {
            setCurrentZoom(map.target.getZoom());
          });
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Route Lines */}
        {showRoutes && routeLines.map((route) => (
          <Polyline
            key={route.id}
            positions={route.coordinates}
            color={route.color}
            weight={4}
            opacity={0.7}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-gray-800">{route.name}</h3>
                <p className="text-sm text-gray-600">Route: {route.id}</p>
              </div>
            </Popup>
          </Polyline>
        ))}
        
        {/* TSRTC Bus Stops */}
        {tsrtcBusStops.map((stop) => (
          <Marker
            key={stop.stopId}
            position={[stop.latitude, stop.longitude]}
            icon={createBusStopIcon(stop.stopType === 'MAJOR' || stop.stopType === 'TERMINAL')}
          >
            <Popup>
              <div className="p-3">
                <h3 className="font-semibold text-blue-600 mb-1">{stop.stopName}</h3>
                <p className="text-xs text-gray-600 mb-2">Stop ID: {stop.stopId}</p>
                <p className="text-xs text-gray-600 mb-2">Type: {stop.stopType}</p>
                
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-semibold text-gray-700">Routes ({stop.routes.length}):</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {stop.routes.map((route: string) => (
                        <span key={route} className="bg-blue-100 text-blue-700 px-1 py-0.5 rounded text-xs">
                          {route}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {stop.facilities.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-700">Facilities:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {stop.facilities.map((facility: string) => (
                          <span key={facility} className="bg-green-100 text-green-700 px-1 py-0.5 rounded text-xs">
                            {facility}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* All TSRTC Buses */}
        {tsrtcBuses.map((bus) => (
          <Marker
            key={bus.vehicleId}
            position={[bus.currentLat, bus.currentLng]}
            icon={createBusIcon(bus.status, bus.occupancyStatus)}
            eventHandlers={{
              click: () => onBusSelect && onBusSelect({
                id: bus.vehicleId,
                number: bus.routeNumber,
                route: bus.routeName,
                location: [bus.currentLat, bus.currentLng],
                eta: calculateETA(bus.estimatedArrival),
                nextStop: bus.nextStopName,
                fare: bus.fare,
                status: bus.status.toLowerCase(),
                vehicleType: bus.vehicleType,
                speed: bus.speed,
                occupancy: bus.occupancyStatus
              })
            }}
          >
            <Popup>
              <div className="p-3 min-w-48">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-blue-600">{bus.routeNumber}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    bus.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                    bus.status === 'BREAKDOWN' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {bus.status}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Navigation className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-700">{bus.routeName}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">ETA: {calculateETA(bus.estimatedArrival)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-purple-500" />
                    <span className="text-gray-700">Occupancy: {bus.occupancyStatus}</span>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500">Vehicle: {bus.vehicleId}</p>
                    <p className="text-xs text-gray-500">Type: {bus.vehicleType}</p>
                    <p className="text-xs text-gray-500">Speed: {bus.speed} km/h</p>
                    <p className="text-xs text-gray-500">Next: {bus.nextStopName}</p>
                    <p className="text-xs text-gray-500">Fare: ₹{bus.fare}</p>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Traffic Incidents */}
        {showTraffic && trafficData.map((incident) => (
          <Marker
            key={incident.id}
            position={incident.position}
            icon={createTrafficIcon(incident.severity)}
          >
            <Popup>
              <div className="p-2">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className={`w-4 h-4 ${
                    incident.severity === 'HIGH' ? 'text-red-500' :
                    incident.severity === 'MEDIUM' ? 'text-yellow-500' :
                    'text-green-500'
                  }`} />
                  <h3 className="font-semibold text-gray-800">Traffic Alert</h3>
                </div>
                <p className="text-sm text-gray-600 mb-1">{incident.type}</p>
                <p className="text-sm text-gray-600 mb-1">{incident.location}</p>
                <p className="text-xs text-gray-500">Route: {incident.routeId}</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mt-2 ${
                  incident.severity === 'HIGH' ? 'bg-red-100 text-red-700' :
                  incident.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {incident.severity} Priority
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Selected Bus Highlight */}
        {selectedBus && (
          <Circle
            center={selectedBus.location}
            radius={200}
            color="#3b82f6"
            fillColor="#3b82f6"
            fillOpacity={0.1}
            weight={2}
          />
        )}
      </MapContainer>
      
      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
        <h4 className="font-semibold text-gray-800 mb-2 text-sm">TSRTC Live Map</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center justify-between">
            <span>🚌 Buses:</span>
            <span className="font-semibold text-green-600">{tsrtcBuses.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>🚏 Stops:</span>
            <span className="font-semibold text-blue-600">{tsrtcBusStops.length}</span>
          </div>
          <div className="border-t pt-1 mt-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Active Buses</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Issues/Breakdown</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-700 rounded-sm border border-white shadow-sm"></div>
              <span>Bus Stops</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedMap;