import { Router } from 'express';
import { Event } from '../../models/Event';
import { participantSearchSchema } from '../../validations/eventSchemas';

export const participantEventRouter = Router();

participantEventRouter.get('/search', async (req, res) => {
  const parsed = participantSearchSchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid query', errors: parsed.error.errors });
  }
  const {
    q,
    category,
    isFree,
    startDate,
    endDate,
    lat,
    lng,
    radiusKm,
    page = '1',
    limit = '10',
  } = parsed.data;

  const filters: any = { status: 'published' };
  if (q) {
    filters.title = { $regex: q, $options: 'i' };
  }
  if (category) filters.category = category;
  if (typeof isFree === 'boolean') {
    filters.enrollmentFee = isFree ? 0 : { $gt: 0 };
  }
  if (startDate || endDate) {
    filters.startTime = {};
    if (startDate) filters.startTime.$gte = new Date(startDate);
    if (endDate) filters.startTime.$lte = new Date(endDate);
  }

  let geoFilter = {};
  if (lat && lng && radiusKm) {
    geoFilter = {
      location: {
        $geoWithin: {
          $centerSphere: [
            [parseFloat(lng), parseFloat(lat)],
            parseFloat(radiusKm) / 6378.1,
          ],
        },
      },
    };
  }

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;

  const events = await Event.find({ ...filters, ...geoFilter })
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum)
    .sort({ startTime: 1 });
  const total = await Event.countDocuments({ ...filters, ...geoFilter });

  res.json({ data: events, page: pageNum, limit: limitNum, total });
});

participantEventRouter.get('/:id', async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  const availableSeats = event.capacity - event.enrolledCount;
  res.json({ event, availableSeats });
});


