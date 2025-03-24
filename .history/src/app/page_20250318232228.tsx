import { cheesecakePlaces } from './data/places';
import CheesecakeFilters from './components/CheesecakeFilters';
import MapWrapper from './components/MapWrapper';

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
          <MapWrapper places={cheesecakePlaces} />
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
