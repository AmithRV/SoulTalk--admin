import { z } from 'zod';

export const addPageSchema = z.object({
  imageName: z.string().optional(),
  url: z.string().min(1, 'url rquired'),
  name: z.string().min(1, 'name rquired'),
  publicUrl: z.string().min(1, 'public url rquired'),
  description: z.string().min(1, 'public url rquired'),
});

export const updatePageSchema = z.object({
  imageName: z.string().optional(),
  url: z.string().min(1, 'url rquired'),
  name: z.string().min(1, 'name rquired'),
  publicUrl: z.string().min(1, 'public url rquired'),
  description: z.string().min(1, 'public url rquired'),
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId'),
});
