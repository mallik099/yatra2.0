export const MAPBOX_TOKEN = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

export const mapboxConfig = {
  style: 'mapbox://styles/mapbox/streets-v12',
  center: [78.4867, 17.3850] as [number, number], // Hyderabad, Telangana coordinates
  zoom: 11,
  pitch: 0,
  bearing: 0
};

export const telanganaLocations = {
  hyderabad: [78.4867, 17.3850],
  secunderabad: [78.5014, 17.4399],
  hitec_city: [78.3684, 17.4485],
  gachibowli: [78.3648, 17.4399],
  kukatpally: [78.4089, 17.4851],
  dilsukhnagar: [78.5242, 17.3687],
  ameerpet: [78.4482, 17.4374],
  begumpet: [78.4672, 17.4435]
};

export const geocodeAddress = async (address: string) => {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_TOKEN}&limit=1`
    );
    const data = await response.json();
    return data.features[0]?.geometry.coordinates || null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

export const getRoute = async (start: [number, number], end: [number, number]) => {
  try {
    const response = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${MAPBOX_TOKEN}`
    );
    const data = await response.json();
    return data.routes[0] || null;
  } catch (error) {
    console.error('Routing error:', error);
    return null;
  }
};