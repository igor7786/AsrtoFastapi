import { z } from 'zod';

export const tokenUrlSchema = z.enum(['token_already_used', 'token_expired']);
