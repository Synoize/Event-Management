import { Router } from 'express';
import { authenticate, requireOrganizer } from '../../middleware/auth';

export const organizerProfileRouter = Router();

organizerProfileRouter.put('/update', authenticate, requireOrganizer, async (req, res) => {
  const user = req.user!;
  const { organizationName, officialId } = req.body;
  if (organizationName) user.organizationName = organizationName;
  if (officialId) user.officialId = officialId;
  await user.save();
  res.json({ message: 'Organizer profile updated' });
});


