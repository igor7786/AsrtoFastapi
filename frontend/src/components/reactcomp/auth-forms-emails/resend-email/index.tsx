import { ResendEmailForm } from '@/components/reactcomp/auth-forms-emails/resend-email/ResendEmailForm';
import { Suspense } from 'react';
import FullPageLoader from '@rcomp/skeleton-dashboard-page';
import { motion } from 'motion/react';
import ThemeToggleShell from '@rcomp/theme-toggle-button/ThemeModeToogle';
import { BorderBeam } from '@rcomp/magicui/border-beam';

export function ResendEmailUser() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="mx-auto flex w-full max-w-md flex-col items-center">
        <Suspense fallback={<FullPageLoader props="Auth" />}>
          <ThemeToggleShell className="absolute top-4 right-4 hidden md:inline-flex" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="border-border bg-background relative w-full rounded-2xl border p-6 shadow-xl"
          >
            {/* FORM */}
            <ResendEmailForm />

            {/* BORDER ANIMATION */}
            <BorderBeam size={200} duration={8} borderWidth={2} className="rounded-2xl" />
          </motion.div>
        </Suspense>
      </div>
    </div>
  );
}
