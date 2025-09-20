export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const DEFAULT_CENTER = {
  lat: 17.3850,
  lng: 78.4867
}; // Hyderabad center (Charminar area)

export const DEFAULT_ZOOM = 13;

// Telangana major cities for future expansion
export const TELANGANA_CITIES = [
  { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
  { name: 'Warangal', lat: 17.9689, lng: 79.5941 },
  { name: 'Nizamabad', lat: 18.6725, lng: 78.0941 },
  { name: 'Karimnagar', lat: 18.4386, lng: 79.1288 },
  { name: 'Khammam', lat: 17.2473, lng: 80.1514 }
];