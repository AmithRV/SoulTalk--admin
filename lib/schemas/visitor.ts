import { z } from 'zod';

export const updateVisitorSchema = z.object({
  name: z.string().min(1, 'name rquired'),
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId'),
});
