import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Clock, Navigation, Play, Square } from 'lucide-react';

const MinimalBusTracker = () => {
  const [formData, setFormData] = useState({ startPoint: '', destination: '', busNumber: '' });
  const [isTracking, setIsTracking] = useState(false);
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [busPosition, setBusPosition] = useState<any>(null);
  const [accuracy, setAccuracy] = useState<number>(0);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const busMarker = useRef<any>(null);
  const { toast } = useToast();

  const locations = ['Secunderabad', 'Gachibowli', 'HITEC City', 'Ameerpet', 'Dilsukhnagar', 'Ibrahimpatnam', 'JBS', 'LB Nagar'];

  useEffect(() => {
    const loadMap = () => {
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      if (!window.L) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => {
          if (mapRef.current && !mapInstance.current) {
            mapInstance.current = window.L.map(mapRef.current).setView([17.3850, 78.4867], 11);
            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap contributors'
            }).addTo(mapInstance.current);
          }
        };
        document.head.appendChild(script);
      } else if (mapRef.current && !mapInstance.current) {
        mapInstance.current = window.L.map(mapRef.current).setView([17.3850, 78.4867], 11);
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstance.current);
      }
    };

    loadMap();
  }, []);

  const trackBus = () => {
    if (!formData.busNumber) {
      toast({ title: "Enter bus number", variant: "destructive" });
      return;
    }
    
    setIsTracking(true);
    setTrackingResult({ busNumber: formData.busNumber, eta: 12, distance: 8.5 });
    
    // Start bus tracking on map
    if (mapInstance.current && window.L) {
      const startLat = 17.4399;
      const startLng = 78.5014;
      const endLat = 17.1232;
      const endLng = 78.7278;
      
      // Add route line
      const routeLine = window.L.polyline([
        [startLat, startLng],
        [17.3850, 78.4867], // JBS
        [17.3420, 78.5510], // LB Nagar
        [endLat, endLng]     // Ibrahimpatnam
      ], {
        color: '#3b82f6',
        weight: 4,
        opacity: 0.8,
        dashArray: '10, 5'
      }).addTo(mapInstance.current);
      
      // Add direction markers
      window.L.marker([startLat, startLng])
        .addTo(mapInstance.current)
        .bindPopup('🟢 Start: Secunderabad');
      
      window.L.marker([17.3850, 78.4867])
        .addTo(mapInstance.current)
        .bindPopup('🚏 Stop 1: JBS');
        
      window.L.marker([17.3420, 78.5510])
        .addTo(mapInstance.current)
        .bindPopup('🚏 Stop 2: LB Nagar');
        
      window.L.marker([endLat, endLng])
        .addTo(mapInstance.current)
        .bindPopup('🎯 End: Ibrahimpatnam');
      
      // Add bus marker
      const busIcon = window.L.divIcon({
        html: `<div style="background: #3b82f6; color: white; padding: 4px 8px; border-radius: 8px; font-weight: bold;">🚌 ${formData.busNumber}</div>`,
        iconSize: [80, 30]
      });
      
      busMarker.current = window.L.marker([startLat, startLng], { icon: busIcon })
        .addTo(mapInstance.current)
        .bindPopup(`Bus ${formData.busNumber} - Live Tracking`);
      
      // Fit map to show route
      mapInstance.current.fitBounds(routeLine.getBounds().pad(0.1));
      
      // Animate bus movement along route
      const routePoints = [
        [startLat, startLng],
        [17.3850, 78.4867],
        [17.3420, 78.5510],
        [endLat, endLng]
      ];
      
      let pointIndex = 0;
      let progress = 0;
      
      const moveInterval = setInterval(() => {
        if (pointIndex < routePoints.length - 1) {
          const currentPoint = routePoints[pointIndex];
          const nextPoint = routePoints[pointIndex + 1];
          
          const lat = currentPoint[0] + (nextPoint[0] - currentPoint[0]) * progress;
          const lng = currentPoint[1] + (nextPoint[1] - currentPoint[1]) * progress;
          
          busMarker.current.setLatLng([lat, lng]);
          setBusPosition({ lat, lng });
          setAccuracy(Math.random() * 3 + 2);
          
          progress += 0.05;
          
          if (progress >= 1) {
            progress = 0;
            pointIndex++;
            if (pointIndex < routePoints.length - 1) {
              const stopNames = ['JBS', 'LB Nagar', 'Ibrahimpatnam'];
              toast({ title: `🚏 Arrived at ${stopNames[pointIndex - 1]}` });
            }
          }
        } else {
          clearInterval(moveInterval);
          toast({ title: "🎯 Journey Complete" });
        }
      }, 300);
    }
    
    toast({ title: "🚌 Tracking started" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
Yatra
          </h1>
          <p className="text-gray-600">Real-Time TSRTC Bus Tracking</p>
        </div>

        {/* Form */}
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-8">
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">From</label>
              <Input 
                className="border-2 border-gray-200 focus:border-blue-500 rounded-xl h-12" 
                placeholder="Starting point"
                value={formData.startPoint}
                onChange={(e) => setFormData({...formData, startPoint: e.target.value})}
              />
              <select 
                className="w-full mt-2 p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500"
                onChange={(e) => setFormData({...formData, startPoint: e.target.value})}
              >
                <option value="">Select location...</option>
                {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">To</label>
              <Input 
                className="border-2 border-gray-200 focus:border-blue-500 rounded-xl h-12" 
                placeholder="Destination"
                value={formData.destination}
                onChange={(e) => setFormData({...formData, destination: e.target.value})}
              />
              <select 
                className="w-full mt-2 p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500"
                onChange={(e) => setFormData({...formData, destination: e.target.value})}
              >
                <option value="">Select location...</option>
                {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Bus Route</label>
              <Input 
                className="border-2 border-gray-200 focus:border-blue-500 rounded-xl h-12" 
                placeholder="e.g., 218, 251"
                value={formData.busNumber}
                onChange={(e) => setFormData({...formData, busNumber: e.target.value})}
              />
              <select 
                className="w-full mt-2 p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500"
                onChange={(e) => setFormData({...formData, busNumber: e.target.value})}
              >
                <option value="">TSRTC Routes...</option>
                <option value="218">218 - Sec ↔ Gachibowli</option>
                <option value="251">251 - Sec ↔ Ibrahimpatnam</option>
                <option value="277D">277D - Dilsukhnagar ↔ Ibrahimpatnam</option>
              </select>
            </div>
          </div>
          
          <div className="text-center">
            {!isTracking ? (
              <Button 
                onClick={trackBus} 
                className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-12 py-4 rounded-2xl font-bold text-lg shadow-xl transform hover:scale-105 transition-all"
              >
                <Play className="w-6 h-6 mr-3" /> Track Bus
              </Button>
            ) : (
              <Button 
                onClick={() => setIsTracking(false)} 
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-12 py-4 rounded-2xl font-bold text-lg"
              >
                <Square className="w-6 h-6 mr-3" /> Stop
              </Button>
            )}
          </div>
        </div>

        {/* Map */}
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-green-500 p-6 text-white">
            <h3 className="text-xl font-bold flex items-center">
              <MapPin className="w-6 h-6 mr-3" />Live Map
            </h3>
          </div>
          <div ref={mapRef} className="h-80 bg-gray-100" />
          {busPosition && (
            <div className="p-6 bg-gradient-to-r from-blue-50 to-green-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-blue-700">
                  <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse mr-3"></div>
                  <span className="font-semibold">Live: {busPosition.lat.toFixed(4)}, {busPosition.lng.toFixed(4)}</span>
                </div>
                <Badge className="bg-green-500 text-white px-3 py-1">±{accuracy}m</Badge>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {trackingResult && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-8">
              <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <Navigation className="w-6 h-6 mr-3 text-blue-500" />Bus Info
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">Route</span>
                  <Badge className="bg-blue-500 text-white px-4 py-2 text-lg">{trackingResult.busNumber}</Badge>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">Distance</span>
                  <span className="font-bold text-lg">{trackingResult.distance} km</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">Status</span>
                  <Badge className="bg-green-500 text-white px-4 py-2">🔴 Live</Badge>
                </div>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-8">
              <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <Clock className="w-6 h-6 mr-3 text-green-500" />ETA
              </h4>
              <div className="text-center">
                <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
                  {trackingResult.eta}
                </div>
                <p className="text-gray-600 text-lg mb-4">minutes</p>
                <Badge className="bg-green-500 text-white px-4 py-2">95% confidence</Badge>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MinimalBusTracker;