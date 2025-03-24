'use client';

import { useState, useMemo } from 'react';
import { Place } from '../data/places';

interface CheesecakeFiltersProps {
  places: Place[];
}

const CheesecakeFilters: React.FC<CheesecakeFiltersProps> = ({ places }) => {
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Extract unique areas from places
  const areas = useMemo(() => {
    const areaSet = new Set<string>();
    
    places.forEach(place => {
      const addressParts = place.address.split(',');
      if (addressParts.length >= 2) {
        const area = addressParts[addressParts.length - 2].trim();
        areaSet.add(area);
      }
    });
    
    return ['all', ...Array.from(areaSet).sort()];
  }, [places]);

  // Filter places based on selected area and search query
  const filteredPlaces = useMemo(() => {
    return places.filter(place => {
      const matchesArea = selectedArea === 'all' || place.address.includes(selectedArea);
      const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           place.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (place.notes || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesArea && matchesSearch;
    });
  }, [places, selectedArea, searchQuery]);

  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-4">Filter Cheesecake Places</h2>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="w-full md:w-1/2">
            <label htmlFor="area-filter" className="block text-gray-700 mb-2">Filter by Area</label>
            <select 
              id="area-filter"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
            >
              {areas.map(area => (
                <option key={area} value={area}>
                  {area === 'all' ? 'All Areas' : area}
                </option>
              ))}
            </select>
          </div>
          
          <div className="w-full md:w-1/2">
            <label htmlFor="search-filter" className="block text-gray-700 mb-2">Search</label>
            <input 
              id="search-filter"
              type="text"
              placeholder="Search by name or address..."
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlaces.length > 0 ? (
          filteredPlaces.map((place) => (
            <div key={place.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-bold mb-2">{place.id}. {place.name}</h2>
              <p className="text-gray-600 mb-3">📍 {place.address}</p>
              {place.notes && (
                <p className="text-gray-700 italic">💡 {place.notes}</p>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-8">
            <p className="text-xl text-gray-500">No cheesecake places found for your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheesecakeFilters; 