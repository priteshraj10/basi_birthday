import dynamic from 'next/dynamic';
import { cheesecakePlaces } from './data/places';
import CheesecakeFilters from './components/CheesecakeFilters';

// Dynamically import the CheesecakeMap component with no SSR
// This is necessary because Leaflet requires browser APIs
const CheesecakeMap = dynamic(() => import('./components/CheesecakeMap'), {
  ssr: false,
  loading: () => <div className="h-[80vh] w-full bg-gray-100 flex items-center justify-center">Loading Map...</div>
});

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gradient-to-r from-pink-500 to-orange-500 text-white p-6 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-2">Top 24 Places for Cheesecake in Hyderabad</h1>
          <p className="text-lg">Discover the best cheesecake spots in the city</p>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <CheesecakeMap places={cheesecakePlaces} />
        </div>

        <CheesecakeFilters places={cheesecakePlaces} />
      </main>

      <footer className="bg-gray-800 text-white p-6">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} Hyderabad Cheesecake Map</p>
          <p className="text-gray-400 mt-2">Find the perfect cheesecake in Hyderabad</p>
        </div>
      </footer>
    </div>
  );
}
