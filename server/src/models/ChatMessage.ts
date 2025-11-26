import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IChatMessage extends Document {
  eventId: Types.ObjectId;
  senderId: Types.ObjectId;
  senderRole: 'participant' | 'organizer';
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const chatMessageSchema = new Schema<IChatMessage>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    senderRole: { type: String, enum: ['participant', 'organizer'], required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

chatMessageSchema.index({ eventId: 1, createdAt: 1 });

export const ChatMessage = mongoose.model<IChatMessage>('ChatMessage', chatMessageSchema);


