// TypeScript interfaces for better type safety
export interface BusData {
  busNumber: string;
  currentLocation: {
    lat: number;
    lng: number;
  };
  route: {
    source: string;
    destination: string;
    nextStop: string;
  };
  eta: string;
  fare: number;
}

// Telangana State Road Transport Corporation (TSRTC) sample data
export const sampleBuses: BusData[] = [
  {
    busNumber: "100K",
    currentLocation: {
      lat: 17.4416, // Secunderabad Railway Station
      lng: 78.5009
    },
    route: {
      source: "Secunderabad",
      destination: "Koti",
      nextStop: "Paradise Circle"
    },
    eta: "8 mins",
    fare: 25
  },
  {
    busNumber: "156",
    currentLocation: {
      lat: 17.3616, // Mehdipatnam
      lng: 78.4747
    },
    route: {
      source: "Mehdipatnam",
      destination: "KPHB",
      nextStop: "Tolichowki"
    },
    eta: "12 mins",
    fare: 35
  },
  {
    busNumber: "290U",
    currentLocation: {
      lat: 17.3510, // LB Nagar
      lng: 78.5532
    },
    route: {
      source: "LB Nagar",
      destination: "Gachibowli",
      nextStop: "Dilsukhnagar"
    },
    eta: "15 mins",
    fare: 40
  },
  {
    busNumber: "218",
    currentLocation: {
      lat: 17.4065, // Ameerpet
      lng: 78.4482
    },
    route: {
      source: "Ameerpet",
      destination: "Uppal",
      nextStop: "SR Nagar"
    },
    eta: "6 mins",
    fare: 30
  }
];

// Popular Hyderabad bus stops
export const popularStops = [
  "Secunderabad Railway Station",
  "Ameerpet Metro Station",
  "Hitech City",
  "Gachibowli",
  "Mehdipatnam",
  "KPHB Colony",
  "LB Nagar",
  "Dilsukhnagar",
  "Jubilee Hills",
  "Banjara Hills",
  "Kukatpally",
  "Uppal",
  "Koti",
  "Abids",
  "Charminar"
];