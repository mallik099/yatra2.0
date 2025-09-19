import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Clock, Navigation, Play, Square, Zap, Users, Route, AlertCircle } from 'lucide-react';

declare global {
  interface Window {
    L: any;
  }
}

const GoogleMapsTracker = () => {
  const [formData, setFormData] = useState({
    startPoint: '',
    destination: '',
    busNumber: ''
  });
  const [isTracking, setIsTracking] = useState(false);
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [busPosition, setBusPosition] = useState<any>(null);
  const [routeProgress, setRouteProgress] = useState<number>(0);
  const [currentSpeed, setCurrentSpeed] = useState<number>(0);
  const [passengers, setPassengers] = useState<number>(0);
  const [nextStop, setNextStop] = useState<string>('');
  const [trafficStatus, setTrafficStatus] = useState<string>('Normal');
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const busMarker = useRef<any>(null);
  const routeLayer = useRef<any>(null);
  const { toast } = useToast();

  const telanganaLocations = [
    'Secunderabad Railway Station', 'Gachibowli', 'HITEC City', 'Ameerpet Metro Station',
    'Kukatpally', 'Dilsukhnagar', 'Ibrahimpatnam', 'Mehdipatnam', 'JBS', 'LB Nagar',
    'Begumpet Airport', 'Charminar', 'Miyapur', 'Kondapur', 'Madhapur', 'Banjara Hills'
  ];

  // Enhanced Google Maps style initialization
  useEffect(() => {
    const loadLeaflet = () => {
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      if (!window.L) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = initGoogleStyleMap;
        document.head.appendChild(script);
      } else {
        initGoogleStyleMap();
      }
    };

    const initGoogleStyleMap = () => {
      if (!mapRef.current || mapInstance.current) return;

      try {
        mapInstance.current = window.L.map(mapRef.current, {
          zoomControl: false,
          attributionControl: false
        }).setView([17.3850, 78.4867], 12);
        
        // Google Maps style tile layer
        window.L.tileLayer('https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
          attribution: '© Google Maps',
          maxZoom: 20,
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
        }).addTo(mapInstance.current);

        // Add custom Google-style controls
        const customZoom = window.L.control({position: 'bottomright'});
        customZoom.onAdd = function() {
          const div = window.L.DomUtil.create('div', 'google-zoom-control');
          div.innerHTML = `
            <div style="
              background: white;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.2);
              overflow: hidden;
              border: 1px solid #e0e0e0;
            ">
              <button onclick="window.mapInstance.zoomIn()" style="
                display: block;
                width: 40px;
                height: 40px;
                border: none;
                background: white;
                font-size: 18px;
                font-weight: bold;
                color: #666;
                cursor: pointer;
                border-bottom: 1px solid #e0e0e0;
              " onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='white'">+</button>
              <button onclick="window.mapInstance.zoomOut()" style="
                display: block;
                width: 40px;
                height: 40px;
                border: none;
                background: white;
                font-size: 18px;
                font-weight: bold;
                color: #666;
                cursor: pointer;
              " onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='white'">−</button>
            </div>
          `;
          return div;
        };
        customZoom.addTo(mapInstance.current);
        (window as any).mapInstance = mapInstance.current;

        // Add Google-style info panel
        const infoPanel = window.L.control({position: 'topleft'});
        infoPanel.onAdd = function() {
          const div = window.L.DomUtil.create('div', 'google-info-panel');
          div.innerHTML = `
            <div style="
              background: white;
              padding: 12px 16px;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.2);
              border: 1px solid #e0e0e0;
              font-family: 'Google Sans', Roboto, sans-serif;
            ">
              <div style="display: flex; align-items: center; margin-bottom: 4px;">
                <div style="width: 8px; height: 8px; background: #4285f4; border-radius: 50%; margin-right: 8px; animation: pulse 2s infinite;"></div>
                <span style="font-weight: 500; color: #202124; font-size: 14px;">Yatra Live</span>
              </div>
              <div style="font-size: 12px; color: #5f6368;">Real-time bus tracking</div>
            </div>
          `;
          return div;
        };
        infoPanel.addTo(mapInstance.current);

        // Add Google Maps styling
        if (!document.querySelector('#google-maps-styles')) {
          const style = document.createElement('style');
          style.id = 'google-maps-styles';
          style.textContent = `
            .leaflet-container {
              font-family: 'Google Sans', Roboto, Arial, sans-serif !important;
              background: #f5f5f5 !important;
            }
            .leaflet-popup-content-wrapper {
              background: white !important;
              border-radius: 8px !important;
              box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
              border: 1px solid #e0e0e0 !important;
            }
            .leaflet-popup-content {
              font-family: 'Google Sans', Roboto, sans-serif !important;
              margin: 12px 16px !important;
              line-height: 1.4 !important;
            }
            .leaflet-popup-tip {
              background: white !important;
              border: 1px solid #e0e0e0 !important;
            }
            .google-bus-marker {
              background: transparent !important;
              border: none !important;
            }
            .google-stop-marker {
              background: transparent !important;
              border: none !important;
            }
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
          `;
          document.head.appendChild(style);
        }

        console.log('Google-style map initialized');
      } catch (error) {
        console.error('Map initialization error:', error);
      }
    };

    loadLeaflet();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  const trackBus = () => {
    if (!formData.startPoint || !formData.destination || !formData.busNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsTracking(true);
    
    const mockResult = {
      busNumber: formData.busNumber,
      startPoint: formData.startPoint,
      destination: formData.destination,
      eta: Math.floor(Math.random() * 25) + 8,
      distance: Math.floor(Math.random() * 18) + 3,
      status: 'Active'
    };
    
    setTrackingResult(mockResult);
    setPassengers(Math.floor(Math.random() * 40) + 10);
    startGoogleStyleTracking();
    
    toast({
      title: "🚌 Bus Tracking Started",
      description: `Now tracking ${formData.busNumber} with Google Maps precision`
    });
  };

  const startGoogleStyleTracking = () => {
    if (!mapInstance.current || !window.L) return;

    // Enhanced TSRTC routes with Google Maps precision
    const routeCoords: { [key: string]: { coords: [number, number][], stops: string[] } } = {
      '218': {
        coords: [
          [17.4399, 78.5014], [17.4380, 78.4950], [17.4350, 78.4900], [17.4320, 78.4750],
          [17.4374, 78.4482], [17.4400, 78.4200], [17.4450, 78.3900], [17.4485, 78.3684], [17.4399, 78.3648]
        ],
        stops: ['Secunderabad Railway Station', 'Paradise Circle', 'Begumpet', 'Ameerpet Metro Station', 'Panjagutta', 'Jubilee Hills', 'HITEC City', 'Gachibowli']
      },
      '290U': {
        coords: [
          [17.3850, 78.4867], [17.4200, 78.4600], [17.4374, 78.4482], [17.4485, 78.3684], [17.4399, 78.3648]
        ],
        stops: ['JBS', 'Lakdi Ka Pul', 'Ameerpet Metro Station', 'HITEC City', 'Gachibowli']
      }
    };

    const locationCoords: { [key: string]: [number, number] } = {
      'Secunderabad Railway Station': [17.4399, 78.5014],
      'Gachibowli': [17.4399, 78.3648],
      'HITEC City': [17.4485, 78.3684],
      'Ameerpet Metro Station': [17.4374, 78.4482],
      'JBS': [17.3850, 78.4867]
    };

    // Generate smooth route points
    let routePoints = [];
    const busRoute = routeCoords[formData.busNumber];
    
    if (busRoute) {
      const startIndex = busRoute.stops.findIndex(stop => 
        stop.toLowerCase().includes(formData.startPoint.toLowerCase()) || 
        formData.startPoint.toLowerCase().includes(stop.toLowerCase())
      );
      const endIndex = busRoute.stops.findIndex(stop => 
        stop.toLowerCase().includes(formData.destination.toLowerCase()) || 
        formData.destination.toLowerCase().includes(stop.toLowerCase())
      );
      
      let startIdx = startIndex >= 0 ? startIndex : 0;
      let endIdx = endIndex >= 0 ? endIndex : busRoute.coords.length - 1;
      
      const relevantCoords = busRoute.coords.slice(startIdx, endIdx + 1);
      
      // Create ultra-smooth path with 50 points between each stop
      for (let i = 0; i < relevantCoords.length - 1; i++) {
        const start = relevantCoords[i];
        const end = relevantCoords[i + 1];
        
        routePoints.push([start[0], start[1]]);
        
        for (let j = 1; j < 50; j++) {
          const progress = j / 50;
          const lat = start[0] + (end[0] - start[0]) * progress;
          const lng = start[1] + (end[1] - start[1]) * progress;
          routePoints.push([lat, lng]);
        }
      }
      
      if (relevantCoords.length > 0) {
        const lastCoord = relevantCoords[relevantCoords.length - 1];
        routePoints.push([lastCoord[0], lastCoord[1]]);
      }
    } else {
      // Direct route
      const startCoords = locationCoords[formData.startPoint] || [17.3687, 78.5242];
      const destCoords = locationCoords[formData.destination] || [17.1232, 78.7278];
      
      for (let i = 0; i <= 200; i++) {
        const progress = i / 200;
        const lat = startCoords[0] + (destCoords[0] - startCoords[0]) * progress;
        const lng = startCoords[1] + (destCoords[1] - startCoords[1]) * progress;
        routePoints.push([lat, lng]);
      }
    }

    // Clear existing markers
    if (busMarker.current) {
      mapInstance.current.removeLayer(busMarker.current);
      busMarker.current = null;
    }
    if (routeLayer.current) {
      mapInstance.current.removeLayer(routeLayer.current);
      routeLayer.current = null;
    }

    const startLat = routePoints[0][0];
    const startLng = routePoints[0][1];
    const destLat = routePoints[routePoints.length - 1][0];
    const destLng = routePoints[routePoints.length - 1][1];

    // Google-style bus marker
    const googleBusIcon = window.L.divIcon({
      html: `
        <div style="
          position: relative;
          width: 32px;
          height: 32px;
          background: #4285f4;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(66, 133, 244, 0.4);
          border: 3px solid white;
        ">
          <div style="
            font-size: 16px;
            color: white;
            font-weight: bold;
          ">🚌</div>
          <div style="
            position: absolute;
            top: -8px;
            right: -8px;
            width: 12px;
            height: 12px;
            background: #34a853;
            border-radius: 50%;
            border: 2px solid white;
            animation: pulse 2s infinite;
          "></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      className: 'google-bus-marker'
    });

    busMarker.current = window.L.marker([startLat, startLng], { icon: googleBusIcon })
      .addTo(mapInstance.current)
      .bindPopup(`
        <div style="font-family: 'Google Sans', Roboto, sans-serif;">
          <div style="font-weight: 500; margin-bottom: 4px;">Bus ${formData.busNumber}</div>
          <div style="font-size: 12px; color: #5f6368;">Live tracking active</div>
        </div>
      `);

    // Google-style start marker
    const startIcon = window.L.divIcon({
      html: `
        <div style="
          width: 24px;
          height: 24px;
          background: #34a853;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(52, 168, 83, 0.4);
          border: 2px solid white;
        ">
          <div style="color: white; font-size: 12px; font-weight: bold;">A</div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      className: 'google-stop-marker'
    });
    
    window.L.marker([startLat, startLng], { icon: startIcon })
      .addTo(mapInstance.current)
      .bindPopup(`
        <div style="font-family: 'Google Sans', Roboto, sans-serif;">
          <div style="font-weight: 500;">${formData.startPoint}</div>
          <div style="font-size: 12px; color: #5f6368;">Starting point</div>
        </div>
      `);

    // Google-style destination marker
    const endIcon = window.L.divIcon({
      html: `
        <div style="
          width: 24px;
          height: 24px;
          background: #ea4335;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(234, 67, 53, 0.4);
          border: 2px solid white;
        ">
          <div style="color: white; font-size: 12px; font-weight: bold;">B</div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      className: 'google-stop-marker'
    });
    
    window.L.marker([destLat, destLng], { icon: endIcon })
      .addTo(mapInstance.current)
      .bindPopup(`
        <div style="font-family: 'Google Sans', Roboto, sans-serif;">
          <div style="font-weight: 500;">${formData.destination}</div>
          <div style="font-size: 12px; color: #5f6368;">Destination</div>
        </div>
      `);

    // Google-style route line
    routeLayer.current = window.L.polyline(routePoints, {
      color: '#4285f4',
      weight: 4,
      opacity: 0.8,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(mapInstance.current);

    // Fit bounds
    const group = new window.L.featureGroup([busMarker.current, routeLayer.current]);
    mapInstance.current.fitBounds(group.getBounds().pad(0.1));

    // Start realistic animation
    startRealisticAnimation(routePoints);
  };

  const startRealisticAnimation = (routePoints: [number, number][]) => {
    let currentIndex = 0;
    let isMoving = true;
    
    const animateStep = () => {
      if (!busMarker.current || !isMoving || currentIndex >= routePoints.length) {
        if (currentIndex >= routePoints.length) {
          currentIndex = 0; // Loop back
          setRouteProgress(0);
        }
        if (!isMoving) return;
      }
      
      const [lat, lng] = routePoints[currentIndex];
      
      // Realistic speed simulation (20-60 km/h)
      const speed = 25 + Math.random() * 35;
      setCurrentSpeed(Math.round(speed));
      
      // Traffic simulation
      const trafficConditions = ['Light', 'Normal', 'Heavy'];
      const randomTraffic = trafficConditions[Math.floor(Math.random() * 3)];
      setTrafficStatus(randomTraffic);
      
      // Passenger simulation
      if (Math.random() < 0.1) { // 10% chance to change passengers
        setPassengers(prev => Math.max(5, Math.min(50, prev + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3))));
      }
      
      // Update bus position
      busMarker.current.setLatLng([lat, lng]);
      setBusPosition({ lat, lng, speed, traffic: randomTraffic });
      
      // Update progress
      const progress = Math.round((currentIndex / (routePoints.length - 1)) * 100);
      setRouteProgress(progress);
      
      // Update next stop
      if (Math.random() < 0.05) { // Occasionally update next stop
        const stops = ['Paradise Circle', 'Begumpet', 'Ameerpet', 'Panjagutta', 'HITEC City'];
        setNextStop(stops[Math.floor(Math.random() * stops.length)]);
      }
      
      currentIndex++;
      
      // Variable speed based on traffic
      const delay = randomTraffic === 'Heavy' ? 1500 : randomTraffic === 'Light' ? 800 : 1200;
      setTimeout(animateStep, delay);
    };
    
    animateStep();
    
    (window as any).busTrackingInterval = () => {
      isMoving = false;
    };
  };

  const stopTracking = () => {
    setIsTracking(false);
    setTrackingResult(null);
    setBusPosition(null);
    setRouteProgress(0);
    setCurrentSpeed(0);
    setPassengers(0);
    setNextStop('');

    if ((window as any).busTrackingInterval) {
      (window as any).busTrackingInterval();
    }

    if (mapInstance.current) {
      if (busMarker.current) {
        mapInstance.current.removeLayer(busMarker.current);
        busMarker.current = null;
      }
      if (routeLayer.current) {
        mapInstance.current.removeLayer(routeLayer.current);
        routeLayer.current = null;
      }
      
      mapInstance.current.eachLayer((layer: any) => {
        if (layer instanceof window.L.Marker && layer !== busMarker.current) {
          mapInstance.current.removeLayer(layer);
        }
      });
      
      mapInstance.current.setView([17.3850, 78.4867], 12);
    }

    toast({
      title: "Tracking Stopped",
      description: "Bus tracking has been disabled"
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-3xl font-bold mb-2 text-gray-900">
          Google Maps Style{' '}
          <span className="text-blue-600">Bus Tracking</span>
        </h3>
        <p className="text-gray-600 font-medium">
          Professional-grade real-time tracking with Google Maps precision
        </p>
      </div>

      {/* Enhanced Input Form */}
      <Card className="p-6 bg-white border border-gray-200 shadow-sm">
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-sm font-semibold mb-2 block text-gray-900">From</label>
            <Input
              placeholder="Enter starting location"
              value={formData.startPoint}
              onChange={(e) => setFormData({...formData, startPoint: e.target.value})}
              className="border-gray-300"
            />
            <select 
              className="w-full mt-2 p-2 text-sm border border-gray-300 rounded-md"
              onChange={(e) => setFormData({...formData, startPoint: e.target.value})}
            >
              <option value="">Select location...</option>
              {telanganaLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block text-gray-900">To</label>
            <Input
              placeholder="Enter destination"
              value={formData.destination}
              onChange={(e) => setFormData({...formData, destination: e.target.value})}
              className="border-gray-300"
            />
            <select 
              className="w-full mt-2 p-2 text-sm border border-gray-300 rounded-md"
              onChange={(e) => setFormData({...formData, destination: e.target.value})}
            >
              <option value="">Select destination...</option>
              {telanganaLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block text-gray-900">Bus Route</label>
            <Input
              placeholder="e.g., 218, 290U"
              value={formData.busNumber}
              onChange={(e) => setFormData({...formData, busNumber: e.target.value})}
              className="border-gray-300"
            />
            <select 
              className="w-full mt-2 p-2 text-sm border border-gray-300 rounded-md"
              onChange={(e) => setFormData({...formData, busNumber: e.target.value})}
            >
              <option value="">Select TSRTC route...</option>
              <option value="218">218 - Secunderabad to Gachibowli</option>
              <option value="290U">290U - JBS to Gachibowli (Express)</option>
              <option value="219">219 - JBS to Gachibowli</option>
              <option value="251">251 - Secunderabad to Ibrahimpatnam</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          {!isTracking ? (
            <Button onClick={trackBus} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Play className="w-4 h-4 mr-2" />
              Start Live Tracking
            </Button>
          ) : (
            <Button onClick={stopTracking} variant="destructive">
              <Square className="w-4 h-4 mr-2" />
              Stop Tracking
            </Button>
          )}
        </div>
      </Card>

      {/* Google Maps Style Map */}
      <Card className="p-0 bg-white border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-100 mr-3">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-gray-900">Live Map</h4>
                <p className="text-sm text-gray-600">Google Maps powered tracking</p>
              </div>
            </div>
            {isTracking && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center bg-green-100 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                  <span className="text-xs font-medium text-green-700">Live</span>
                </div>
                <div className="bg-blue-100 px-3 py-1 rounded-full">
                  <span className="text-xs font-medium text-blue-700">GPS Active</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div 
          ref={mapRef}
          className="w-full h-96"
          style={{ minHeight: '500px' }}
        />

        {/* Enhanced Progress Bar */}
        {isTracking && (
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-900">Route Progress</span>
              <span className="text-sm text-gray-600">{routeProgress}% complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-1000" 
                style={{width: `${routeProgress}%`}}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>🟢 {formData.startPoint}</span>
              <span>🔴 {formData.destination}</span>
            </div>
          </div>
        )}
      </Card>

      {/* Real-time Stats */}
      {isTracking && busPosition && (
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="p-4 bg-white border border-gray-200">
            <div className="flex items-center mb-2">
              <Zap className="w-4 h-4 text-blue-600 mr-2" />
              <span className="font-semibold text-gray-900">Speed</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{currentSpeed}</div>
            <div className="text-xs text-gray-600">km/h</div>
          </Card>

          <Card className="p-4 bg-white border border-gray-200">
            <div className="flex items-center mb-2">
              <Users className="w-4 h-4 text-green-600 mr-2" />
              <span className="font-semibold text-gray-900">Passengers</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{passengers}</div>
            <div className="text-xs text-gray-600">onboard</div>
          </Card>

          <Card className="p-4 bg-white border border-gray-200">
            <div className="flex items-center mb-2">
              <Route className="w-4 h-4 text-purple-600 mr-2" />
              <span className="font-semibold text-gray-900">Next Stop</span>
            </div>
            <div className="text-sm font-bold text-purple-600">{nextStop || 'Calculating...'}</div>
            <div className="text-xs text-gray-600">approaching</div>
          </Card>

          <Card className="p-4 bg-white border border-gray-200">
            <div className="flex items-center mb-2">
              <AlertCircle className={`w-4 h-4 mr-2 ${
                trafficStatus === 'Heavy' ? 'text-red-600' : 
                trafficStatus === 'Light' ? 'text-green-600' : 'text-yellow-600'
              }`} />
              <span className="font-semibold text-gray-900">Traffic</span>
            </div>
            <div className={`text-sm font-bold ${
              trafficStatus === 'Heavy' ? 'text-red-600' : 
              trafficStatus === 'Light' ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {trafficStatus}
            </div>
            <div className="text-xs text-gray-600">conditions</div>
          </Card>
        </div>
      )}

      {/* Trip Summary */}
      {trackingResult && (
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-4 bg-white border border-gray-200">
            <h4 className="font-bold mb-3 flex items-center text-gray-900">
              <Navigation className="w-4 h-4 mr-2 text-blue-600" />
              Trip Details
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-700">Bus Number:</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {trackingResult.busNumber}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Distance:</span>
                <span className="font-semibold text-gray-900">{trackingResult.distance} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Status:</span>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  {isTracking ? 'Live Tracking' : trackingResult.status}
                </Badge>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white border border-gray-200">
            <h4 className="font-bold mb-3 flex items-center text-gray-900">
              <Clock className="w-4 h-4 mr-2 text-blue-600" />
              Arrival Time
            </h4>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {trackingResult.eta} min
              </div>
              <p className="text-sm text-gray-600">
                Estimated arrival
              </p>
              {isTracking && (
                <div className="mt-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                  🚌 Real-time updates active
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default GoogleMapsTracker;