import { z } from 'astro:schema';

export const loginSchema = z.object({
  name: z
    .string()
    .min(6, { message: 'Username must be at least 6 character long.' })
    .max(20, { message: 'Username cannot exceed 20 characters.' }),
  password: z
    .string()
    .min(4, { message: 'Password must be at least 4 characters long.' })
    .max(20, { message: 'Password cannot exceed 20 characters.' }),
});

export type LoginSchema = z.infer<typeof loginSchema>;
