import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IEnrollment extends Document {
  participantId: Types.ObjectId;
  eventId: Types.ObjectId;
  status: 'pending' | 'paid' | 'cancelled' | 'refunded';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
}

const enrollmentSchema = new Schema<IEnrollment>(
  {
    participantId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    status: {
      type: String,
      enum: ['pending', 'paid', 'cancelled', 'refunded'],
      default: 'pending',
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
  },
  { timestamps: true }
);

enrollmentSchema.index({ participantId: 1, eventId: 1 }, { unique: true });

export const Enrollment = mongoose.model<IEnrollment>('Enrollment', enrollmentSchema);


