import { Router } from 'express';
import { authenticate, requireAdmin } from '../../middleware/auth';
import { User } from '../../models/User';

export const adminOrganizerRouter = Router();

// List organizer verification requests
adminOrganizerRouter.get('/verifications', authenticate, requireAdmin, async (req, res) => {
  const organizers = await User.find({ role: 'organizer', verificationStatus: 'pending' });
  res.json({ data: organizers });
});

adminOrganizerRouter.patch('/:id/approve', authenticate, requireAdmin, async (req, res) => {
  const organizer = await User.findOne({ _id: req.params.id, role: 'organizer' });
  if (!organizer) return res.status(404).json({ message: 'Organizer not found' });
  organizer.verificationStatus = 'verified';
  await organizer.save();
  res.json({ message: 'Organizer approved' });
});

adminOrganizerRouter.patch('/:id/reject', authenticate, requireAdmin, async (req, res) => {
  const organizer = await User.findOne({ _id: req.params.id, role: 'organizer' });
  if (!organizer) return res.status(404).json({ message: 'Organizer not found' });
  organizer.verificationStatus = 'rejected';
  await organizer.save();
  res.json({ message: 'Organizer rejected' });
});

adminOrganizerRouter.patch('/:id/toggle-active', authenticate, requireAdmin, async (req, res) => {
  const organizer = await User.findOne({ _id: req.params.id, role: 'organizer' });
  if (!organizer) return res.status(404).json({ message: 'Organizer not found' });
  organizer.isSuspended = !organizer.isSuspended;
  await organizer.save();
  res.json({ message: organizer.isSuspended ? 'Organizer deactivated' : 'Organizer activated' });
});


