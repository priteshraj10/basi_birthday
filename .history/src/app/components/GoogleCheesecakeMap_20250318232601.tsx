'use client';

import { useState, useCallback, useEffect } from 'react';
import { GoogleMap, Marker, InfoWindow, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';
import { Place } from '../data/places';

// Google Maps API styles for a cleaner look
const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

// Center of Hyderabad
const hyderabadCenter = {
  lat: 17.3850,
  lng: 78.4867
};

// Default map options
const defaultOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: true,
  streetViewControl: true,
  fullscreenControl: true,
};

// Google Maps API Key - Replace with your own key
// You'll need to enable Maps JavaScript API and Directions API
const GOOGLE_MAPS_API_KEY = "YOUR_API_KEY_HERE";

interface GoogleCheesecakeMapProps {
  places: Place[];
}

const GoogleCheesecakeMap: React.FC<GoogleCheesecakeMapProps> = ({ places }) => {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isInfoWindowOpen, setIsInfoWindowOpen] = useState(false);

  // Load the Google Maps JavaScript API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  });

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  }, []);

  // Callback when the map loads
  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  // Generate route directions
  const getDirections = useCallback((place: Place) => {
    if (!userLocation) return;
    
    const directionsService = new google.maps.DirectionsService();
    
    directionsService.route(
      {
        origin: userLocation,
        destination: { lat: place.coordinates[0], lng: place.coordinates[1] },
        travelMode: google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirections(result);
          setIsInfoWindowOpen(false);
        } else {
          console.error(`Error fetching directions: ${status}`);
        }
      }
    );
  }, [userLocation]);

  // Clear directions
  const clearDirections = useCallback(() => {
    setDirections(null);
  }, []);

  // Show error if Google Maps fails to load
  if (loadError) {
    return <div className="h-[80vh] w-full bg-red-100 flex items-center justify-center text-red-600">
      Error loading Google Maps. Please check your API key and network connection.
    </div>;
  }

  // Show loading state while Google Maps loads
  if (!isLoaded) {
    return <div className="h-[80vh] w-full bg-gray-100 flex items-center justify-center">
      Loading Google Maps...
    </div>;
  }

  return (
    <div className="h-[80vh] w-full relative">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={userLocation || hyderabadCenter}
        zoom={12}
        options={defaultOptions}
        onLoad={onMapLoad}
      >
        {/* User's location marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              scaledSize: new google.maps.Size(40, 40)
            }}
          />
        )}

        {/* Cheesecake place markers */}
        {places.map((place) => (
          <Marker
            key={place.id}
            position={{ lat: place.coordinates[0], lng: place.coordinates[1] }}
            onClick={() => {
              setSelectedPlace(place);
              setIsInfoWindowOpen(true);
            }}
          />
        ))}

        {/* Info window for selected place */}
        {selectedPlace && isInfoWindowOpen && (
          <InfoWindow
            position={{ lat: selectedPlace.coordinates[0], lng: selectedPlace.coordinates[1] }}
            onCloseClick={() => setIsInfoWindowOpen(false)}
          >
            <div className="p-2 max-w-[300px]">
              <h3 className="font-bold text-lg mb-1">{selectedPlace.name}</h3>
              <p className="text-sm mb-2">📍 {selectedPlace.address}</p>
              {selectedPlace.notes && (
                <p className="text-sm italic mb-2">💡 {selectedPlace.notes}</p>
              )}
              {userLocation && (
                <button
                  onClick={() => getDirections(selectedPlace)}
                  className="px-3 py-1 bg-pink-500 text-white rounded-md text-sm hover:bg-pink-600 transition-colors"
                >
                  Get Directions
                </button>
              )}
            </div>
          </InfoWindow>
        )}

        {/* Show directions if available */}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              polylineOptions: {
                strokeColor: '#6366F1',
                strokeWeight: 5
              }
            }}
          />
        )}
      </GoogleMap>

      {/* Directions panel */}
      {directions && (
        <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg z-[1000] max-w-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">
              {selectedPlace ? `Directions to ${selectedPlace.name}` : 'Directions'}
            </h3>
            <button
              onClick={clearDirections}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div>
            {directions.routes[0]?.legs[0] && (
              <>
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span>Distance: {directions.routes[0].legs[0].distance?.text}</span>
                  <span>Duration: {directions.routes[0].legs[0].duration?.text}</span>
                </div>
                <p className="text-xs text-gray-500">
                  Follow the route shown on the map. For turn-by-turn navigation, open in Google Maps.
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* API Key Notice */}
      <div className="absolute bottom-4 left-4 bg-white p-2 rounded-md shadow-md z-[1000] text-xs text-gray-600">
        <p>Note: You need to add your Google Maps API Key in the component.</p>
      </div>
    </div>
  );
};

export default GoogleCheesecakeMap; 