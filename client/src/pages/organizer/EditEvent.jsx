import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvents } from '../../contexts/EventContext';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEventById, updateEvent, uploadEventImage, loading } = useEvents();
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
    status: 'draft',
  });
  const [uploadingImages, setUploadingImages] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      const result = await getEventById(id);
      if (result.success) {
        const event = result.data.event;
        setFormData({
          title: event.title,
          description: event.description,
          city: event.city,
          address: event.address || '',
          startTime: new Date(event.startTime).toISOString().slice(0, 16),
          endTime: new Date(event.endTime).toISOString().slice(0, 16),
          capacity: event.capacity.toString(),
          enrollmentFee: event.enrollmentFee.toString(),
          category: event.category,
          tags: event.tags?.join(', ') || '',
          images: event.images || [],
          status: event.status,
        });
      }
    };
    fetchEvent();
  }, [id]);

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
    
    const eventData = {
      ...formData,
      capacity: parseInt(formData.capacity),
      enrollmentFee: parseFloat(formData.enrollmentFee),
      tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
    };

    const result = await updateEvent(id, eventData);
    if (result.success) {
      navigate('/organizer/events');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-semibold text-gray-600 mb-6">Edit Event</h1>
      
      <form onSubmit={handleSubmit} className="md:p-2 space-y-4 text-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Enrollment Fee (₹)</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 outline-none border border-gray-300 rounded-md focus:border-primary-pink"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="cancelled">Cancelled</option>
          </select>
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
            disabled={loading}
            className="flex-1 flex justify-center items-center bg-primary-pink/90 hover:bg-primary-pink text-white rounded-md font-medium disabled:opacity-50 h-10"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white"></div>
            ) : 'Update Event'}
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

export default EditEvent;

