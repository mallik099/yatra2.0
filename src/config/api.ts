// Development API URL constant
const DEV_API_URL = 'http://localhost:5000/api';

// API Configuration
export const API_CONFIG = {
  // Set to true to use mock data, false to use real API
  USE_MOCK_API: import.meta.env.VITE_USE_MOCK_API === 'true' || true,
  
  // Real API endpoints (when available)
  API_BASE_URL: import.meta.env.VITE_API_URL || DEV_API_URL,
  
  // Mock API settings
  MOCK_UPDATE_INTERVAL: 10000, // 10 seconds
  
  // Free API alternatives you can try:
  // 1. JSONPlaceholder: https://jsonplaceholder.typicode.com/
  // 2. MockAPI: https://mockapi.io/
  // 3. Reqres: https://reqres.in/
  // 4. JSONBin: https://jsonbin.io/
  
  // Example with JSONBin (free tier available)
  JSONBIN_API_KEY: 'YOUR_JSONBIN_API_KEY', // Get from https://jsonbin.io/
  JSONBIN_BIN_ID: 'YOUR_BIN_ID',
  
  // Example with MockAPI (free tier available)
  MOCKAPI_PROJECT_ID: 'YOUR_PROJECT_ID', // Get from https://mockapi.io/
};

// Helper to get API URL based on environment
export const getApiUrl = () => {
  if (API_CONFIG.USE_MOCK_API) {
    return null; // Use mock service
  }
  
  // Check if we're in development or production
  if (import.meta.env.DEV) {
    return DEV_API_URL;
  }
  
  return import.meta.env.VITE_API_URL || API_CONFIG.API_BASE_URL;
};