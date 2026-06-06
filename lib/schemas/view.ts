import { z } from 'zod';

export const addViewSchema = z.object({
  country: z.string().min(1, 'country rquired'),
  visitorId: z.string().min(1, 'visitorId rquired'),
  pageId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId'),
});

export const updateViewSchema = z.object({
  country: z.string().min(1, 'country rquired'),
  visitorId: z.string().min(1, 'visitorId rquired'),
  pageId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId'),
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId'),
});
