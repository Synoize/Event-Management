import { Router } from 'express';
import { authenticate, requireAdmin } from '../../middleware/auth';
import { User } from '../../models/User';

export const adminUserRouter = Router();

adminUserRouter.get('/', authenticate, requireAdmin, async (req, res) => {
  const page = parseInt((req.query.page as string) || '1', 10);
  const limit = parseInt((req.query.limit as string) || '20', 10);
  const users = await User.find({ role: 'participant' })
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });
  const total = await User.countDocuments({ role: 'participant' });
  res.json({ data: users, page, limit, total });
});

adminUserRouter.patch('/:id/suspend', authenticate, requireAdmin, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.isSuspended = true;
  await user.save();
  res.json({ message: 'User suspended' });
});

adminUserRouter.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ message: 'User deleted' });
});


