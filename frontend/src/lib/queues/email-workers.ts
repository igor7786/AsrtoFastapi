import { Worker } from 'bullmq';
import { redis } from '@/lib/queues/redis';
import { resend } from '@/lib/resend-email';
import { WelcomeEmail } from '@rcomp/auth-forms-emails/emails/VerificationEmail'; // adjust to your path
console.log('Email worker started');
new Worker(
  'emails',
  async (job) => {
    if (job.name === 'verifyEmail') {
      const { email, verifyUrl, user } = job.data;
      await resend.emails.send({
        from: 'Verification <no-reply@fast-web-tech.co.uk>',
        to: 'grimuta60@gmail.com',
        subject: 'Email Verification',
        react: WelcomeEmail({
          user: user,
          newUrl: verifyUrl,
        }),
      });
    }
  },
  // @ts-ignore

  { connection: redis }
);
