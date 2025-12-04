import { createContext, useContext, useState } from 'react';
import api from '../utils/api';
import { toast } from 'sonner';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  // Get dashboard stats
  const getStats = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data);
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch stats';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Get all users
  const getUsers = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/users?page=${page}&limit=${limit}`);
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch users';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Update user status
  const updateUserStatus = async (userId, data) => {
    setLoading(true);
    try {
      const response = await api.put(`/admin/users/${userId}`, data);
      toast.success('User status updated!');
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update user';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Get all organizers
  const getOrganizers = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/organizers?page=${page}&limit=${limit}`);
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch organizers';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Verify organizer
  const verifyOrganizer = async (organizerId, status) => {
    setLoading(true);
    try {
      const response = await api.put(`/admin/organizers/${organizerId}/verify`, { status });
      toast.success('Organizer verification updated!');
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to verify organizer';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Get all events
  const getEvents = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/events?page=${page}&limit=${limit}`);
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch events';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Update event status
  const updateEventStatus = async (eventId, status) => {
    setLoading(true);
    try {
      const response = await api.put(`/admin/events/${eventId}`, { status });
      toast.success('Event status updated!');
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update event';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Get transactions
  const getTransactions = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/transactions?page=${page}&limit=${limit}`);
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch transactions';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    stats,
    loading,
    getStats,
    getUsers,
    updateUserStatus,
    getOrganizers,
    verifyOrganizer,
    getEvents,
    updateEventStatus,
    getTransactions,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

