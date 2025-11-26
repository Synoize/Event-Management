import mongoose, { Document, Schema } from 'mongoose';

export type UserRole = 'participant' | 'organizer' | 'admin';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  isEmailVerified: boolean;
  // Organizer specific
  organizationName?: string;
  officialId?: string;
  kycDocuments?: string[];
  verificationStatus?: 'pending' | 'verified' | 'rejected';
  isSuspended: boolean;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['participant', 'organizer', 'admin'], required: true },
    isEmailVerified: { type: Boolean, default: false },
    organizationName: String,
    officialId: String,
    kycDocuments: [String],
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    isSuspended: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);


