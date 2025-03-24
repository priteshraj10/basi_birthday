'use client';

import { Place } from '../data/places';
import dynamic from 'next/dynamic';

// Dynamically import the GoogleCheesecakeMap component
// This is necessary because it requires browser APIs
const GoogleCheesecakeMap = dynamic(() => import('./GoogleCheesecakeMap'), {
  ssr: false,
  loading: () => <div className="h-[80vh] w-full bg-gray-100 flex items-center justify-center">Loading Map...</div>
});

interface MapWrapperProps {
  places: Place[];
}

const MapWrapper: React.FC<MapWrapperProps> = ({ places }) => {
  return <GoogleCheesecakeMap places={places} />;
};

export default MapWrapper; 