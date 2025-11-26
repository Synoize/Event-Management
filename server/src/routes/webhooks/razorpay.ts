import { Router } from 'express';
import crypto from 'crypto';
import { Enrollment } from '../../models/Enrollment';
import { Transaction } from '../../models/Transaction';
import { Event } from '../../models/Event';

export const razorpayWebhookRouter = Router();

razorpayWebhookRouter.post('/', async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers['x-razorpay-signature'] as string;
  const body = JSON.stringify(req.body);

  if (!secret || !signature) {
    return res.status(400).json({ message: 'Missing webhook configuration' });
  }

  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
  if (expected !== signature) {
    return res.status(400).json({ message: 'Invalid webhook signature' });
  }

  const eventType = req.body.event;
  if (eventType === 'payment.captured') {
    const payment = req.body.payload.payment.entity;
    const orderId = payment.order_id;
    const paymentId = payment.id;

    const enrollment = await Enrollment.findOne({ razorpayOrderId: orderId });
    if (enrollment) {
      enrollment.status = 'paid';
      enrollment.razorpayPaymentId = paymentId;
      await enrollment.save();

      const tx = await Transaction.findOne({ razorpayOrderId: orderId });
      if (tx) {
        tx.status = 'paid';
        tx.razorpayPaymentId = paymentId;
        await tx.save();
      }

      const ev = await Event.findById(enrollment.eventId);
      if (ev) {
        ev.enrolledCount += 1;
        await ev.save();
      }
    }
  }

  res.json({ status: 'ok' });
});


