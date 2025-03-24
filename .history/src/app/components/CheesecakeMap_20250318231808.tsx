'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Place } from '../data/places';

// You need to include the Leaflet CSS in the client-side component
import 'leaflet/dist/leaflet.css';

interface CheesecakeMapProps {
  places: Place[];
}

const CheesecakeMap: React.FC<CheesecakeMapProps> = ({ places }) => {
  const [isMounted, setIsMounted] = useState(false);

  // This handles the issue with SSR and Leaflet
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Custom marker icon
  const customIcon = new Icon({
    iconUrl: '/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  // Center of Hyderabad
  const hyderabadCenter: [number, number] = [17.3850, 78.4867];

  if (!isMounted) {
    return <div className="h-[80vh] w-full bg-gray-100 flex items-center justify-center">Loading Map...</div>;
  }

  return (
    <div className="h-[80vh] w-full">
      <MapContainer 
        center={hyderabadCenter} 
        zoom={12} 
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {places.map((place) => (
          <Marker
            key={place.id}
            position={place.coordinates}
            icon={customIcon}
          >
            <Popup>
              <div>
                <h3 className="font-bold text-lg">{place.name}</h3>
                <p className="text-sm mt-1">{place.address}</p>
                {place.notes && (
                  <p className="text-sm mt-2 italic">{place.notes}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default CheesecakeMap; 