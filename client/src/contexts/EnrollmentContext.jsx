import { createContext, useContext, useState } from 'react';
import api from '../utils/api';
import { toast } from 'sonner';

const EnrollmentContext = createContext();

export const useEnrollments = () => {
  const context = useContext(EnrollmentContext);
  if (!context) {
    throw new Error('useEnrollments must be used within an EnrollmentProvider');
  }
  return context;
};

export const EnrollmentProvider = ({ children }) => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Create enrollment and payment order
  const enrollInEvent = async (eventId) => {
    setLoading(true);
    try {
      const response = await api.post(`/enrollments/${eventId}`);
      toast.success('Enrollment created! Please complete payment.');
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to enroll in event';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Get my enrollments
  const getMyEnrollments = async () => {
    setLoading(true);
    try {
      const response = await api.get('/enrollments');
      console.log("response: ", response);
      
      setEnrollments(response.data.data || []);
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch enrollments';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Verify payment
  const verifyPayment = async (enrollmentId, paymentData) => {
    setLoading(true);
    try {
      const response = await api.post(`/enrollments/${enrollmentId}/verify`, paymentData);
      toast.success('Payment verified successfully!');
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Payment verification failed';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    enrollments,
    loading,
    enrollInEvent,
    getMyEnrollments,
    verifyPayment,
  };

  return <EnrollmentContext.Provider value={value}>{children}</EnrollmentContext.Provider>;
};

