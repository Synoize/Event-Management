import { useState, useEffect } from 'react';
import { useEvents } from '../contexts/EventContext';
import EventCard from '../components/EventCard';
import { useParams } from 'react-router-dom';
import { assets, cities } from '../assets/assets';

const Events = () => {
  const { city } = useParams();
  const eventCity = localStorage.getItem("eventCity");
  const { getEventsByCity, searchEvents, getAllEvents, events, loading } = useEvents();
  const [filters, setFilters] = useState({
    q: '',
    category: '',
    city: '',
    isFree: '',
  });

  useEffect(() => {
    const currentCity = city || eventCity || '';
    if (currentCity) {
      getEventsByCity(currentCity);
    } else {
      // No city specified - load all published events
      getAllEvents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city, eventCity]);

  const handleSearch = (e) => {
    e.preventDefault();
    searchEvents(filters);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="relative w-full h-40 md:h-64 rounded-xl mb-6 overflow-hidden group flex items-center justify-center">
          <img
            src={assets.explore_events}
            alt="Explore Events"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition duration-300"></div>
          <div className='relative z-20 flex flex-col text-center'>
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-extrabold text-white tracking-wide px-4">
              Discover Events
            </h1>
            <p className='text-white text-sm md:text-lg px-8'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab. </p>
          </div>

        </div>


        <form onSubmit={handleSearch} className="p-2 flex flex-col md:flex-row md:items-end md:space-x-4 space-y-4 md:space-y-0 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <input
              type="text"
              placeholder="Search events..."
              value={filters.q}
              onChange={(e) => handleFilterChange('q', e.target.value)}
              className="col-span-2 px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-1 focus:ring-primary-orange focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Category"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="md:col-span-1 col-span-2 px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-1 focus:ring-primary-orange focus:border-transparent"
            />
            <select
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              className="col-span-1 px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-1 focus:ring-primary-orange focus:border-transparent"
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city.charAt(0).toUpperCase() + city.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={filters.isFree}
              onChange={(e) => handleFilterChange('isFree', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-1 focus:ring-primary-orange focus:border-transparent"
            >
              <option value="">All Events</option>
              <option value="true">Free Events</option>
              <option value="false">Paid Events</option>
            </select>
          </div>
          <button
            type="submit"
            className="mt-4 bg-primary-pink/90 hover:bg-primary-pink text-white px-6 py-2 rounded-md font-medium"
          >
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-pink"></div>
        </div>
      ) : (
        <div className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 ${events.length >= 0 ? 'h-[80vh] md:h-[70vh] overflow-y-scroll ' : ''}`}>
          {events.map((event) => (
            <div>
              <EventCard key={event._id} event={event} />
            </div>
          ))}
        </div>
      )}

      {!loading && events.length === 0 && (
        <div className="text-center py-4 md:py-12">
          <p className="text-gray-500 text-sm"><span className='text-primary-pink'>No events found.</span> Try adjusting your search filters.</p>
        </div>
      )}
    </div>
  );
};

export default Events;

