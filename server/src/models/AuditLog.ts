import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IAuditLog extends Document {
  adminId: Types.ObjectId;
  action: string;
  targetType: 'user' | 'organizer' | 'event' | 'transaction' | 'enrollment';
  targetId?: Types.ObjectId;
  metadata?: Record<string, unknown>;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    targetType: {
      type: String,
      enum: ['user', 'organizer', 'event', 'transaction', 'enrollment'],
      required: true,
    },
    targetId: { type: Schema.Types.ObjectId },
    metadata: Schema.Types.Mixed,
  },
  { timestamps: true }
);

auditLogSchema.index({ createdAt: -1 });

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', auditLogSchema);


