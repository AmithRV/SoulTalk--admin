import { z } from 'zod';

export const addCategorySchema = z.object({
  name: z.string().min(1, 'name rquired'),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1, 'name rquired'),
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId'),
});
