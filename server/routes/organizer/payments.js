import { Router } from 'express';
import { authenticate, requireOrganizer } from '../../middleware/auth.js';
import { Transaction } from '../../models/Transaction.js';
import { razorpay } from '../../razorpay.js';

export const organizerPaymentRouter = Router();

organizerPaymentRouter.post(
  '/:transactionId/refund',
  authenticate,
  requireOrganizer,
  async (req, res) => {
    const organizerId = req.user._id;
    const tx = await Transaction.findOne({
      _id: req.params.transactionId,
      organizerId,
      status: 'paid',
    });
    if (!tx) return res.status(404).json({ message: 'Transaction not found' });
    if (!tx.razorpayPaymentId) {
      return res.status(400).json({ message: 'No payment to refund' });
    }
    await razorpay.payments.refund(tx.razorpayPaymentId, {
      amount: Math.round(tx.amount * 100),
    });
    tx.status = 'refunded';
    await tx.save();
    res.json({ message: 'Refund initiated' });
  }
);
