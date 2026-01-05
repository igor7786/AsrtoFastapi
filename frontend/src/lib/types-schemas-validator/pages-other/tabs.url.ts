import { z } from 'zod';

export const tabsUrlSchema = z.enum(['signin', 'signup']);
