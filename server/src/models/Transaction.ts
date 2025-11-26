import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ITransaction extends Document {
  participantId: Types.ObjectId;
  organizerId: Types.ObjectId;
  eventId: Types.ObjectId;
  enrollmentId: Types.ObjectId;
  amount: number;
  currency: string;
  status: 'created' | 'paid' | 'refunded' | 'failed';
  razorpayOrderId: string;
  razorpayPaymentId?: string;
}

const transactionSchema = new Schema<ITransaction>(
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

export const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);


