import { Router } from 'express';
import multer from 'multer';
import { Readable } from 'stream';
import { authenticate, requireOrganizer, requireRole } from '../../middleware/auth.js';
import { validateBody } from '../../middleware/validate.js';
import { eventCreateSchema, eventUpdateSchema } from '../../validations/eventSchemas.js';
import { Event } from '../../models/Event.js';
import { Enrollment } from '../../models/Enrollment.js';
import { cloudinary } from '../../cloudinary.js';

export const organizerEventRouter = Router();

const upload = multer({ storage: multer.memoryStorage() });

// Upload single event image to Cloudinary, returns URL and publicId
organizerEventRouter.post(
  '/upload-image',
  authenticate,
  requireOrganizer,
  upload.single('image'),
  async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: 'Image file is required' });
      }

      // Ensure Cloudinary credentials present
      if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET || !process.env.CLOUDINARY_CLOUD_NAME) {
        return res.status(500).json({ message: 'Cloudinary not configured on server' });
      }

      const readable = new Readable();
      readable.push(file.buffer);
      readable.push(null);

      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: 'events' }, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        });
        readable.pipe(stream);
      });

      if (!uploadResult || !uploadResult.secure_url) {
        return res.status(500).json({ message: 'Cloudinary upload failed' });
      }

      res.status(201).json({
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      });
    } catch (error) {
      console.error('Upload image error:', error?.message || error);
      const message = error?.message || 'Failed to upload image';
      res.status(500).json({ message });
    }
  }
);

// Helper: Delete image from Cloudinary by publicId
const deleteCloudinaryImage = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.warn(`Failed to delete Cloudinary image ${publicId}:`, err?.message || err);
  }
};

// Create event
organizerEventRouter.post(
  '/',
  authenticate,
  requireOrganizer,
  validateBody(eventCreateSchema),
  async (req, res) => {
    try {
      const organizerId = req.user._id;
      const doc = {
        ...req.body,
        organizerId,
        startTime: new Date(req.body.startTime),
        endTime: new Date(req.body.endTime),
        // Ensure images are in correct format (array of { url, publicId })
        images: req.body.images || [],
      };
      const event = await Event.create(doc);
      res.status(201).json({ event });
    } catch (error) {
      console.error('Create event error:', error?.message || error);
      res.status(500).json({ message: error?.message || 'Failed to create event' });
    }
  }
);

// Update event
organizerEventRouter.put(
  '/:id',
  authenticate,
  requireOrganizer,
  validateBody(eventUpdateSchema),
  async (req, res) => {
    try {
      const organizerId = req.user._id;
      const event = await Event.findOne({ _id: req.params.id, organizerId });
      if (!event) return res.status(404).json({ message: 'Event not found' });

      // If images are being updated, delete old ones from Cloudinary
      if (req.body.images && Array.isArray(req.body.images)) {
        const oldPublicIds = event.images.map((img) => img.publicId);
        const newPublicIds = req.body.images.map((img) => img.publicId);
        const removedPublicIds = oldPublicIds.filter((id) => !newPublicIds.includes(id));

        // Delete removed images from Cloudinary
        for (const publicId of removedPublicIds) {
          await deleteCloudinaryImage(publicId);
        }
      }

      Object.assign(event, req.body);
      if (req.body.startTime) event.startTime = new Date(req.body.startTime);
      if (req.body.endTime) event.endTime = new Date(req.body.endTime);
      await event.save();
      res.json({ event });
    } catch (error) {
      console.error('Update event error:', error?.message || error);
      res.status(500).json({ message: error?.message || 'Failed to update event' });
    }
  }
);

// Delete event (and all associated images from Cloudinary)
organizerEventRouter.delete('/:id', authenticate, requireOrganizer, async (req, res) => {
  try {
    const organizerId = req.user._id;
    const event = await Event.findOneAndDelete({ _id: req.params.id, organizerId });
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Delete all images from Cloudinary
    if (event.images && Array.isArray(event.images)) {
      for (const image of event.images) {
        await deleteCloudinaryImage(image.publicId);
      }
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error?.message || error);
    res.status(500).json({ message: error?.message || 'Failed to delete event' });
  }
});

// List organizer events with pagination
organizerEventRouter.get('/', authenticate, requireRole('organizer'), async (req, res) => {
  const organizerId = req.user._id;
  const page = Math.max(1, parseInt((req.query.page) || '1', 10));
  const limit = Math.max(1, Math.min(100, parseInt((req.query.limit) || '10', 10)));
  const events = await Event.find({ organizerId })
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });
  const total = await Event.countDocuments({ organizerId });
  res.json({ data: events, page, limit, total });
});

// Attendees list
organizerEventRouter.get('/:id/attendees', authenticate, requireRole('organizer'), async (req, res) => {
  const organizerId = req.user._id;
  const event = await Event.findOne({ _id: req.params.id, organizerId });
  if (!event) return res.status(404).json({ message: 'Event not found' });
  const enrollments = await Enrollment.find({ eventId: event._id, status: 'paid' }).populate(
    'participantId'
  );
  res.json({ data: enrollments });
});

// Organizer view single event (must own it)
organizerEventRouter.get('/:id', authenticate, requireRole('organizer'), async (req, res) => {
  try {
    const organizerId = req.user._id;
    const event = await Event.findOne({ _id: req.params.id, organizerId }).populate(
      'organizerId',
      'name email organizationName'
    );
    if (!event) return res.status(404).json({ message: 'Event not found' });
    const enrolledCount = event.enrolledCount || 0;
    const availableSeats = event.capacity - enrolledCount;
    res.json({ event, enrolledCount, availableSeats });
  } catch (error) {
    console.error('Get organizer event error:', error?.message || error);
    res.status(500).json({ message: error?.message || 'Failed to get event' });
  }
});
