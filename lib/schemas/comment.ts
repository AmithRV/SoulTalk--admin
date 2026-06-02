import { z } from 'zod';

export const addCommentSchema = z.object({
  name: z.string().min(1, 'name rquired'),
  pageId: z.string().min(1, 'pageId rquired'),
  comment: z.string().min(1, 'comment rquired'),
});

export const updateCommentSchema = z.object({
  name: z.string().min(1, 'name rquired'),
  pageId: z.string().min(1, 'pageId rquired'),
  comment: z.string().min(1, 'comment rquired'),
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId'),
});
