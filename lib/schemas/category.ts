import { z } from 'zod';

export const addCategorySchema = z.object({
  description: z.string().optional(),
  name: z.string().min(1, 'name rquired'),
  path: z.string().min(1, 'path rquired'),
});

export const updateCategorySchema = z.object({
  description: z.string().optional(),
  name: z.string().min(1, 'name rquired'),
  path: z.string().min(1, 'path rquired'),
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId'),
});
