import { Router } from 'express';
import crypto from 'crypto';
import { authenticate, requireRole } from '../../middleware/auth';
import { Event } from '../../models/Event';
import { Enrollment } from '../../models/Enrollment';
import { Transaction } from '../../models/Transaction';
import { getRazorpay } from '../../config/razorpay';

export const participantEnrollmentRouter = Router();

participantEnrollmentRouter.post(
  '/:eventId',
  authenticate,
  requireRole('participant'),
  async (req, res) => {
    const user = req.user!;
    const event = await Event.findById(req.params.eventId);
    if (!event || event.status !== 'published') {
      return res.status(404).json({ message: 'Event not available' });
    }
    if (event.enrolledCount >= event.capacity) {
      return res.status(400).json({ message: 'No seats available' });
    }

    let enrollment = await Enrollment.findOne({
      participantId: user._id,
      eventId: event._id,
    });
    if (!enrollment) {
      enrollment = await Enrollment.create({
        participantId: user._id,
        eventId: event._id,
      });
    }

    const amountPaise = Math.round(event.enrollmentFee * 100);
    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: `enrollment_${enrollment.id}`,
    });

    enrollment.razorpayOrderId = order.id;
    await enrollment.save();

    const tx = await Transaction.create({
      participantId: user._id,
      organizerId: event.organizerId,
      eventId: event._id,
      enrollmentId: enrollment._id,
      amount: event.enrollmentFee,
      currency: 'INR',
      status: 'created',
      razorpayOrderId: order.id,
    });

    res.status(201).json({ order, enrollmentId: enrollment.id, transactionId: tx.id });
  }
);

participantEnrollmentRouter.get(
  '/',
  authenticate,
  requireRole('participant'),
  async (req, res) => {
    const enrollments = await Enrollment.find({ participantId: req.user!._id }).populate('eventId');
    res.json({ data: enrollments });
  }
);

// Simple client-side payment verification (Razorpay recommends webhooks; see webhook route)
participantEnrollmentRouter.post(
  '/:id/verify',
  authenticate,
  requireRole('participant'),
  async (req, res) => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment || enrollment.participantId.toString() !== req.user!._id.toString()) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    const hmac = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');
    if (hmac !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid signature' });
    }
    enrollment.status = 'paid';
    enrollment.razorpayPaymentId = razorpay_payment_id;
    enrollment.razorpaySignature = razorpay_signature;
    await enrollment.save();

    const tx = await Transaction.findOne({ razorpayOrderId: razorpay_order_id });
    if (tx) {
      tx.status = 'paid';
      tx.razorpayPaymentId = razorpay_payment_id;
      await tx.save();
    }

    const event = await Event.findById(enrollment.eventId);
    if (event) {
      event.enrolledCount += 1;
      await event.save();
    }

    res.json({ message: 'Payment verified' });
  }
);


