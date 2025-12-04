import mongoose, { Schema } from 'mongoose';

const eventSchema = new Schema(
  {
    organizerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
    city: { type: String, required: true },
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

export const Event = mongoose.model('Event', eventSchema);
