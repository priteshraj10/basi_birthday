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
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showDirections, setShowDirections] = useState(false);
  const [directionsInfo, setDirectionsInfo] = useState<{ distance?: string; duration?: string } | null>(null);
  const [locationStatus, setLocationStatus] = useState<'loading' | 'granted' | 'denied' | 'unavailable'>('loading');
  const [placesApiAvailable, setPlacesApiAvailable] = useState(false);

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

    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationStatus('granted');
        },
        (error) => {
          // This is an expected error when user denies permission
          console.log("Location access: User denied Geolocation - using default center");
          
          // Set appropriate status based on error
          if (error.code === 1) { // PERMISSION_DENIED
            setLocationStatus('denied');
          } else {
            setLocationStatus('unavailable');
          }
          
          // Use default center as fallback
          setUserLocation({
            lat: mapConfig.DEFAULT_CENTER.lat,
            lng: mapConfig.DEFAULT_CENTER.lng
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
      setLocationStatus('unavailable');
      // Use default center as fallback
      setUserLocation({
        lat: mapConfig.DEFAULT_CENTER.lat,
        lng: mapConfig.DEFAULT_CENTER.lng
      });
    }

    loadMapScript();

    return () => {
      // Clean up the global function when component unmounts
      window.initGoogleMaps = () => {};
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
  }, [scriptLoaded, places, selectedPlace, showDirections, userLocation]);
  
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
    // Add map ID for Advanced Markers support
    mapElement.setAttribute('map-id', mapConfig.GOOGLE_MAP_ID || ''); 
    mapRef.current.appendChild(mapElement);
    
    // Only add place picker if Places API is available - wrapped in try/catch
    if (placesApiAvailable) {
      try {
        // Create place picker container
        const controlDiv = document.createElement('div');
        controlDiv.setAttribute('slot', 'control-block-start-inline-start');
        controlDiv.className = 'place-picker-container';
        mapElement.appendChild(controlDiv);
        
        // Create place picker
        const placePicker = document.createElement('gmpx-place-picker');
        placePicker.setAttribute('placeholder', 'Search for cheesecake places');
        
        // Add error handling for place picker
        placePicker.addEventListener('error', (event) => {
          console.log('Place picker error detected:', event);
          setPlacesApiAvailable(false);
        });
        
        controlDiv.appendChild(placePicker);
      } catch (error) {
        console.log('Error creating place picker:', error);
        setPlacesApiAvailable(false);
      }
    }

    // Add user location marker if available
    if (userLocation) {
      const userMarker = document.createElement('gmp-advanced-marker');
      userMarker.setAttribute('position', `${userLocation.lat},${userLocation.lng}`);
      userMarker.setAttribute('title', 'Your Location');
      
      // Create a blue dot icon for user location
      const userIcon = document.createElement('div');
      userIcon.className = 'user-location-marker';
      userMarker.appendChild(userIcon);
      
      mapElement.appendChild(userMarker);
    }
    
    // Add directions if we have a selected place and user location
    if (showDirections && selectedPlace && userLocation) {
      const routeElement = document.createElement('gmpx-route-overview');
      routeElement.setAttribute('travel-mode', 'driving');
      
      // Origin is user's location
      routeElement.setAttribute('origin', `${userLocation.lat},${userLocation.lng}`);
      
      // Destination is the selected place
      routeElement.setAttribute('destination', `${selectedPlace.coordinates[0]},${selectedPlace.coordinates[1]}`);
      
      mapElement.appendChild(routeElement);
      
      // Listen for the route data to update directions info
      routeElement.addEventListener('gmpx-routeupdate', (event) => {
        // @ts-expect-error - custom event detail
        const routeData = event.detail?.routes?.[0]?.legs?.[0];
        if (routeData) {
          setDirectionsInfo({
            distance: routeData.distance?.text,
            duration: routeData.duration?.text
          });
        }
      });
    }
    
    // Create markers for all cheesecake places
    places.forEach(place => {
      const marker = document.createElement('gmp-advanced-marker');
      marker.setAttribute('position', `${place.coordinates[0]},${place.coordinates[1]}`);
      marker.setAttribute('title', place.name);
      
      // Highlight the selected place marker
      if (selectedPlace && selectedPlace.id === place.id) {
        marker.setAttribute('highlighted', 'true');
      }
      
      // Add click event to show info
      marker.addEventListener('click', () => {
        setSelectedPlace(place);
        setShowDirections(false);
        
        // Create info window when marker is clicked
        if (window.google && window.google.maps) {
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 8px;">
                <h3 style="font-weight: bold; margin-bottom: 5px;">${place.name}</h3>
                <p style="margin-bottom: 5px;">📍 ${place.address}</p>
                ${place.notes ? `<p style="font-style: italic; margin-bottom: 5px;">${place.notes}</p>` : ''}
                ${userLocation ? `<button id="get-directions-btn" style="background-color: #EC4899; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">Get Directions</button>` : ''}
              </div>
            `
          });
          
          // We need to access the underlying Google Map instance
          // @ts-expect-error - innerMap is not in the type definitions but exists in the component
          const map = mapElement.innerMap;
          if (map) {
            // Set the position before opening
            infoWindow.setPosition({ lat: place.coordinates[0], lng: place.coordinates[1] });
            // Then open the infowindow on the map
            infoWindow.open(map);
            
            // Add event listener for the directions button after the info window is opened
            setTimeout(() => {
              const directionsButton = document.getElementById('get-directions-btn');
              if (directionsButton) {
                directionsButton.addEventListener('click', () => {
                  setShowDirections(true);
                  infoWindow.close();
                });
              }
            }, 300);
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
      
      {/* API notification */}
      {!placesApiAvailable && (
        <div className="absolute bottom-4 left-4 bg-yellow-50 border border-yellow-200 p-3 rounded-lg shadow-md z-[1000] max-w-sm">
          <div className="flex items-start">
            <div className="text-yellow-500 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Search functionality disabled</p>
              <p className="text-xs text-gray-500 mt-1">
                To enable search, activate the Places API in your Google Cloud Console.
                Once enabled, click the button below.
              </p>
              <button
                onClick={() => setPlacesApiAvailable(true)}
                className="mt-2 bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-2 rounded"
              >
                I&apos;ve enabled Places API
              </button>
            </div>
            <button 
              onClick={() => {}} 
              className="ml-2 text-gray-400 hover:text-gray-600 invisible"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      
      {/* Location notification */}
      {locationStatus === 'denied' && (
        <div className="absolute top-4 left-4 bg-yellow-50 border border-yellow-200 p-3 rounded-lg shadow-md z-[1000] max-w-sm">
          <div className="flex items-start">
            <div className="text-yellow-500 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Location access denied</p>
              <p className="text-xs text-gray-500 mt-1">Using default Hyderabad center. Enable location for directions from your position.</p>
            </div>
            <button 
              onClick={() => setLocationStatus('loading')} 
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      
      {/* Directions panel */}
      {showDirections && selectedPlace && directionsInfo && (
        <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg z-[1000] max-w-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">Directions to {selectedPlace.name}</h3>
            <button 
              onClick={() => setShowDirections(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div>
            {directionsInfo && (
              <>
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span>Distance: {directionsInfo.distance || 'Calculating...'}</span>
                  <span>Duration: {directionsInfo.duration || 'Calculating...'}</span>
                </div>
                <p className="text-xs text-gray-500">
                  Follow the blue route on the map for driving directions.
                </p>
              </>
            )}
          </div>
        </div>
      )}
      
      <style jsx global>{`
        .place-picker-container {
          padding: 10px;
          max-width: 300px;
        }
        
        gmpx-place-picker {
          width: 100%;
        }
        
        .user-location-marker {
          background-color: #4285F4;
          border: 2px solid white;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
        
        gmpx-route-overview {
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
};

// Add a declaration for the global initialization function
declare global {
  interface Window {
    initGoogleMaps: () => void;
    google?: typeof google;
  }
}

export default GoogleComponentMap;