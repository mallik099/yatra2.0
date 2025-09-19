import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Clock, Navigation, Play, Square, Zap } from 'lucide-react';
import { accurateTrackingService } from '@/services/accurateTrackingService';

declare global {
  interface Window {
    L: any;
  }
}

const RealTimeMapTracker = () => {
  const [formData, setFormData] = useState({
    startPoint: '',
    destination: '',
    busNumber: ''
  });
  const [isTracking, setIsTracking] = useState(false);
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [busPosition, setBusPosition] = useState<any>(null);
  const [accuracy, setAccuracy] = useState<number>(0);
  const [confidence, setConfidence] = useState<number>(0);
  const [routeProgress, setRouteProgress] = useState<number>(0);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const busMarker = useRef<any>(null);
  const routeLayer = useRef<any>(null);
  const { toast } = useToast();

  const telanganaLocations = [
    'Secunderabad Railway Station',
    'Gachibowli', 
    'HITEC City',
    'Ameerpet Metro Station',
    'Kukatpally',
    'Dilsukhnagar',
    'Ibrahimpatnam',
    'Mehdipatnam',
    'JBS',
    'LB Nagar',
    'Begumpet Airport',
    'Charminar',
    'Miyapur'
  ];

  // Load Leaflet and initialize map
  useEffect(() => {
    const loadLeaflet = () => {
      // Add CSS
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Add JS
      if (!window.L) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = initMap;
        document.head.appendChild(script);
      } else {
        initMap();
      }
    };

    const initMap = () => {
      if (!mapRef.current || mapInstance.current) return;

      try {
        mapInstance.current = window.L.map(mapRef.current).setView([17.3850, 78.4867], 11);
        
        // Use enhanced tile layer with better styling
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors | Yatra',
          maxZoom: 19,
          tileSize: 256,
          className: 'map-tiles'
        }).addTo(mapInstance.current);
        
        // Add attractive map styling
        const mapContainer = mapInstance.current.getContainer();
        mapContainer.style.filter = 'contrast(1.15) saturate(1.3) brightness(1.05) hue-rotate(5deg)';
        mapContainer.style.borderRadius = '24px';
        mapContainer.style.overflow = 'hidden';
        
        // Add enhanced custom map controls with animations
        const customControl = window.L.control({position: 'topright'});
        customControl.onAdd = function() {
          const div = window.L.DomUtil.create('div', 'custom-map-control');
          div.innerHTML = `
            <div style="
              background: linear-gradient(135deg, #ffffff, #f8fafc);
              padding: 12px;
              border-radius: 12px;
              box-shadow: 0 8px 24px rgba(0,0,0,0.12);
              border: 2px solid rgba(59, 130, 246, 0.1);
              backdrop-filter: blur(10px);
            ">
              <div style="
                font-size: 14px;
                font-weight: bold;
                background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                margin-bottom: 4px;
                display: flex;
                align-items: center;
                gap: 4px;
              ">
                <span style="font-size: 16px;">📍</span> Yatra
              </div>
              <div style="
                font-size: 10px;
                color: #10b981;
                display: flex;
                align-items: center;
                gap: 4px;
              ">
                <div style="width: 6px; height: 6px; background: #10b981; border-radius: 50%; animation: pulse 1s infinite;"></div>
                Live Tracking
              </div>
            </div>
          `;
          return div;
        };
        customControl.addTo(mapInstance.current);
        
        // Add zoom control styling
        const zoomControl = window.L.control.zoom({position: 'bottomright'});
        zoomControl.addTo(mapInstance.current);
        
        // Add enhanced CSS for attractive markers and map styling
        if (!document.querySelector('#map-styles')) {
          const style = document.createElement('style');
          style.id = 'map-styles';
          style.textContent = `
          .animated-bus {
            background: transparent !important;
            border: none !important;
            z-index: 1000 !important;
          }
          .animated-bus div {
            transition: transform 0.3s ease !important;
          }
          .start-marker, .end-marker, .stop-marker {
            background: transparent !important;
            border: none !important;
            filter: drop-shadow(0 4px 12px rgba(0,0,0,0.25));
            transition: all 0.3s ease;
          }
          .start-marker:hover, .end-marker:hover, .stop-marker:hover {
            transform: scale(1.1);
          }
          .leaflet-popup-content {
            font-family: system-ui, -apple-system, sans-serif;
            line-height: 1.5;
            border-radius: 12px;
            background: linear-gradient(135deg, #ffffff, #f8fafc);
          }
          .leaflet-popup-content-wrapper {
            border-radius: 16px !important;
            box-shadow: 0 20px 40px rgba(0,0,0,0.15) !important;
            border: 2px solid rgba(59, 130, 246, 0.1) !important;
          }
          .leaflet-container {
            border-radius: 24px !important;
            box-shadow: 0 20px 40px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
            background: linear-gradient(135deg, #f0f9ff, #e0f2fe, #f0fdf4) !important;
            border: 4px solid rgba(59, 130, 246, 0.1) !important;
          }
          .map-tiles {
            filter: contrast(1.15) saturate(1.3) brightness(1.05) hue-rotate(5deg);
            transition: all 0.3s ease;
          }
          .leaflet-control-zoom {
            border: none !important;
            box-shadow: 0 8px 24px rgba(0,0,0,0.1) !important;
          }
          .leaflet-control-zoom a {
            background: linear-gradient(135deg, #ffffff, #f8fafc) !important;
            border: 1px solid rgba(59, 130, 246, 0.2) !important;
            color: #1e40af !important;
            font-weight: bold !important;
            border-radius: 8px !important;
            margin: 2px !important;
            transition: all 0.2s ease !important;
          }
          .leaflet-control-zoom a:hover {
            background: linear-gradient(135deg, #dbeafe, #bfdbfe) !important;
            transform: scale(1.05) !important;
          }
          @keyframes busFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-2px); }
          }
          .route-arrow {
            animation: arrowPulse 1.5s ease-in-out infinite;
          }
          @keyframes arrowPulse {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.1); }
          }
        `;
          document.head.appendChild(style);
        }

        console.log('Map initialized successfully');
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
    
    // Enhanced tracking data with accuracy
    const mockResult = {
      busNumber: formData.busNumber,
      startPoint: formData.startPoint,
      destination: formData.destination,
      eta: Math.floor(Math.random() * 30) + 10,
      distance: Math.floor(Math.random() * 20) + 5,
      status: 'Active',
      accuracy: Math.random() * 5 + 2,
      confidence: 0.85 + Math.random() * 0.13
    };
    
    setAccuracy(mockResult.accuracy);
    setConfidence(mockResult.confidence);
    
    setTrackingResult(mockResult);
    
    // Start real-time simulation
    startRealTimeTracking();
    
    toast({
      title: "Bus Tracking Started",
      description: `Now tracking ${formData.busNumber} in real-time`
    });
  };

  const startRealTimeTracking = () => {
    if (!mapInstance.current || !window.L) return;

    // Complete TSRTC route coordinates with all intermediate stops
    const routeCoords: { [key: string]: { coords: [number, number][], stops: string[] } } = {
      '218': {
        coords: [
          [17.4399, 78.5014], // Secunderabad Railway Station
          [17.4350, 78.4900], // Paradise Circle
          [17.4320, 78.4750], // Begumpet
          [17.4374, 78.4482], // Ameerpet Metro Station
          [17.4400, 78.4200], // Panjagutta
          [17.4450, 78.3900], // Jubilee Hills
          [17.4485, 78.3684], // HITEC City
          [17.4399, 78.3648]  // Gachibowli
        ],
        stops: ['Secunderabad Railway Station', 'Paradise Circle', 'Begumpet', 'Ameerpet Metro Station', 'Panjagutta', 'Jubilee Hills', 'HITEC City', 'Gachibowli']
      },
      '219': {
        coords: [
          [17.3850, 78.4867], // JBS (Jubilee Bus Station)
          [17.4100, 78.4700], // Nampally
          [17.4200, 78.4600], // Lakdi Ka Pul
          [17.4374, 78.4482], // Ameerpet Metro Station
          [17.4400, 78.4200], // Panjagutta
          [17.4450, 78.3900], // Jubilee Hills
          [17.4485, 78.3684], // HITEC City
          [17.4399, 78.3648]  // Gachibowli
        ],
        stops: ['JBS', 'Nampally', 'Lakdi Ka Pul', 'Ameerpet Metro Station', 'Panjagutta', 'Jubilee Hills', 'HITEC City', 'Gachibowli']
      },
      '290': {
        coords: [
          [17.3850, 78.4867], // JBS (Jubilee Bus Station)
          [17.4100, 78.4700], // Nampally
          [17.4200, 78.4600], // Lakdi Ka Pul
          [17.4374, 78.4482], // Ameerpet Metro Station
          [17.4400, 78.4200], // Panjagutta
          [17.4485, 78.3684]  // HITEC City
        ],
        stops: ['JBS', 'Nampally', 'Lakdi Ka Pul', 'Ameerpet Metro Station', 'Panjagutta', 'HITEC City']
      },
      '290U': {
        coords: [
          [17.3850, 78.4867], // JBS (Jubilee Bus Station)
          [17.4200, 78.4600], // Lakdi Ka Pul
          [17.4374, 78.4482], // Ameerpet Metro Station
          [17.4485, 78.3684], // HITEC City (Express)
          [17.4399, 78.3648]  // Gachibowli
        ],
        stops: ['JBS', 'Lakdi Ka Pul', 'Ameerpet Metro Station', 'HITEC City', 'Gachibowli']
      },
      '251': {
        coords: [
          [17.4399, 78.5014], // Secunderabad Railway Station
          [17.4200, 78.4900], // Kacheguda
          [17.3850, 78.4867], // JBS (Jubilee Bus Station)
          [17.3700, 78.5100], // Malakpet
          [17.3687, 78.5242], // Dilsukhnagar Bus Station
          [17.3600, 78.5350], // Chaitanyapuri
          [17.3350, 78.5580], // Kothapet
          [17.3440, 78.5530], // N.T.R Market
          [17.3430, 78.5520], // L.B. Nagar Metro Station
          [17.3420, 78.5510], // L.B Nagar
          [17.2650, 78.5900], // Omkar Nagar
          [17.2550, 78.6000], // Hastinapur South (Naveena College)
          [17.2450, 78.6100], // Sagar Complex
          [17.2350, 78.6200], // Swami Narayan Colony
          [17.2250, 78.6300], // Injapur
          [17.2150, 78.6400], // Yamjal Katta Maisamma
          [17.2050, 78.6500], // Ragannaguda
          [17.1950, 78.6600], // Manneguda X Road
          [17.1850, 78.6700], // Bongloor X Road
          [17.1750, 78.6800], // Koheda X Road
          [17.1650, 78.6900], // Mangalpally X Road
          [17.1550, 78.7000], // Sri Indu Engineering College
          [17.1450, 78.7100], // Sheriguda
          [17.1350, 78.7200], // Uppariguda X Road
          [17.1232, 78.7278]  // Ibrahimpatnam
        ],
        stops: ['Secunderabad Railway Station', 'Kacheguda', 'JBS', 'Malakpet', 'Dilsukhnagar Bus Station', 'Chaitanyapuri', 'Kothapet', 'N.T.R Market', 'L.B. Nagar Metro Station', 'L.B Nagar', 'Omkar Nagar', 'Hastinapur South (Naveena College)', 'Sagar Complex', 'Swami Narayan Colony', 'Injapur', 'Yamjal Katta Maisamma', 'Ragannaguda', 'Manneguda X Road', 'Bongloor X Road', 'Koheda X Road', 'Mangalpally X Road', 'Sri Indu Engineering College', 'Sheriguda', 'Uppariguda X Road', 'Ibrahimpatnam']
      },
      '277D': {
        coords: [
          [17.3687, 78.5242], // Dilsukhnagar Bus Station
          [17.3600, 78.5350], // Chaitanyapuri
          [17.3350, 78.5580], // Kothapet
          [17.3440, 78.5530], // N.T.R Market
          [17.3430, 78.5520], // L.B. Nagar Metro Station
          [17.3420, 78.5510], // L.B Nagar
          [17.2650, 78.5900], // Omkar Nagar
          [17.2550, 78.6000], // Hastinapur South (Naveena College)
          [17.2450, 78.6100], // Sagar Complex
          [17.2350, 78.6200], // Swami Narayan Colony
          [17.2250, 78.6300], // Injapur
          [17.2150, 78.6400], // Yamjal Katta Maisamma
          [17.2050, 78.6500], // Ragannaguda
          [17.1950, 78.6600], // Manneguda X Road
          [17.1850, 78.6700], // Bongloor X Road
          [17.1750, 78.6800], // Koheda X Road
          [17.1650, 78.6900], // Mangalpally X Road
          [17.1550, 78.7000], // Sri Indu Engineering College
          [17.1450, 78.7100], // Sheriguda
          [17.1350, 78.7200], // Uppariguda X Road
          [17.1232, 78.7278]  // Ibrahimpatnam
        ],
        stops: ['Dilsukhnagar Bus Station', 'Chaitanyapuri', 'Kothapet', 'N.T.R Market', 'L.B. Nagar Metro Station', 'L.B Nagar', 'Omkar Nagar', 'Hastinapur South (Naveena College)', 'Sagar Complex', 'Swami Narayan Colony', 'Injapur', 'Yamjal Katta Maisamma', 'Ragannaguda', 'Manneguda X Road', 'Bongloor X Road', 'Koheda X Road', 'Mangalpally X Road', 'Sri Indu Engineering College', 'Sheriguda', 'Uppariguda X Road', 'Ibrahimpatnam']
      },
      '280': {
        coords: [
          [17.4062, 78.4748], // Mehdipatnam
          [17.3900, 78.4900], // Masab Tank
          [17.3800, 78.5000], // Banjara Hills
          [17.3700, 78.5100], // Malakpet
          [17.3687, 78.5242], // Dilsukhnagar Bus Station
          [17.3600, 78.5350], // Chaitanyapuri
          [17.3350, 78.5580], // Kothapet
          [17.3440, 78.5530], // N.T.R Market
          [17.3430, 78.5520], // L.B. Nagar Metro Station
          [17.3420, 78.5510], // L.B Nagar
          [17.2650, 78.5900], // Omkar Nagar
          [17.2550, 78.6000], // Hastinapur South (Naveena College)
          [17.2450, 78.6100], // Sagar Complex
          [17.2350, 78.6200], // Swami Narayan Colony
          [17.2250, 78.6300], // Injapur
          [17.2150, 78.6400], // Yamjal Katta Maisamma
          [17.2050, 78.6500], // Ragannaguda
          [17.1950, 78.6600], // Manneguda X Road
          [17.1850, 78.6700], // Bongloor X Road
          [17.1750, 78.6800], // Koheda X Road
          [17.1650, 78.6900], // Mangalpally X Road
          [17.1550, 78.7000], // Sri Indu Engineering College
          [17.1450, 78.7100], // Sheriguda
          [17.1350, 78.7200], // Uppariguda X Road
          [17.1232, 78.7278]  // Ibrahimpatnam
        ],
        stops: ['Mehdipatnam', 'Masab Tank', 'Banjara Hills', 'Malakpet', 'Dilsukhnagar Bus Station', 'Chaitanyapuri', 'Kothapet', 'N.T.R Market', 'L.B. Nagar Metro Station', 'L.B Nagar', 'Omkar Nagar', 'Hastinapur South (Naveena College)', 'Sagar Complex', 'Swami Narayan Colony', 'Injapur', 'Yamjal Katta Maisamma', 'Ragannaguda', 'Manneguda X Road', 'Bongloor X Road', 'Koheda X Road', 'Mangalpally X Road', 'Sri Indu Engineering College', 'Sheriguda', 'Uppariguda X Road', 'Ibrahimpatnam']
      },
      '1': {
        coords: [
          [17.4399, 78.5014], // Secunderabad Railway Station
          [17.4200, 78.4900], // Kacheguda
          [17.4000, 78.4800], // Sultan Bazar
          [17.3850, 78.4867], // JBS
          [17.3800, 78.4800], // Charminar
          [17.3753, 78.4744]  // Afzalgunj
        ],
        stops: ['Secunderabad Railway Station', 'Kacheguda', 'Sultan Bazar', 'JBS', 'Charminar', 'Afzalgunj']
      },
      '10': {
        coords: [
          [17.4399, 78.5014], // Secunderabad Railway Station
          [17.4350, 78.4900], // Paradise Circle
          [17.4320, 78.4750], // Begumpet
          [17.4374, 78.4482], // Ameerpet Metro Station
          [17.4600, 78.4300], // SR Nagar
          [17.4750, 78.4150], // Erragadda
          [17.4851, 78.4089]  // Kukatpally
        ],
        stops: ['Secunderabad Railway Station', 'Paradise Circle', 'Begumpet', 'Ameerpet Metro Station', 'SR Nagar', 'Erragadda', 'Kukatpally']
      },
      '18': {
        coords: [
          [17.4399, 78.5014], // Secunderabad Railway Station
          [17.4350, 78.4900], // Paradise Circle
          [17.4320, 78.4750], // Begumpet
          [17.4374, 78.4482], // Ameerpet Metro Station
          [17.4200, 78.4600], // Lakdi Ka Pul
          [17.4100, 78.4700], // Nampally
          [17.4062, 78.4748]  // Mehdipatnam
        ],
        stops: ['Secunderabad Railway Station', 'Paradise Circle', 'Begumpet', 'Ameerpet Metro Station', 'Lakdi Ka Pul', 'Nampally', 'Mehdipatnam']
      },
      '49M': {
        coords: [
          [17.4399, 78.5014], // Secunderabad Railway Station
          [17.4350, 78.4900], // Paradise Circle
          [17.4320, 78.4750], // Begumpet
          [17.4374, 78.4482], // Ameerpet Metro Station
          [17.4600, 78.4300], // SR Nagar
          [17.4800, 78.3800], // BHEL
          [17.4900, 78.3500], // Nizampet
          [17.5030, 78.3207]  // Miyapur
        ],
        stops: ['Secunderabad Railway Station', 'Paradise Circle', 'Begumpet', 'Ameerpet Metro Station', 'SR Nagar', 'BHEL', 'Nizampet', 'Miyapur']
      }
    };
    
    const locationCoords: { [key: string]: [number, number] } = {
      'Secunderabad Railway Station': [17.4399, 78.5014],
      'Gachibowli': [17.4399, 78.3648],
      'HITEC City': [17.4485, 78.3684],
      'Ameerpet Metro Station': [17.4374, 78.4482],
      'Kukatpally': [17.4851, 78.4089],
      'Dilsukhnagar': [17.3687, 78.5242],
      'Ibrahimpatnam': [17.1232, 78.7278],
      'Mehdipatnam': [17.4062, 78.4748],
      'JBS': [17.3850, 78.4867],
      'LB Nagar': [17.3420, 78.5510]
    };

    // Get route data and filter for user's journey
    let routePoints = [];
    let stopNames = [];
    const busRoute = routeCoords[formData.busNumber];
    
    if (busRoute) {
      // Find start and end indices based on user input
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
      
      // Get only the relevant portion of the route
      const relevantCoords = busRoute.coords.slice(startIdx, endIdx + 1);
      const relevantStops = busRoute.stops.slice(startIdx, endIdx + 1);
      
      // Create detailed route with many intermediate points for smooth animation
      routePoints = [];
      
      // Add 20 intermediate points between each stop for smoother, slower movement
      for (let i = 0; i < relevantCoords.length - 1; i++) {
        const start = relevantCoords[i];
        const end = relevantCoords[i + 1];
        
        // Add the start point
        routePoints.push([start[0], start[1]]);
        
        // Create 20 points between each stop for slower movement
        for (let j = 1; j < 20; j++) {
          const progress = j / 20;
          const lat = start[0] + (end[0] - start[0]) * progress;
          const lng = start[1] + (end[1] - start[1]) * progress;
          routePoints.push([lat, lng]);
        }
      }
      
      // Add the final destination point
      if (relevantCoords.length > 0) {
        const lastCoord = relevantCoords[relevantCoords.length - 1];
        routePoints.push([lastCoord[0], lastCoord[1]]);
      }
      
      stopNames = [...relevantStops];
    } else {
      // Direct route with road simulation
      const startCoords = locationCoords[formData.startPoint] || [17.3687, 78.5242];
      const destCoords = locationCoords[formData.destination] || [17.1232, 78.7278];
      
      // Create smooth path with 100 points for slower movement
      for (let i = 0; i <= 100; i++) {
        const progress = i / 100;
        const lat = startCoords[0] + (destCoords[0] - startCoords[0]) * progress;
        const lng = startCoords[1] + (destCoords[1] - startCoords[1]) * progress;
        routePoints.push([lat, lng]);
      }
      
      stopNames = [formData.startPoint, formData.destination];
    }
    
    let currentLat = routePoints[0][0];
    let currentLng = routePoints[0][1];
    const destLat = routePoints[routePoints.length - 1][0];
    const destLng = routePoints[routePoints.length - 1][1];

    // Clear existing markers
    if (busMarker.current) {
      mapInstance.current.removeLayer(busMarker.current);
      busMarker.current = null;
    }
    if (routeLayer.current) {
      mapInstance.current.removeLayer(routeLayer.current);
      routeLayer.current = null;
    }

    // Ensure we have valid starting coordinates
    if (!routePoints || routePoints.length === 0) {
      console.error('No route points available');
      return;
    }

    const startLat = routePoints[0][0];
    const startLng = routePoints[0][1];
    
    console.log('Creating bus marker at:', startLat, startLng);

    // Create animated bus icon
    const busIcon = window.L.divIcon({
      html: `
        <div style="
          font-size: 24px;
          text-align: center;
          animation: busFloat 2s ease-in-out infinite;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        ">🚌</div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      className: 'animated-bus'
    });

    // Create bus marker
    busMarker.current = window.L.marker([startLat, startLng], { icon: busIcon })
      .addTo(mapInstance.current)
      .bindPopup(`Bus ${formData.busNumber}`);

    // Add enhanced start marker
    const startIcon = window.L.divIcon({
      html: `<div style="font-size: 20px; text-align: center;">🟢</div>`,
      iconSize: [25, 25],
      iconAnchor: [12, 12],
      className: 'start-marker'
    });
    
    const startMarker = window.L.marker([startLat, startLng], { icon: startIcon })
      .addTo(mapInstance.current)
      .bindPopup(`${formData.startPoint}`);

    // Add enhanced destination marker
    const endIcon = window.L.divIcon({
      html: `<div style="font-size: 20px; text-align: center;">🔴</div>`,
      iconSize: [25, 25],
      iconAnchor: [12, 12],
      className: 'end-marker'
    });
    
    const endMarker = window.L.marker([destLat, destLng], { icon: endIcon })
      .addTo(mapInstance.current)
      .bindPopup(`${formData.destination}`);

    // Add enhanced intermediate bus stops (only between user's start and destination)
    if (busRoute && stopNames.length > 2) {
      const stopIcon = window.L.divIcon({
        html: `<div style="font-size: 16px; text-align: center;">🚏</div>`,
        iconSize: [20, 20],
        className: 'stop-marker'
      });
      
      // Find the coordinates for the filtered stops
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
      
      if (startIdx > endIdx) {
        [startIdx, endIdx] = [endIdx, startIdx];
      }
      
      // Add markers for intermediate stops (skip first and last of user journey)
      for (let i = startIdx + 1; i < endIdx; i++) {
        const stopCoord = busRoute.coords[i];
        const stopName = busRoute.stops[i];
        
        window.L.marker([stopCoord[0], stopCoord[1]], { icon: stopIcon })
          .addTo(mapInstance.current)
          .bindPopup(`${stopName}`);
      }
    }

    // Route points are already set above based on real TSRTC routes

    // Add enhanced route line with attractive styling and animation
    routeLayer.current = window.L.polyline(routePoints, {
      color: '#3b82f6',
      weight: 6,
      opacity: 0.9,
      dashArray: '12, 8',
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(mapInstance.current);
    
    // Add a shadow line underneath for depth
    const shadowLine = window.L.polyline(routePoints, {
      color: '#1e40af',
      weight: 8,
      opacity: 0.3
    }).addTo(mapInstance.current);
    
    // Add route direction arrows
    const arrowIcon = window.L.divIcon({
      html: '<div style="color: #3b82f6; font-size: 16px; transform: rotate(45deg);">➤</div>',
      iconSize: [20, 20],
      className: 'route-arrow'
    });
    
    // Add arrows at intervals along the route
    for (let i = 10; i < routePoints.length; i += 20) {
      window.L.marker([routePoints[i][0], routePoints[i][1]], { icon: arrowIcon })
        .addTo(mapInstance.current);
    }

    // Fit map to show entire route with padding
    const group = new window.L.featureGroup([startMarker, endMarker, routeLayer.current, busMarker.current]);
    mapInstance.current.fitBounds(group.getBounds().pad(0.1));
    
    // Start smooth animation
    startSmoothBusAnimation();

    // Function for smooth bus animation with looping
    function startSmoothBusAnimation() {
      let currentIndex = 0;
      let isLooping = true;
      let isAtStop = false;
      let stopTimer = 0;
      
      function animateStep() {
        if (!busMarker.current || !isLooping) return;
        
        if (currentIndex >= routePoints.length) {
          // Loop back to start
          currentIndex = 0;
          setRouteProgress(0);
        }
        
        const [lat, lng] = routePoints[currentIndex];
        
        // Check if bus is at a major bus stop
        let atMajorStop = false;
        let currentStopName = '';
        
        if (busRoute && stopNames.length > 0) {
          // Calculate which stop we're at based on route segments
          const segmentSize = Math.floor(routePoints.length / stopNames.length);
          const stopIndex = Math.floor(currentIndex / segmentSize);
          
          // Check if we're at a stop coordinate (within tolerance)
          const tolerance = 5;
          for (let i = 0; i < stopNames.length; i++) {
            const expectedIndex = i * segmentSize;
            if (Math.abs(currentIndex - expectedIndex) <= tolerance) {
              atMajorStop = true;
              currentStopName = stopNames[i];
              break;
            }
          }
        }
        
        // Handle stop behavior
        if (atMajorStop && !isAtStop) {
          isAtStop = true;
          stopTimer = 0;
          
          // Show stop popup
          busMarker.current.bindPopup(`🚏 Stopped at ${currentStopName}`).openPopup();
        }
        
        if (isAtStop) {
          stopTimer++;
          if (stopTimer >= 4) { // Stop for 2 seconds (4 intervals of 1000ms)
            isAtStop = false;
            stopTimer = 0;
            busMarker.current.closePopup();
          } else {
            // Don't move while at stop
            setTimeout(animateStep, 1000);
            return;
          }
        }
        
        // Calculate direction for bus rotation
        let rotation = 0;
        if (currentIndex < routePoints.length - 1) {
          const [nextLat, nextLng] = routePoints[currentIndex + 1];
          const deltaLat = nextLat - lat;
          const deltaLng = nextLng - lng;
          rotation = Math.atan2(deltaLng, deltaLat) * (180 / Math.PI);
        }
        
        // Update bus icon with rotation
        const rotatedBusIcon = window.L.divIcon({
          html: `
            <div style="
              font-size: 24px;
              text-align: center;
              animation: busFloat 2s ease-in-out infinite;
              filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
              transform: rotate(${rotation}deg);
              transition: transform 0.3s ease;
            ">🚌</div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
          className: 'animated-bus'
        });
        
        busMarker.current.setIcon(rotatedBusIcon);
        busMarker.current.setLatLng([lat, lng]);
        
        // Update progress
        const progress = Math.round((currentIndex / (routePoints.length - 1)) * 100);
        setRouteProgress(progress);
        
        // Update bus position state
        setBusPosition({ lat, lng, accuracy: Math.random() * 2 + 1 });
        
        currentIndex++;
        
        // Schedule next animation frame (slower)
        setTimeout(animateStep, 1000); // Slower 1000ms intervals
      }
      
      // Start animation
      animateStep();
      
      // Store cleanup function
      (window as any).busTrackingInterval = () => {
        isLooping = false;
      };
    }

    // Bus movement animation
    let routeIndex = 0;
    
    console.log('Starting bus movement with', routePoints.length, 'route points');
    
    // Helper function to calculate bearing between two points
    const calculateBearing = (lat1: number, lng1: number, lat2: number, lng2: number) => {
      const dLng = (lng2 - lng1) * Math.PI / 180;
      const lat1Rad = lat1 * Math.PI / 180;
      const lat2Rad = lat2 * Math.PI / 180;
      
      const y = Math.sin(dLng) * Math.cos(lat2Rad);
      const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng);
      
      return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
    };
    
    // Function to start bus animation
    const startBusAnimation = () => {
      console.log('Starting bus animation with', routePoints.length, 'points');
      
      const moveInterval = setInterval(() => {
      if (routeIndex < routePoints.length) {
        const [lat, lng] = routePoints[routeIndex];
        
        // Update bus position with smooth animation
        if (busMarker.current && lat && lng) {
          // Smooth animated movement
          const currentPos = busMarker.current.getLatLng();
          const newLatLng = window.L.latLng(lat, lng);
          
          // Calculate direction for bus rotation
          if (currentPos) {
            const bearing = calculateBearing(currentPos.lat, currentPos.lng, lat, lng);
            const rotation = bearing - 90; // Adjust for bus icon orientation
            
            // Update bus icon with rotation
            const rotatedBusIcon = window.L.divIcon({
              html: `
                <div style="
                  font-size: 28px; 
                  text-align: center;
                  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
                  animation: busFloat 2s ease-in-out infinite;
                  transform: rotate(${rotation}deg);
                  transition: transform 0.3s ease;
                ">🚌</div>
              `,
              iconSize: [35, 35],
              className: 'custom-bus-marker bus-moving'
            });
            busMarker.current.setIcon(rotatedBusIcon);
          }
          
          // Animate to new position
          busMarker.current.setLatLng(newLatLng);
          
          const newAccuracy = Math.random() * 3 + 2;
          setBusPosition({ lat, lng, accuracy: newAccuracy });
          setAccuracy(newAccuracy);
          
          // Calculate and update progress
          const progress = Math.round((routeIndex / (routePoints.length - 1)) * 100);
          setRouteProgress(progress);
          
          // Determine current status
          let currentStatus = `Moving (${progress}%)`;
          if (busRoute && stopNames.length > 0) {
            const stopProgress = Math.floor((routeIndex / routePoints.length) * stopNames.length);
            const currentStopIndex = Math.min(stopProgress, stopNames.length - 1);
            const nextStopIndex = Math.min(currentStopIndex + 1, stopNames.length - 1);
            
            if (stopProgress < stopNames.length - 1) {
              currentStatus = `En route to ${stopNames[nextStopIndex]}`;
            } else {
              currentStatus = `Approaching ${stopNames[stopNames.length - 1]}`;
            }
          }
          
          // Update popup content
          busMarker.current.setPopupContent(`Bus ${formData.busNumber}`);
        }
        
        routeIndex++;
      } else {
        // Journey completed
        clearInterval(moveInterval);
        setRouteProgress(100);
        
        if (busMarker.current) {
          busMarker.current.setPopupContent(`Bus ${formData.busNumber} - Arrived`).openPopup();
        }
        
        toast({
          title: "🎯 Journey Complete",
          description: `Bus ${formData.busNumber} reached ${formData.destination}`
        });
      }
      }, 800); // Slower, more realistic movement every 800ms

      // Store interval for cleanup
      (window as any).busTrackingInterval = moveInterval;
    };
  };

  const stopTracking = () => {
    setIsTracking(false);
    setTrackingResult(null);
    setBusPosition(null);
    setRouteProgress(0);

    // Clear interval
    if ((window as any).busTrackingInterval) {
      clearInterval((window as any).busTrackingInterval);
    }

    // Clear map markers and reset view
    if (mapInstance.current) {
      if (busMarker.current) {
        mapInstance.current.removeLayer(busMarker.current);
        busMarker.current = null;
      }
      if (routeLayer.current) {
        mapInstance.current.removeLayer(routeLayer.current);
        routeLayer.current = null;
      }
      
      // Clear all other markers
      mapInstance.current.eachLayer((layer: any) => {
        if (layer instanceof window.L.Marker && layer !== busMarker.current) {
          mapInstance.current.removeLayer(layer);
        }
      });
      
      // Reset map view to Hyderabad
      mapInstance.current.setView([17.3850, 78.4867], 11);
    }

    toast({
      title: "Tracking Stopped",
      description: "Bus tracking has been disabled"
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2 text-black">
          Real-Time Bus Tracking for{' '}
          <span className="text-blue-600">
            Telangana
          </span>
        </h3>
        <p className="text-gray-800 font-medium">
          Live GPS tracking with interactive map
        </p>
      </div>

      {/* Input Form */}
      <Card className="p-6 bg-white border-gray-200">
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-sm font-semibold mb-2 block text-black">Starting Point</label>
            <Input
              placeholder="Enter starting location"
              value={formData.startPoint}
              onChange={(e) => setFormData({...formData, startPoint: e.target.value})}
            />
            <select 
              className="w-full mt-1 p-1 text-xs border rounded"
              onChange={(e) => setFormData({...formData, startPoint: e.target.value})}
            >
              <option value="">Quick select...</option>
              {telanganaLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block text-black">Destination</label>
            <Input
              placeholder="Enter destination"
              value={formData.destination}
              onChange={(e) => setFormData({...formData, destination: e.target.value})}
            />
            <select 
              className="w-full mt-1 p-1 text-xs border rounded"
              onChange={(e) => setFormData({...formData, destination: e.target.value})}
            >
              <option value="">Quick select...</option>
              {telanganaLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block text-black">Bus Number</label>
            <Input
              placeholder="e.g., 218, 219, 290U"
              value={formData.busNumber}
              onChange={(e) => setFormData({...formData, busNumber: e.target.value})}
            />
            <select 
              className="w-full mt-1 p-1 text-xs border rounded"
              onChange={(e) => setFormData({...formData, busNumber: e.target.value})}
            >
              <option value="">Select TSRTC Route...</option>
              <option value="1">1 - Secunderabad to Afzalgunj</option>
              <option value="10">10 - Secunderabad to Kukatpally</option>
              <option value="18">18 - Secunderabad to Mehdipatnam</option>
              <option value="49M">49M - Secunderabad to Miyapur</option>
              <option value="218">218 - Secunderabad to Gachibowli</option>
              <option value="219">219 - JBS to Gachibowli</option>
              <option value="290">290 - JBS to HITEC City</option>
              <option value="290U">290U - JBS to Gachibowli (Express)</option>
              <option value="251">251 - Secunderabad to Ibrahimpatnam</option>
              <option value="280">280 - Mehdipatnam to Ibrahimpatnam</option>
              <option value="277D">277D - Dilsukhnagar to Ibrahimpatnam</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          {!isTracking ? (
            <Button onClick={trackBus} className="gradient-primary">
              <Play className="w-4 h-4 mr-2" />
              Start Real-Time Tracking
            </Button>
          ) : (
            <Button onClick={stopTracking} variant="destructive">
              <Square className="w-4 h-4 mr-2" />
              Stop Tracking
            </Button>
          )}
        </div>
      </Card>

      {/* Real-Time Map */}
      <Card className="p-6 bg-white border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-primary/10 mr-3">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-black">Live Map Tracking</h4>
              <p className="text-sm text-gray-800 font-medium">Hyderabad, Telangana</p>
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
        
        <div className="relative">
          <div 
            ref={mapRef}
            className="w-full h-96 rounded-3xl border-4 border-gradient-to-r from-blue-400/20 to-orange-400/20 shadow-2xl overflow-hidden relative"
            style={{ 
              minHeight: '500px', 
              background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe, #f0fdf4)',
              boxShadow: '0 32px 64px -12px rgba(59, 130, 246, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              border: '4px solid transparent',
              backgroundClip: 'padding-box'
            }}
          />

        </div>
        
        {/* Route Progress Bar - Below Map */}
        {isTracking && (
          <div className="mt-6 bg-gradient-to-br from-white/98 to-slate-50/95 backdrop-blur-xl rounded-3xl p-5 shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-white/40">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <span className="text-base font-bold bg-gradient-to-r from-slate-800 to-orange-600 bg-clip-text text-transparent">📋 Route Progress</span>
              </div>
              <div className="flex items-center text-sm text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Live Updates
              </div>
            </div>
            <div className="relative w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-full h-4 mb-4 overflow-hidden shadow-inner">
              <div className="bg-gradient-to-r from-slate-800 via-blue-600 to-orange-600 h-4 rounded-full transition-all duration-1000 relative overflow-hidden shadow-lg" style={{width: `${routeProgress}%`}}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-ping"></div>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <div className="flex items-center bg-gradient-to-r from-green-100 to-green-200 px-3 py-2 rounded-xl border border-green-300 shadow-sm">
                <span className="text-green-800 font-semibold">🟢 {formData.startPoint}</span>
              </div>
              <div className="flex items-center bg-gradient-to-r from-red-100 to-red-200 px-3 py-2 rounded-xl border border-red-300 shadow-sm">
                <span className="text-red-800 font-semibold">🔴 {formData.destination}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Enhanced Live Position Display */}
        {busPosition && (
          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <div className="flex items-center mb-2">
                <div className="relative mr-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-4 h-4 bg-blue-400 rounded-full animate-ping"></div>
                </div>
                <span className="font-semibold text-blue-800">Live Position</span>
              </div>
              <div className="text-xs text-blue-600 font-mono bg-white/50 p-2 rounded">
                📍 {busPosition.lat.toFixed(4)}, {busPosition.lng.toFixed(4)}
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
              <div className="flex items-center mb-2">
                <span className="text-green-600 mr-2">🎯</span>
                <span className="font-semibold text-green-800">Accuracy</span>
              </div>
              <div className={`text-sm font-bold ${
                accuracy <= 5 ? 'text-green-700' : 'text-blue-700'
              }`}>
                ±{accuracy.toFixed(1)}m
              </div>
              <div className="text-xs text-green-600 mt-1">
                {accuracy <= 5 ? 'Excellent' : 'Good'} Signal
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
              <div className="flex items-center mb-2">
                <span className="text-purple-600 mr-2">⚡</span>
                <span className="font-semibold text-purple-800">Status</span>
              </div>
              <div className="text-sm font-bold text-purple-700">
                Moving
              </div>
              <div className="text-xs text-purple-600 mt-1">
                Real-time Updates
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Results */}
      {trackingResult && (
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-4 bg-white border-gray-200">
            <h4 className="font-bold mb-3 flex items-center text-black">
              <Navigation className="w-4 h-4 mr-2 text-blue-600" />
              Bus Information
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-black font-medium">Bus Number:</span>
                <Badge variant="outline">{trackingResult.busNumber}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-black font-medium">Distance:</span>
                <span className="text-black font-semibold">{trackingResult.distance} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black font-medium">Status:</span>
                <Badge className="bg-green-100 text-green-800">
                  {isTracking ? 'Live Tracking' : trackingResult.status}
                </Badge>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white border-gray-200">
            <h4 className="font-bold mb-3 flex items-center text-black">
              <Clock className="w-4 h-4 mr-2 text-blue-600" />
              ETA Information
            </h4>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {trackingResult.eta} min
              </div>
              <p className="text-sm text-gray-800 font-medium">
                Estimated arrival time
              </p>
              <div className="mt-2 text-xs">
                <span className={`px-2 py-1 rounded ${confidence >= 0.9 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                  {(confidence * 100).toFixed(0)}% confidence
                </span>
              </div>
              {isTracking && (
                <div className="mt-2 text-xs text-blue-600">
                  🚌 Bus moving in real-time
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default RealTimeMapTracker;