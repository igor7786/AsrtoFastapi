import { createSelectSchema } from 'drizzle-zod';
import { user } from '@db/auth-schema';
import { session } from '@db/auth-schema';
import z from 'zod';

export const userSchema = createSelectSchema(user, {
  image: (f) => f.nullable().optional(),
});

const tokenSchema = createSelectSchema(session, {
  token: (f) => f.nullable().optional(), // string | null | undefined
});

export const registerResponseSchema = z.object({
  token: tokenSchema.shape.token,
  user: userSchema,
});

export const inputLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .email()
    .min(6, { message: 'Username must be at least 6 character long.' })
    .max(20, { message: 'Username cannot exceed 20 characters.' }),
  password: z
    .string()
    .trim()
    .min(2, { message: 'Password must be at least 2 characters long.' })
    .max(20, { message: 'Password cannot exceed 20 characters.' }),
});

export type LoginSchema = z.infer<typeof inputLoginSchema>;
export const inputRegisterSchema = inputLoginSchema.extend({
  name: z
    .string()
    .trim()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .max(20, { message: 'Name cannot exceed 20 characters.' }),
});

export type RegisterSchema = z.infer<typeof inputRegisterSchema>;

export const registerInputSchemaFrontend = inputLoginSchema
  .extend({
    repeatPassword: z
      .string()
      .trim()
      .min(2, { message: 'Password must be at least 2 characters long.' })
      .max(20, { message: 'Password cannot exceed 20 characters.' }),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: 'Passwords do not match',
    path: ['repeatPassword'],
  });
export type RegisterInputSchema = z.infer<typeof registerInputSchemaFrontend>;
export const outputLoginRegisterSchema = z.object({
  message: z.string().trim(),
});
