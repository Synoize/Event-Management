import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  return (
    <Link
      to={`/event/${event._id}`}
    >
      {event.images && event.images[0] ? (
        <img
          src={event.images[0]}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-24 md:h-40 bg-gradient-to-br from-primary-pink to-primary-orange opacity-90 hover:opacity-100 flex items-center justify-center">
          <span className="text-white text-2xl font-bold uppercase">{event.title.charAt(0)}</span>
        </div>
      )}
      <div className="p-4 bg-gray-50 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-1 line-clamp-1 first-letter:uppercase">{event.title}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2 first-letter:uppercase">{event.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-green-600 font-medium line-clamp-1 text-sm md:text-lg">
            {event.enrollmentFee === 0 ? 'Free' : `₹${event.enrollmentFee}`}
          </span>
          <span className="hidden md:block text-primary-orange font-medium line-clamp-1 text-xs first-letter:uppercase px-4 p-2 bg-primary-orange/10 rounded-full">{event.city}</span>
        </div>
        <div className="mt-2 text-xs md:text-sm text-gray-600">
          Date: {new Date(event.startTime).toLocaleDateString()}
        </div>
      </div>
    </Link>
  );
};

export default EventCard;

