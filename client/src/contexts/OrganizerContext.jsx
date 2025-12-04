import { createContext, useContext, useState } from 'react';
import api from '../utils/api';
import { toast } from 'sonner';

const OrganizerContext = createContext();

export const useOrganizer = () => {
  const context = useContext(OrganizerContext);
  if (!context) {
    throw new Error('useOrganizer must be used within an OrganizerProvider');
  }
  return context;
};

export const OrganizerProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Get organizer profile
  const getProfile = async () => {
    setLoading(true);
    try {
      // The server does not expose a dedicated GET profile endpoint for organizer.
      // Use the locally stored user info (kept in AuthContext) as the profile source.
      const stored = localStorage.getItem('user');
      const data = stored ? JSON.parse(stored) : null;
      setProfile(data);
      return { success: true, data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch profile';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Update organizer profile
  const updateProfile = async (data) => {
    setLoading(true);
    try {
      // Server endpoint: PUT /organizer/profile/update
      await api.put('/organizer/profile/update', data);
      // Update local copy (AuthContext stores `user` in localStorage)
      const stored = localStorage.getItem('user');
      const user = stored ? JSON.parse(stored) : {};
      const updatedUser = { ...user, ...data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setProfile(updatedUser);
      toast.success('Profile updated successfully!');
      return { success: true, data: updatedUser };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Refund a transaction (organizer-initiated)
  const refundTransaction = async (transactionId) => {
    setLoading(true);
    try {
      const response = await api.post(`/organizer/payments/${transactionId}/refund`);
      toast.success(response.data?.message || 'Refund initiated');
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to initiate refund';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    profile,
    loading,
    getProfile,
    updateProfile,
    refundTransaction,
  };

  return <OrganizerContext.Provider value={value}>{children}</OrganizerContext.Provider>;
};

