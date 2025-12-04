import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const organizerRegisterSchema = registerSchema.extend({
  organizationName: z.string().min(1),
  officialId: z.string().min(1),
  kycDocuments: z.array(z.string()).optional(),
});

export const adminLoginSchema = loginSchema;
