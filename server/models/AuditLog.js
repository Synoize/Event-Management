import mongoose, { Schema } from 'mongoose';

const auditLogSchema = new Schema(
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

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
