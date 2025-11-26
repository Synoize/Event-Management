import { z } from 'zod';

export const eventBaseSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  images: z.array(z.string()).optional(),
  location: z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([z.number(), z.number()]), // [lng, lat]
  }),
  address: z.string().optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  capacity: z.number().int().positive(),
  enrollmentFee: z.number().nonnegative(),
  category: z.string().min(1),
  tags: z.array(z.string()).optional(),
});

export const eventCreateSchema = eventBaseSchema.extend({
  status: z.enum(['draft', 'published', 'cancelled']).optional(),
});

export const eventUpdateSchema = eventBaseSchema.partial().extend({
  status: z.enum(['draft', 'published', 'cancelled']).optional(),
});

export const participantSearchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  isFree: z
    .string()
    .transform((v) => (v === 'true' ? true : v === 'false' ? false : undefined))
    .optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  lat: z.string().optional(),
  lng: z.string().optional(),
  radiusKm: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});


