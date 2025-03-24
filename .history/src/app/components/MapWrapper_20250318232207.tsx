'use client';

import dynamic from 'next/dynamic';
import { Place } from '../data/places';

// Dynamically import the CheesecakeMap component with no SSR
// This is necessary because Leaflet requires browser APIs
const CheesecakeMap = dynamic(() => import('./CheesecakeMap'), {
  ssr: false,
  loading: () => <div className="h-[80vh] w-full bg-gray-100 flex items-center justify-center">Loading Map...</div>
});

interface MapWrapperProps {
  places: Place[];
}

const MapWrapper: React.FC<MapWrapperProps> = ({ places }) => {
  return <CheesecakeMap places={places} />;
};

export default MapWrapper; 