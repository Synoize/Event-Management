import { Router } from 'express';
import crypto from 'crypto';
import { Enrollment } from '../../models/Enrollment.js';
import { Transaction } from '../../models/Transaction.js';
import { Event } from '../../models/Event.js';

export const razorpayWebhookRouter = Router();

const razorpaySecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'webhook_secret';

console.log("razorpaySecret: ", razorpaySecret);


razorpayWebhookRouter.post('/payment.captured', async (req, res) => {
  const { event: eventType, payload } = req.body;

  // Verify HMAC signature
  const signature = req.headers['x-razorpay-signature'];
  const shasum = crypto
    .createHmac('sha256', razorpaySecret)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (signature !== shasum) {
    return res.status(400).json({ message: 'Invalid signature' });
  }

  if (eventType !== 'payment.captured') {
    return res.status(400).json({ message: 'Invalid event' });
  }

  const { order: { receipt } } = payload;

  const enrollment = await Enrollment.findOne({ orderId: receipt });
  if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });

  enrollment.paymentStatus = 'paid';
  await enrollment.save();

  const tx = await Transaction.findOne({ razorpayOrderId: receipt });
  if (tx) {
    tx.status = 'paid';
    await tx.save();
  }

  const event = await Event.findById(enrollment.eventId);
  if (event) {
    if (!event.enrolledCount) event.enrolledCount = 0;
    event.enrolledCount += 1;
    await event.save();
  }

  res.json({ ok: true });
});
