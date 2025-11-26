import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IEvent extends Document {
  organizerId: Types.ObjectId;
  title: string;
  description: string;
  images: string[];
  location: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  address?: string;
  startTime: Date;
  endTime: Date;
  capacity: number;
  enrolledCount: number;
  enrollmentFee: number;
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'cancelled';
}

const eventSchema = new Schema<IEvent>(
  {
    organizerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [String],
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    address: String,
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    capacity: { type: Number, required: true },
    enrolledCount: { type: Number, default: 0 },
    enrollmentFee: { type: Number, required: true },
    category: { type: String, required: true },
    tags: [String],
    status: {
      type: String,
      enum: ['draft', 'published', 'cancelled'],
      default: 'draft',
    },
  },
  { timestamps: true }
);

eventSchema.index({ location: '2dsphere' });

export const Event = mongoose.model<IEvent>('Event', eventSchema);


