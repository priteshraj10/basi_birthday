'use client';

import { Place } from '../data/places';
import dynamic from 'next/dynamic';

// Dynamically import the GoogleComponentMap (using web components)
// This is necessary because it requires browser APIs
const GoogleComponentMap = dynamic(() => import('./GoogleComponentMap'), {
  ssr: false,
  loading: () => <div className="h-[80vh] w-full bg-gray-100 flex items-center justify-center">Loading Map...</div>
});

interface MapWrapperProps {
  places: Place[];
}

const MapWrapper: React.FC<MapWrapperProps> = ({ places }) => {
  return <GoogleComponentMap places={places} />;
};

export default MapWrapper; 