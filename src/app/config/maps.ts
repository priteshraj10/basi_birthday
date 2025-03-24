// Google Maps API Configuration
// Set your API key here to use with Google Maps
// You'll need to enable the following APIs in the Google Cloud Console:
// - Maps JavaScript API
// - Directions API
// - Places API
// - Maps Embed API

const config = {
  // Replace with your Google Maps API key
  GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyDtwrQsbuoFkFBNsaLbxpoDjJuOAUz4WfM",
  
  // Map ID for Advanced Markers support
  GOOGLE_MAP_ID: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID || "8f075145e42d8f47",
  
  // Default map center (Hyderabad)
  DEFAULT_CENTER: {
    lat: 17.3850,
    lng: 78.4867
  },
  
  // Default zoom level
  DEFAULT_ZOOM: 12,
  
  // Library options for Google Maps
  LIBRARIES: ['places', 'geometry', 'drawing'],

  // Help text to display if API key is not set
  API_KEY_HELP_TEXT: `
    To use Google Maps:
    1. Get an API key from Google Cloud Console
    2. Enable the following APIs:
       - Maps JavaScript API
       - Directions API
       - Places API
       - Maps Embed API
    3. Set it as NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your .env file or
       replace the placeholder in the config file
    4. Create a Map ID in the Google Cloud Console and set it as NEXT_PUBLIC_GOOGLE_MAP_ID
  `
};

export default config; 