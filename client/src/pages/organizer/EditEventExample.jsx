import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

/**
 * Edit Event Component
 * - Fetch existing event
 * - Allow title, capacity, fee, images, etc. updates
 * - Auto-delete old images when removing them
 */

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const EditEventExample = () => {
  const { eventId } = useParams();
  
  const [event, setEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    city: '',
    address: '',
    startTime: '',
    endTime: '',
    capacity: 50,
    enrollmentFee: 500,
    category: 'Workshop',
    tags: [],
    status: 'draft',
  });

  const [images, setImages] = useState([]); // Current images { url, publicId }
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const getToken = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('No auth token found');
    return token;
  };

  // Fetch event on mount
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `${API_BASE}/organizer/events/${eventId}`,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );

        setEvent(response.data.event);
        setImages(response.data.event.images || []);

        // Convert dates to ISO string for datetime-local input
        const startTime = new Date(response.data.event.startTime).toISOString().slice(0, 16);
        const endTime = new Date(response.data.event.endTime).toISOString().slice(0, 16);

        setFormData({
          title: response.data.event.title,
          description: response.data.event.description,
          city: response.data.event.city,
          address: response.data.event.address || '',
          startTime,
          endTime,
          capacity: response.data.event.capacity,
          enrollmentFee: response.data.event.enrollmentFee,
          category: response.data.event.category,
          tags: response.data.event.tags || [],
          status: response.data.event.status,
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch event');
      } finally {
        setFetching(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  // Upload new image
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('image', file);

      const response = await axios.post(
        `${API_BASE}/organizer/events/upload-image`,
        uploadFormData,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setImages([
        ...images,
        {
          url: response.data.url,
          publicId: response.data.publicId,
        },
      ]);

      setSuccess(`Image uploaded: ${file.name}`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Image upload failed');
    } finally {
      setLoading(false);
    }
  };

  // Remove image (will be deleted from Cloudinary on save)
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Save changes
  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (images.length === 0) {
        setError('Event must have at least one image');
        setLoading(false);
        return;
      }

      const coordinates = [75.79, 26.92]; // Default: Jaipur

      // Convert datetime-local to ISO 8601 format
      const startTime = formData.startTime
        ? new Date(formData.startTime).toISOString()
        : new Date().toISOString();
      const endTime = formData.endTime
        ? new Date(formData.endTime).toISOString()
        : new Date().toISOString();

      const updatePayload = {
        ...formData,
        startTime,
        endTime,
        images,
        location: {
          type: 'Point',
          coordinates,
        },
      };

      const response = await axios.put(
        `${API_BASE}/organizer/events/${eventId}`,
        updatePayload,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setSuccess('Event updated successfully');
      setEvent(response.data.event);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update event');
      console.error('Update error:', err.response?.data?.errors);
    } finally {
      setLoading(false);
    }
  };

  // Delete event
  const handleDeleteEvent = async () => {
    if (!window.confirm('Are you sure you want to delete this event? This cannot be undone.')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.delete(
        `${API_BASE}/organizer/events/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      setSuccess('Event deleted successfully. Redirecting...');
      setTimeout(() => window.location.href = '/organizer/events', 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete event');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  if (fetching) {
    return <div className="text-center py-10">Loading event...</div>;
  }

  if (!event) {
    return <div className="text-center py-10 text-red-600">Event not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">Edit Event</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleUpdateEvent} className="space-y-4">
        {/* Image Section */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Images
          </label>

          {/* Display current images */}
          {images.length > 0 && (
            <div className="mb-4 space-y-2">
              <p className="text-sm font-medium">Current Images:</p>
              {images.map((img, idx) => (
                <div key={idx} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                  <div className="flex-1">
                    <img
                      src={img.url}
                      alt="event"
                      className="h-16 w-16 object-cover rounded"
                    />
                    <p className="text-xs text-gray-500 mt-1">{img.publicId}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="ml-2 text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload new image */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">Add more images:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={loading}
              className="block w-full"
            />
            {loading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
          </div>
        </div>

        {/* Event Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows="4"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Time</label>
            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Time</label>
            <input
              type="datetime-local"
              name="endTime"
              value={formData.endTime}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Capacity</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleInputChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Enrollment Fee (₹)</label>
            <input
              type="number"
              name="enrollmentFee"
              value={formData.enrollmentFee}
              onChange={handleInputChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option>Workshop</option>
              <option>Seminar</option>
              <option>Conference</option>
              <option>Meetup</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={handleDeleteEvent}
            disabled={loading}
            className="px-6 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 disabled:bg-gray-400"
          >
            Delete Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEventExample;
