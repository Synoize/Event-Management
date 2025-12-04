import { Router } from 'express';
import { authenticate, requireAdmin } from '../../middleware/auth.js';
import { Event } from '../../models/Event.js';

export const adminEventRouter = Router();

adminEventRouter.get('/', authenticate, requireAdmin, async (req, res) => {
  const status = req.query.status;
  const filter = {};
  if (status) filter.status = status;
  const events = await Event.find(filter).sort({ createdAt: -1 });
  res.json({ data: events });
});

adminEventRouter.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  res.json({ message: 'Event deleted' });
});
