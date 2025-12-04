import { createContext, useContext, useState } from 'react';
import api from '../utils/api';
import { toast } from 'sonner';

const EventContext = createContext();

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const eventCity = localStorage.getItem("eventCity");

  // Participant: Search events
  const searchEvents = async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      const response = await api.get(`/events/search?${params.toString()}`);
      setEvents(response.data.data || []);
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to search events';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Participant: Get event by ID
  const getEventById = async (id) => {
    setLoading(true);
    try {
      const response = await api.get(`/events/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch event';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Participant: Get events by city
  const getEventsByCity = async (city) => {
    setLoading(true);
    try {
      const response = await api.get(`/events/city/${city}`);
      setEvents(response.data.data || []);
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch events';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Participant: Get all published events (with optional filters)
  const getAllEvents = async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      const query = params.toString() ? `?${params.toString()}` : '';
      const response = await api.get(`/events${query}`);
      setEvents(response.data.data || []);
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch events';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Organizer: Upload event image
  const uploadEventImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await api.post('/organizer/events/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to upload image';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Organizer: Create event
  const createEvent = async (eventData) => {
    setLoading(true);
    try {
      const response = await api.post('/organizer/events', eventData);
      toast.success('Event created successfully!');
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create event';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Organizer: Update event
  const updateEvent = async (id, eventData) => {
    setLoading(true);
    try {
      const response = await api.put(`/organizer/events/${id}`, eventData);
      toast.success('Event updated successfully!');
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update event';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Organizer: Delete event
  const deleteEvent = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/organizer/events/${id}`);
      toast.success('Event deleted successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete event';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Organizer: Get my events
  const getMyEvents = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const response = await api.get(`/organizer/events?page=${page}&limit=${limit}`);
      setEvents(response.data.data || []);
      return { success: true, data: response.data };
    } catch (error) {
      console.log(error);
      
      const message = error.response?.data?.message || 'Failed to fetch events';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Organizer: Get event attendees
  const getEventAttendees = async (eventId) => {
    setLoading(true);
    try {
      const response = await api.get(`/organizer/events/${eventId}/attendees`);
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch attendees';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    events,
    loading,
    eventCity,
    searchEvents,
    getAllEvents,
    getEventById,
    getEventsByCity,
    uploadEventImage,
    createEvent,
    updateEvent,
    deleteEvent,
    getMyEvents,
    getEventAttendees,
  };

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};

