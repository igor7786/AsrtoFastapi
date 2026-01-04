import { z } from 'zod';
export const inputVerifyEmailSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  callbackURL: z.string().optional(),
});

export const verifyEmailOutputSchema = z.union([
  // Redirect with cookies (success)
  z.object({
    status: z.literal(302).describe('Redirect'),
    headers: z.object({
      location: z.string(),
      'set-cookie': z.array(z.string()).optional(),
    }),
  }),

  // Success without redirect (rare but supported)
  z.object({
    status: z.literal(200).describe('Success'),
    body: z.object({
      status: z.literal(true),
      user: z.any().nullable(),
    }),
  }),
]);
