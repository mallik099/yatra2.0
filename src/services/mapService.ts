const MAPBOX_TOKEN = '6f29c1730f38480781df0b18a3214140';

export const geocodeAddress = async (address: string): Promise<[number, number] | null> => {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_TOKEN}&limit=1`
    );
    
    if (!response.ok) throw new Error('Geocoding failed');
    
    const data = await response.json();
    const coordinates = data.features[0]?.geometry.coordinates;
    
    return coordinates ? [coordinates[0], coordinates[1]] : null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

export const getDirections = async (
  start: [number, number], 
  end: [number, number]
): Promise<any> => {
  try {
    const response = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${MAPBOX_TOKEN}`
    );
    
    if (!response.ok) throw new Error('Directions failed');
    
    const data = await response.json();
    return data.routes[0] || null;
  } catch (error) {
    console.error('Directions error:', error);
    return null;
  }
};