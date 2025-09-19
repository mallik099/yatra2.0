import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';

const MAPBOX_TOKEN = '6f29c1730f38480781df0b18a3214140';
mapboxgl.accessToken = MAPBOX_TOKEN;

export const useMapbox = (containerId: string) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [78.4867, 17.3850], // Hyderabad, Telangana
        zoom: 12
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.current.addControl(new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true
      }), 'top-right');

      map.current.on('load', () => setIsLoaded(true));

    } catch (error) {
      console.error('Map initialization error:', error);
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  return { mapContainer, map: map.current, isLoaded };
};