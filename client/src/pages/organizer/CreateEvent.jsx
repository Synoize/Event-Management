import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../../contexts/EventContext';
import { toast } from 'sonner';

const CreateEvent = () => {
  const navigate = useNavigate();
  const { createEvent, uploadEventImage, loading } = useEvents();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    city: '',
    address: '',
    startTime: '',
    endTime: '',
    capacity: '',
    enrollmentFee: '',
    category: '',
    tags: '',
    images: [],
  });
  const [uploadingImages, setUploadingImages] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingImages(true);
    const uploadedImages = [...formData.images];

    try {
      for (const file of files) {
        const result = await uploadEventImage(file);
        if (result.success) {
          uploadedImages.push(result.data.url);
        }
      }
      setFormData({ ...formData, images: uploadedImages });
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      return toast.warning('Title is required');
    }
    if (!formData.startTime || !formData.endTime) {
      return toast.warning('Start time and end time are required');
    }

    const start = new Date(formData.startTime);
    const end = new Date(formData.endTime);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return toast.warning('Invalid start or end time');
    }
    if (end <= start) {
      return toast.warning('End time must be after start time');
    }

    const capacityNum = parseInt(formData.capacity, 10);
    const feeNum = parseFloat(formData.enrollmentFee || '0');
    if (isNaN(capacityNum) || capacityNum <= 0) {
      return toast.warning('Capacity must be a positive number');
    }
    if (isNaN(feeNum) || feeNum < 0) {
      return toast.warning('Enrollment fee must be 0 or a positive number');
    }

    const eventData = {
      title: formData.title,
      description: formData.description,
      images: formData.images,
      city: formData.city,
      address: formData.address,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      capacity: capacityNum,
      enrollmentFee: feeNum,
      category: formData.category,
      tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      location: {
        type: 'Point',
        coordinates: [0, 0],
      },
      status: 'draft',
    };

    try {
      const result = await createEvent(eventData);
      if (result.success) {
        navigate('/organizer/events');
      } else {
        // Show server-provided error if any
        toast.warning(result.error || 'Failed to create event');
      }
    } catch (err) {
      toast.error('An unexpected error occurred while creating the event');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-semibold text-gray-600 mb-6">Create Event</h1>

      <form onSubmit={handleSubmit} className="md:p-2 space-y-4 text-sm">
        <div>
          <label className="block font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 outline-none border border-gray-300 rounded-md focus:border-primary-pink"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            required
            rows="3"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 outline-none border border-gray-300 rounded-md focus:border-primary-pink"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-gray-700 mb-2">City</label>
            <input
              type="text"
              name="city"
              required
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-2 outline-none border border-gray-300 rounded-md focus:border-primary-pink"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 outline-none border border-gray-300 rounded-md focus:border-primary-pink"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-gray-700 mb-2">Start Time</label>
            <input
              type="datetime-local"
              name="startTime"
              required
              value={formData.startTime}
              onChange={handleChange}
              className="w-full px-4 py-2 outline-none border border-gray-300 rounded-md focus:border-primary-pink"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2">End Time</label>
            <input
              type="datetime-local"
              name="endTime"
              required
              value={formData.endTime}
              onChange={handleChange}
              className="w-full px-4 py-2 outline-none border border-gray-300 rounded-md focus:border-primary-pink"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-gray-700 mb-2">Capacity</label>
            <input
              type="number"
              name="capacity"
              required
              min="1"
              value={formData.capacity}
              onChange={handleChange}
              className="w-full px-4 py-2 outline-none border border-gray-300 rounded-md focus:border-primary-pink"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2">Enrollment Fee (₹)</label>
            <input
              type="number"
              name="enrollmentFee"
              required
              min="0"
              step="0.01"
              value={formData.enrollmentFee}
              onChange={handleChange}
              className="w-full px-4 py-2 outline-none border border-gray-300 rounded-md focus:border-primary-pink"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-2">Category</label>
          <input
            type="text"
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 outline-none border border-gray-300 rounded-md focus:border-primary-pink"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-2">Tags (comma separated)</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="music, concert, live"
            className="w-full px-4 py-2 outline-none border border-gray-300 rounded-md focus:border-primary-pink"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full px-4 py-2 outline-none border border-gray-300 rounded-md focus:border-primary-pink"
          />
          {uploadingImages && (
            <div className='mt-2'>
              <div className="animate-spin rounded-full h-4 w-4 border border-t-0 border-primary-pink"></div>
            </div>
          )}
          {formData.images.length > 0 && (
            <div className="mt-4 grid grid-cols-4 gap-4">
              {formData.images.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex space-x-4 text-sm pt-4">
          <button
            type="submit"
            disabled={loading && uploadingImages}
            className="flex-1 flex justify-center items-center bg-primary-pink/90 hover:bg-primary-pink text-white rounded-md font-medium disabled:opacity-50 h-10"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white"></div>
            ) : 'Create Event'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/organizer/events')}
            className="flex-1 bg-gray-300/90 hover:bg-gray-300 text-gray-800 rounded-md font-medium h-10"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;

