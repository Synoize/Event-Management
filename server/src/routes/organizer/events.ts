import { Router } from 'express';
import multer from 'multer';
import { authenticate, requireOrganizer } from '../../middleware/auth';
import { validateBody } from '../../middleware/validate';
import { eventCreateSchema, eventUpdateSchema } from '../../validations/eventSchemas';
import { Event } from '../../models/Event';
import { Enrollment } from '../../models/Enrollment';
import { cloudinary } from '../../config/cloudinary';

export const organizerEventRouter = Router();

const upload = multer({ storage: multer.memoryStorage() });

// Upload single event image to Cloudinary, returns URL
organizerEventRouter.post(
  '/upload-image',
  authenticate,
  requireOrganizer,
  upload.single('image'),
  async (req, res) => {
    const file = (req as any).file as Express.Multer.File | undefined;
    if (!file) {
      return res.status(400).json({ message: 'Image file is required' });
    }
    const uploadResult = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'events' },
        (error: any, result: any) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(file.buffer);
    });

    res.status(201).json({
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });
  }
);

// Create event
organizerEventRouter.post(
  '/',
  authenticate,
  requireOrganizer,
  validateBody(eventCreateSchema),
  async (req, res) => {
    const organizerId = req.user!._id;
    const event = await Event.create({
      ...req.body,
      organizerId,
      startTime: new Date(req.body.startTime),
      endTime: new Date(req.body.endTime),
    });
    res.status(201).json({ event });
  }
);

// Update event
organizerEventRouter.put(
  '/:id',
  authenticate,
  requireOrganizer,
  validateBody(eventUpdateSchema),
  async (req, res) => {
    const organizerId = req.user!._id;
    const event = await Event.findOne({ _id: req.params.id, organizerId });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    Object.assign(event, req.body);
    if (req.body.startTime) event.startTime = new Date(req.body.startTime);
    if (req.body.endTime) event.endTime = new Date(req.body.endTime);
    await event.save();
    res.json({ event });
  }
);

// Delete event
organizerEventRouter.delete('/:id', authenticate, requireOrganizer, async (req, res) => {
  const organizerId = req.user!._id;
  const event = await Event.findOneAndDelete({ _id: req.params.id, organizerId });
  if (!event) return res.status(404).json({ message: 'Event not found' });
  res.json({ message: 'Event deleted' });
});

// List organizer events with pagination
organizerEventRouter.get('/', authenticate, requireOrganizer, async (req, res) => {
  const organizerId = req.user!._id;
  const page = parseInt((req.query.page as string) || '1', 10);
  const limit = parseInt((req.query.limit as string) || '10', 10);
  const events = await Event.find({ organizerId })
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });
  const total = await Event.countDocuments({ organizerId });
  res.json({ data: events, page, limit, total });
});

// Attendees list
organizerEventRouter.get('/:id/attendees', authenticate, requireOrganizer, async (req, res) => {
  const organizerId = req.user!._id;
  const event = await Event.findOne({ _id: req.params.id, organizerId });
  if (!event) return res.status(404).json({ message: 'Event not found' });
  const enrollments = await Enrollment.find({ eventId: event._id, status: 'paid' }).populate(
    'participantId'
  );
  res.json({ data: enrollments });
});


