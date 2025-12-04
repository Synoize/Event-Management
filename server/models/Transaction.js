import mongoose, { Schema } from 'mongoose';

const transactionSchema = new Schema(
  {
    participantId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    organizerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    enrollmentId: { type: Schema.Types.ObjectId, ref: 'Enrollment', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: {
      type: String,
      enum: ['created', 'paid', 'refunded', 'failed'],
      default: 'created',
    },
    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: String,
  },
  { timestamps: true }
);

transactionSchema.index({ createdAt: -1 });

export const Transaction = mongoose.model('Transaction', transactionSchema);
