import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registrationSchema = z.object({
  email: z.email('Invalid email'),
  name: z.string().min(3, 'Password must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
