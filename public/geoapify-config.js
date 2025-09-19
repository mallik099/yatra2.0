// Geoapify API Configuration for Telangana Bus Tracking
// Replace 'YOUR_API_KEY_HERE' with your actual Geoapify API key

const GEOAPIFY_CONFIG = {
    // Get your free API key from: https://www.geoapify.com/
    API_KEY: 'YOUR_GEOAPIFY_API_KEY_HERE',
    
    // API Endpoints
    GEOCODING_URL: 'https://api.geoapify.com/v1/geocode/search',
    ROUTING_URL: 'https://api.geoapify.com/v1/routing',
    TILES_URL: 'https://maps.geoapify.com/v1/tile/osm-bright',
    
    // Default settings for Telangana
    DEFAULT_LOCATION: {
        lat: 17.3850,
        lon: 78.4867,
        name: 'Hyderabad, Telangana'
    },
    
    // Bus route settings
    ROUTING_MODE: 'bus', // Use bus mode for public transport
    
    // Map settings
    MAP_ZOOM: 11,
    ROUTE_COLOR: '#3b82f6',
    ROUTE_WEIGHT: 5,
    
    // Popular Telangana locations for quick testing
    SAMPLE_LOCATIONS: [
        'Secunderabad Railway Station, Hyderabad',
        'Gachibowli, Hyderabad', 
        'HITEC City, Hyderabad',
        'Ameerpet Metro Station, Hyderabad',
        'Kukatpally, Hyderabad',
        'Dilsukhnagar, Hyderabad',
        'Begumpet Airport, Hyderabad',
        'Charminar, Hyderabad'
    ]
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GEOAPIFY_CONFIG;
}