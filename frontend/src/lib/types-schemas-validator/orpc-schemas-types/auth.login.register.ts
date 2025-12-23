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
    .min(4, { message: 'Password must be at least 4 characters long.' })
    .max(20, { message: 'Password cannot exceed 20 characters.' }),
});
export type LoginSchema = z.infer<typeof inputLoginSchema>;

export const inputRegisterSchema = inputLoginSchema.extend({
  name: z
    .string()
    .trim()
    .min(4, { message: 'Name must be at least 4 characters long.' })
    .max(20, { message: 'Name cannot exceed 20 characters.' })
    .transform((val) => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()),
});
export type RegisterSchema = z.infer<typeof inputRegisterSchema>;

export const registerInputSchemaFrontend = inputRegisterSchema
  .extend({
    repeatPassword: z
      .string()
      .trim()
      .min(4, { message: 'Password must be at least 4 characters long.' })
      .max(20, { message: 'Password cannot exceed 20 characters.' }),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: 'Passwords do not match',
    path: ['repeatPassword'],
  });
export type RegisterInputSchemaFrontend = z.infer<typeof registerInputSchemaFrontend>;

export const outputLoginRegisterSchema = z.object({
  message: z.string().trim(),
  redirectTo: z.string().optional(),
});
export type OutputLoginRegisterSchema = z.infer<typeof outputLoginRegisterSchema>;
export const outputLoginRegisterSocialSchema = z.object({
  redirectTo: z.string().optional(),
});
export type OutputLoginRegisterSocialSchema = z.infer<typeof outputLoginRegisterSchema>;
