import { createContext, useContext, useState } from 'react';
import api from '../utils/api';
import { toast } from 'sonner';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Get user profile
  const getProfile = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users/profile');
      setProfile(response.data);
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch profile';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (data) => {
    setLoading(true);
    try {
      const response = await api.put('/users/profile', data);
      setProfile(response.data);
      toast.success('Profile updated successfully!');
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile';
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
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

