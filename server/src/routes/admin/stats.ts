import { Router } from 'express';
import { authenticate, requireAdmin } from '../../middleware/auth';
import { User } from '../../models/User';
import { Event } from '../../models/Event';
import { Transaction } from '../../models/Transaction';

export const adminStatsRouter = Router();

adminStatsRouter.get('/', authenticate, requireAdmin, async (_req, res) => {
  const [participants, organizers, events, revenueAgg, popularEvents, pendingVerifications] =
    await Promise.all([
      User.countDocuments({ role: 'participant' }),
      User.countDocuments({ role: 'organizer' }),
      Event.countDocuments(),
      Transaction.aggregate([
        { $match: { status: 'paid' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Event.find({ status: 'published' }).sort({ enrolledCount: -1 }).limit(5),
      User.countDocuments({ role: 'organizer', verificationStatus: 'pending' }),
    ]);

  const totalRevenue = revenueAgg[0]?.total || 0;

  res.json({
    totalParticipants: participants,
    totalOrganizers: organizers,
    totalEvents: events,
    totalRevenue,
    mostPopularEvents: popularEvents,
    pendingVerifications,
  });
});


