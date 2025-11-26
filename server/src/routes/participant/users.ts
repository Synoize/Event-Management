import { Router } from 'express';
import { authenticate, requireRole } from '../../middleware/auth';

export const participantUserRouter = Router();

participantUserRouter.get('/me', authenticate, requireRole('participant'), async (req, res) => {
  const user = req.user!;
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
});

participantUserRouter.put(
  '/update',
  authenticate,
  requireRole('participant'),
  async (req, res) => {
    const user = req.user!;
    const { name } = req.body;
    if (name) user.name = name;
    await user.save();
    res.json({ message: 'Profile updated', user: { id: user.id, name: user.name } });
  }
);


