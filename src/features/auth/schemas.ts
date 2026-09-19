import { z } from 'zod';
import { GENRES } from '@/types';

const email = z.email('Enter a valid email address');

export const loginSchema = z.object({
  email,
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  name: z.string().trim().min(2, 'Tell us what to call you'),
  email,
  password: z
    .string()
    .min(8, 'Use at least 8 characters')
    .regex(/\d/, 'Include at least one number'),
  genres: z.array(z.enum(GENRES)),
});

export const resetSchema = z.object({ email });

export type LoginForm = z.infer<typeof loginSchema>;
export type SignupForm = z.infer<typeof signupSchema>;
export type ResetForm = z.infer<typeof resetSchema>;
