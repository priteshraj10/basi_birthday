'use client';

import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import { Icon, LatLng } from 'leaflet';
import { Place } from '../data/places';
import L from 'leaflet';

// You need to include the Leaflet CSS in the client-side component
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// We need to import the routing machine dynamically because it requires the window object
let RoutingMachine: any;

interface CheesecakeMapProps {
  places: Place[];
}

// This component will handle the routing functionality
const Routing = ({ from, to }: { from: L.LatLng; to: L.LatLng }) => {
  const map = useMap();
  const routingControlRef = useRef<any>(null);

  useEffect(() => {
    // Dynamic import of the routing machine
    const importRoutingMachine = async () => {
      if (typeof window !== 'undefined') {
        try {
          // We need to require the routing machine here because it uses browser-specific APIs
          RoutingMachine = require('leaflet-routing-machine');
          
          if (routingControlRef.current) {
            map.removeControl(routingControlRef.current);
          }
          
          routingControlRef.current = L.Routing.control({
            waypoints: [from, to],
            lineOptions: {
              styles: [{ color: '#6366F1', weight: 4 }],
              extendToWaypoints: true,
              missingRouteTolerance: 0
            },
            routeWhileDragging: true,
            fitSelectedRoutes: true,
            showAlternatives: false
          }).addTo(map);

          return () => {
            if (routingControlRef.current) {
              map.removeControl(routingControlRef.current);
            }
          };
        } catch (error) {
          console.error("Error loading routing machine:", error);
        }
      }
    };

    importRoutingMachine();

    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }
    };
  }, [map, from, to]);

  return null;
};

const CheesecakeMap: React.FC<CheesecakeMapProps> = ({ places }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [userLocation, setUserLocation] = useState<L.LatLng | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isRoutingActive, setIsRoutingActive] = useState(false);

  // This handles the issue with SSR and Leaflet
  useEffect(() => {
    setIsMounted(true);

    // Get the user's current location if they allow it
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation(new LatLng(position.coords.latitude, position.coords.longitude));
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  }, []);

  // Custom marker icon - using a cake emoji as the icon content for a unique look
  const customIcon = new Icon({
    iconUrl: '/marker-icon.png',
    shadowUrl: '/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // User location marker icon
  const userIcon = new Icon({
    iconUrl: '/marker-icon-2x.png',
    shadowUrl: '/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // Center of Hyderabad
  const hyderabadCenter: [number, number] = [17.3850, 78.4867];

  const handleGetDirections = (place: Place) => {
    setSelectedPlace(place);
    setIsRoutingActive(true);
  };

  const handleClearDirections = () => {
    setSelectedPlace(null);
    setIsRoutingActive(false);
  };

  if (!isMounted) {
    return <div className="h-[80vh] w-full bg-gray-100 flex items-center justify-center">Loading Map...</div>;
  }

  return (
    <div className="h-[80vh] w-full relative">
      <MapContainer 
        center={hyderabadCenter} 
        zoom={12} 
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false} // We'll add zoom control in a better position
      >
        <ZoomControl position="bottomright" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Display user location if available */}
        {userLocation && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup>
              <div>
                <h3 className="font-bold text-lg">Your Location</h3>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Display all cheesecake places */}
        {places.map((place) => (
          <Marker
            key={place.id}
            position={place.coordinates}
            icon={customIcon}
          >
            <Popup>
              <div>
                <h3 className="font-bold text-lg">{place.name}</h3>
                <p className="text-sm mt-1">📍 {place.address}</p>
                {place.notes && (
                  <p className="text-sm mt-2 italic">💡 {place.notes}</p>
                )}
                {userLocation && (
                  <button 
                    onClick={() => handleGetDirections(place)}
                    className="mt-3 px-3 py-1 bg-pink-500 text-white rounded-md text-sm hover:bg-pink-600 transition-colors"
                  >
                    Get Directions
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Add routing if active */}
        {isRoutingActive && userLocation && selectedPlace && (
          <Routing 
            from={userLocation} 
            to={new LatLng(selectedPlace.coordinates[0], selectedPlace.coordinates[1])} 
          />
        )}
      </MapContainer>
      
      {/* Directions panel */}
      {isRoutingActive && selectedPlace && (
        <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg z-[1000] max-w-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">Directions to {selectedPlace.name}</h3>
            <button 
              onClick={handleClearDirections}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-gray-600">Follow the blue route on the map</p>
          <p className="text-xs mt-2 text-gray-500">Distance and turn-by-turn directions will appear on the left side of the map</p>
        </div>
      )}
    </div>
  );
};

export default CheesecakeMap; 