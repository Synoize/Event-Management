import { z } from 'zod';

export const eventBaseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  images: z
    .array(
      z.object({
        url: z.string().url('Invalid image URL'),
        publicId: z.string().min(1, 'PublicId is required'),
      })
    )
    .optional(),
  city: z.string().min(1, 'City is required'),
  location: z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([z.number(), z.number()]), // [lng, lat]
  }),
  address: z.string().optional(),
  startTime: z.string().or(z.date()).pipe(z.coerce.date()),
  endTime: z.string().or(z.date()).pipe(z.coerce.date()),
  capacity: z.number().int().positive('Capacity must be positive'),
  enrollmentFee: z.number().nonnegative('Fee cannot be negative'),
  category: z.string().min(1, 'Category is required'),
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
  city: z.string().optional(),
  lat: z.string().optional(),
  lng: z.string().optional(),
  radiusKm: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});
