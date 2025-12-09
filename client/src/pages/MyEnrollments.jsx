import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEnrollments } from '../contexts/EnrollmentContext';
import { useEvents } from '../contexts/EventContext';

const MyEnrollments = () => {
  const { enrollments, getMyEnrollments, loading } = useEnrollments();
  const navigate = useNavigate();
  const { eventCity } = useEvents();

  useEffect(() => {
    getMyEnrollments();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border border-t-0 border-primary-pink"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-semibold text-gray-600 mb-6">
        My Enrollments
      </h1>

      {/* No Enrollments */}
      {enrollments.length === 0 ? (
        <div className="text-center py-12 text-sm">
          <p className="text-gray-500">You haven't enrolled in any events yet.</p>
          <button
            onClick={() => {
              eventCity
                ? navigate(`/events/${eventCity}`)
                : navigate(`/events`);
              scrollTo(0, 0);
            }}
            className="mt-4 inline-block text-primary-pink/90 hover:text-primary-pink hover:underline"
          >
            Browse Events
          </button>
        </div>
      ) : (
        /* Grid Layout */
        <div className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 ${enrollments.length !== 0 ? 'h-[80vh] md:h-[70vh] overflow-y-scroll ' : ''}`}>

          {enrollments.map((enrollment) => {
            const event = enrollment.eventId;
            if (!event) return null;

            return (
              <div key={enrollment._id} className='opacity-90 hover:opacity-100'>
                <Link
                  to={`/event/${event._id}`}
                  className="block overflow-hidden border bg-white transition"
                >
                  {/* Image */}
                  {event.images?.[0] ? (
                    <img
                      src={event.images[0]}
                      alt={event.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-24 md:h-40 bg-gradient-to-br from-primary-pink to-primary-orange flex items-center justify-center">
                      <span className="text-white text-2xl font-bold uppercase">{event.title.charAt(0)}</span>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 capitalize">
                      {event.title}
                    </h3>

                    <p className="text-gray-600 text-sm mt-1 line-clamp-2 capitalize">
                      {event.description}
                    </p>

                    {/* Footer */}
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-primary-pink font-medium capitalize text-sm">
                        {event.city}
                      </span>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize 
                        ${enrollment.status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-primary-orange/10 text-primary-orange'
                          }`}
                      >
                        {enrollment.status}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyEnrollments;
