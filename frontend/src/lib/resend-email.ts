import { Resend } from 'resend';
import { envServer } from '@/lib/env/env.server';

export const resend = new Resend(envServer.RESEND_EMAIL);
