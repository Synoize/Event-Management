import { Router } from 'express';
import { authenticate, requireAdmin } from '../../middleware/auth';
import { Transaction } from '../../models/Transaction';

export const adminTransactionRouter = Router();

adminTransactionRouter.get('/', authenticate, requireAdmin, async (req, res) => {
  const { startDate, endDate, eventId, organizerId, status } = req.query as Record<
    string,
    string | undefined
  >;

  const filter: any = {};
  if (eventId) filter.eventId = eventId;
  if (organizerId) filter.organizerId = organizerId;
  if (status) filter.status = status;
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  const page = parseInt((req.query.page as string) || '1', 10);
  const limit = parseInt((req.query.limit as string) || '20', 10);

  const txs = await Transaction.find(filter)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });
  const total = await Transaction.countDocuments(filter);

  res.json({ data: txs, page, limit, total });
});


