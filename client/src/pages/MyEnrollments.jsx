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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-pink"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl md:text-4xl font-semibold text-gray-600 mb-6">My Enrollments</h1>

      {enrollments.length === 0 ? (
        <div className="text-center py-12 text-sm">
          <p className="text-gray-500 ">You haven't enrolled in any events yet.</p>
          <button
            onClick={() => {
              eventCity ? navigate(`/events/${eventCity}`) : navigate(`/events`)
              scrollTo(0, 0);
            }}
            className="mt-4 inline-block text-primary-pink/90 hover:text-primary-pink hover:underline"
          >
            Browse Events
          </button>
        </div>
      ) : (
        <div className="flex flex-col h-[80vh] overflow-y-scroll">
          {enrollments.map((enrollment) => {
            const event = enrollment.eventId;
            if (!event) return null;

            return (
              <Link
                key={enrollment._id}
                to={`/event/${event._id}`}
                className="bg-gray-50 opacity-90 hover:opacity-100 border border-gray-100 p-4 md:px-8 flex items-center justify-between gap-8"
              >
                <div className="flex justify-between items-center gap-8">
                  {event.images && event.images[0] && (
                    <img
                      src={event.images[0]}
                      alt={event.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1 first-letter:uppercase">{event.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2 first-letter:uppercase">{event.description}</p>
                  </div>
                </div>
                <span className="text-primary-pink font-medium text-sm first-letter:uppercase">{event.city}</span>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium first-letter:uppercase ${enrollment.status === 'paid'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-primary-orange/10 text-primary-orange'
                    }`}
                >
                  {enrollment.status}
                </span>
              </Link>
      );
          })}
    </div>
  )
}
    </div >
  );
};

export default MyEnrollments;

