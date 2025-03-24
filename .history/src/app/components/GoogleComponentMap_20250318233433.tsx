'use client';

import { useEffect, useRef, useState } from 'react';
import { Place } from '../data/places';
import mapConfig from '../config/maps';

interface GoogleComponentMapProps {
  places: Place[];
}

const GoogleComponentMap: React.FC<GoogleComponentMapProps> = ({ places }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  // Load the Google Maps Extended Component Library script
  useEffect(() => {
    const loadMapScript = () => {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://ajax.googleapis.com/ajax/libs/@googlemaps/extended-component-library/0.6.11/index.min.js';
      script.async = true;
      script.onload = () => {
        setScriptLoaded(true);
      };
      document.body.appendChild(script);
    };

    // Add global initialization function for Google Maps components
    window.initGoogleMaps = () => {
      console.log('Google Maps components initialized');
    };

    loadMapScript();

    return () => {
      // Clean up the global function when component unmounts
      delete window.initGoogleMaps;
    };
  }, []);

  // Initialize map components once script is loaded
  useEffect(() => {
    if (!scriptLoaded || !mapRef.current) return;

    // Create API loader element
    const apiLoader = document.createElement('gmpx-api-loader');
    apiLoader.setAttribute('key', mapConfig.GOOGLE_MAPS_API_KEY);
    apiLoader.setAttribute('solution-channel', 'GMP_GE_hyderabadcheesecakemap_v1');
    
    // Add it to the DOM before other map elements
    mapRef.current.appendChild(apiLoader);

    // Initialize Google Maps components
    const initComponents = async () => {
      try {
        // Wait for web components to be defined
        await customElements.whenDefined('gmp-map');
        
        // Create map and markers once elements are defined
        createMapAndMarkers();
      } catch (error) {
        console.error('Error initializing Google Maps components:', error);
      }
    };

    initComponents();
  }, [scriptLoaded, places]);
  
  const createMapAndMarkers = () => {
    if (!mapRef.current) return;
    
    // Clear any existing content
    while (mapRef.current.firstChild) {
      mapRef.current.removeChild(mapRef.current.firstChild);
    }
    
    // Create API loader element again
    const apiLoader = document.createElement('gmpx-api-loader');
    apiLoader.setAttribute('key', mapConfig.GOOGLE_MAPS_API_KEY);
    apiLoader.setAttribute('solution-channel', 'GMP_GE_hyderabadcheesecakemap_v1');
    mapRef.current.appendChild(apiLoader);
    
    // Create map element
    const mapElement = document.createElement('gmp-map');
    mapElement.setAttribute('center', `${mapConfig.DEFAULT_CENTER.lat},${mapConfig.DEFAULT_CENTER.lng}`);
    mapElement.setAttribute('zoom', mapConfig.DEFAULT_ZOOM.toString());
    mapElement.setAttribute('map-id', 'DEMO_MAP_ID');
    mapRef.current.appendChild(mapElement);
    
    // Create place picker container
    const controlDiv = document.createElement('div');
    controlDiv.setAttribute('slot', 'control-block-start-inline-start');
    controlDiv.className = 'place-picker-container';
    mapElement.appendChild(controlDiv);
    
    // Create place picker
    const placePicker = document.createElement('gmpx-place-picker');
    placePicker.setAttribute('placeholder', 'Search for cheesecake places');
    controlDiv.appendChild(placePicker);
    
    // Create markers for all cheesecake places
    places.forEach(place => {
      const marker = document.createElement('gmp-advanced-marker');
      marker.setAttribute('position', `${place.coordinates[0]},${place.coordinates[1]}`);
      marker.setAttribute('title', place.name);
      
      // Add click event to show info
      marker.addEventListener('click', () => {
        setSelectedPlace(place);
        
        // Create info window when marker is clicked
        if (window.google && window.google.maps) {
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 8px;">
                <h3 style="font-weight: bold; margin-bottom: 5px;">${place.name}</h3>
                <p style="margin-bottom: 5px;">📍 ${place.address}</p>
                ${place.notes ? `<p style="font-style: italic;">${place.notes}</p>` : ''}
              </div>
            `
          });
          
          // We need to access the underlying Google Map instance
          // @ts-ignore - innerMap is not in the type definitions but exists in the component
          const map = mapElement.innerMap;
          if (map) {
            // @ts-ignore - position property access
            infoWindow.open(map, { position: { lat: place.coordinates[0], lng: place.coordinates[1] } });
          }
        }
      });
      
      mapElement.appendChild(marker);
    });
  };

  return (
    <div className="h-[80vh] w-full relative">
      <div 
        ref={mapRef} 
        className="h-full w-full"
      />
      <style jsx global>{`
        .place-picker-container {
          padding: 10px;
          max-width: 300px;
        }
        
        gmpx-place-picker {
          width: 100%;
        }
      `}</style>
    </div>
  );
};

// Add a declaration for the global initialization function
declare global {
  interface Window {
    initGoogleMaps: () => void;
  }
}

export default GoogleComponentMap; 