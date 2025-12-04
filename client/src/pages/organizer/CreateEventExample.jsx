import React, { useState } from 'react';
import axios from 'axios';

/**
 * Complete organizer event creation form with image upload
 * Flow:
 * 1. Upload image to get URL + publicId
 * 2. Create event with image objects { url, publicId }
 * 3. Handle success/error
 */

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const CreateEventExample = () => {
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

  const [images, setImages] = useState([]); // Store uploaded images with { url, publicId }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Get auth token from localStorage (or context)
  const getToken = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('No auth token found');
    return token;
  };

  // Step 1: Upload image
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post(
        `${API_BASE}/organizer/events/upload-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Add image to our list
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

  // Remove uploaded image
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Step 2: Create event
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (images.length === 0) {
        setError('Please upload at least one event image');
        setLoading(false);
        return;
      }

      // Parse coordinates from city or use defaults
      const coordinates = [75.79, 26.92]; // Default: Jaipur

      // Convert datetime-local to ISO 8601 format
      const startTime = formData.startTime
        ? new Date(formData.startTime).toISOString()
        : new Date().toISOString();
      const endTime = formData.endTime
        ? new Date(formData.endTime).toISOString()
        : new Date().toISOString();

      const eventPayload = {
        ...formData,
        startTime,
        endTime,
        images, // Array of { url, publicId }
        location: {
          type: 'Point',
          coordinates, // [lng, lat]
        },
      };

      const response = await axios.post(
        `${API_BASE}/organizer/events`,
        eventPayload,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setSuccess(`Event created: ${response.data.event.title}`);
      // Reset form
      setFormData({
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
      setImages([]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event');
      console.error('Create error:', err.response?.data?.errors);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">Create Event</h1>

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

      <form onSubmit={handleCreateEvent} className="space-y-4">
        {/* Image Upload Section */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={loading}
            className="block w-full"
          />
          {loading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}

          {/* Display uploaded images */}
          {images.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium">Uploaded Images:</p>
              {images.map((img, idx) => (
                <div key={idx} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                  <div>
                    <p className="text-sm">{img.url.split('/').pop().substring(0, 40)}...</p>
                    <p className="text-xs text-gray-500">{img.publicId}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Event Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="e.g., Tech Workshop 2025"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Describe your event..."
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
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., Jaipur"
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
              placeholder="Event venue"
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
              required
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
              required
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
              required
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
              required
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

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Creating Event...' : 'Create Event'}
        </button>
      </form>
    </div>
  );
};

export default CreateEventExample;
