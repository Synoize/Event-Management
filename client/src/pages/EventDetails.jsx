import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvents } from '../contexts/EventContext';
import { useEnrollments } from '../contexts/EnrollmentContext';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEventById, loading } = useEvents();
  const { enrollInEvent, verifyPayment } = useEnrollments();
  const { isAuthenticated, isParticipant, user } = useAuth();
  const [event, setEvent] = useState(null);
  const [availableSeats, setAvailableSeats] = useState(0);

  useEffect(() => {
    const fetchEvent = async () => {
      const result = await getEventById(id);
      if (result.success) {
        setEvent(result.data.event);
        setAvailableSeats(result.data.availableSeats);
      }
    };
    fetchEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleEnroll = async () => {
    if (!isAuthenticated || !isParticipant) {
      navigate('/login');
      return;
    }

    if (event.enrollmentFee === 0) {
      // Free event - enroll directly
      const result = await enrollInEvent(id);
      if (result.success) {
        navigate('/my-enrollments');
      }
    } else {
      // Paid event - create enrollment and payment order
      const result = await enrollInEvent(id);
      if (result.success && result.data.order) {
        // Load Razorpay script and initialize payment
        loadRazorpayScript().then(() => {
          const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_key',
            amount: result.data.order.amount,
            currency: result.data.order.currency,
            name: 'Event Management',
            description: `Payment for ${event.title}`,
            order_id: result.data.order.id,
            handler: async function (response) {
              // Verify payment
              const verifyResult = await verifyPayment(result.data.enrollmentId, {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              });
              if (verifyResult.success) {
                navigate('/my-enrollments');
              }
            },
            prefill: {
              name: user?.name || '',
              email: user?.email || '',
            },
            theme: {
              color: '#2563eb',
            },
          };
          const razorpay = new window.Razorpay(options);
          razorpay.open();
        });
      }
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      script.onerror = () => resolve(); // Continue even if script fails
      document.body.appendChild(script);
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-pink"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-sm text-red-500">Event not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => {
          navigate(-1);
          scrollTo(0, 0);
        }}
        className="bg-gray-50/10 backdrop-blur-sm rounded-full shadow-sm fixed ml-4 md:ml-10 left-0 w-10 h-10 flex justify-center items-center group z-50"
      >
        <ArrowLeft className="text-gray-600 transition-all duration-300 group-hover:-translate-x-1" />
      </button>

      <div className="bg-white overflow-hidden">
        {event.images && event.images[0] && (
          <img
            src={event.images[0]}
            alt={event.title}
            className="w-full h-96 object-cover"
          />
        )}
        <div className="p-4 md:p-8">
          <h1 className="text-4xl font-bold text-gray-600 mb-4 first-letter:uppercase">{event.title}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-gray-600 text-lg mb-12 first-letter:uppercase">{event.description}</p>
              <div className="space-y-3">
                <p className="text-lg text-gray-500">
                  <span className="font-medium">Category:</span> {event.category}
                </p>
                <p className="text-lg text-gray-500 ">
                  <span className="font-medium">City:</span> {event.city}
                </p>
                {event.address && (
                  <p className="text-lg text-gray-500">
                    <span className="font-medium">Address:</span> {event.address}
                  </p>
                )}
                <p className="text-lg text-gray-500">
                  <span className="font-medium">Start:</span>{' '}
                  {new Date(event.startTime).toLocaleString()}
                </p>
                <p className="text-lg text-gray-500">
                  <span className="font-medium">End:</span>{' '}
                  {new Date(event.endTime).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-2xl font-semibold mb-4 text-gray-600">Event Details</h3>
              <div className="space-y-3 text-lg">
                <div className="flex justify-between">
                  <span className="text-gray-600">Enrollment Fee:</span>
                  <span className="font-medium text-green-600">
                    {event.enrollmentFee === 0 ? 'Free' : `₹${event.enrollmentFee}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Capacity:</span>
                  <span className="font-medium">{event.capacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Enrolled:</span>
                  <span className="font-medium">{event.enrolledCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Available Seats:</span>
                  <span className={`font-medium ${availableSeats==0 ? 'text-primary-pink' : 'text-red-500'}`}>{availableSeats}</span>
                </div>
              </div>
              {isAuthenticated && isParticipant && availableSeats > 0 && (
                <button
                  onClick={handleEnroll}
                  className="mt-6 w-full bg-primary-pink/90 hover:bg-primary-pink text-white text-sm py-3 px-4 rounded-md font-medium"
                >
                  {event.enrollmentFee === 0 ? 'Enroll Now (Free)' : 'Enroll & Pay'}
                </button>
              )}
              {isAuthenticated && !isParticipant && (
                <p className="mt-8 text-sm text-gray-500 text-center p-3 px-4 bg-primary-pink/10 rounded-full">
                  Only participants can enroll in events
                </p>
              )}
              {!isAuthenticated && (
                <p className="mt-8 text-sm text-center p-3 px-4 bg-primary-pink/10 rounded-full">
                  Please login to enroll in this event
                </p>
              )}
              {availableSeats === 0 && (
                <p className="mt-8 text-sm text-red-500 text-center font-medium p-3 px-4 bg-primary-pink/10 rounded-full">
                  Event is full
                </p>
              )}
            </div>
          </div>
          {event.tags && event.tags.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-primary-pink/10 text-primary-pink px-4 py-2 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;

