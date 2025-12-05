import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  return (
    <Link
      to={`/event/${event._id}`}
      className="bg-white rounded overflow-hidden transition-shadow"
    >
      {event.images && event.images[0] ? (
        <img
          src={event.images[0]}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-40 bg-gradient-to-br from-primary-pink to-primary-orange flex items-center justify-center">
          <span className="text-white text-2xl font-bold">{event.title.charAt(0)}</span>
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">{event.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-primary-pink font-medium">
            {event.enrollmentFee === 0 ? 'Free' : `₹${event.enrollmentFee}`}
          </span>
          <span className="text-gray-500 text-sm">{event.city}</span>
        </div>
        <div className="mt-2 text-sm text-gray-500">
          {new Date(event.startTime).toLocaleDateString()}
        </div>
      </div>
    </Link>
  );
};

export default EventCard;

