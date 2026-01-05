import { useEffect, useRef, useState } from 'react';
import { MailIcon, X } from 'lucide-react';
import {
  isPending as pending,
  isOpen as open,
  isError as error,
  isUser as user,
} from '@/lib/stores/register';
import { useStore } from '@nanostores/react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@rcomp/ui/dialog';
import { Spinner } from '@rcomp/spinner';
import { cn } from '@rcomp/lib/utils';
import { navigate } from 'astro:transitions/client';
const EmailVerificationDialog = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const isOpen = useStore(open);
  const isPending = useStore(pending);
  const isError = useStore(error);
  const isUser = useStore(user);

  function navigateUser() {
    navigate(isUser!.redirectTo, { history: 'replace' });
  }

  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!isOpen) return;

    setSeconds(10); // reset when opening

    const interval = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(interval);
          return 0;
        }
        console.log(isUser);
        return s - 1;
      });
    }, 1_000);

    const timeout = setTimeout(() => {
      open.set(false); // auto-close after 30s
      navigateUser();
    }, 10_000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isOpen, isUser]);

  return (
    <Dialog
      open={isOpen}
      {...(!isPending && {
        onOpenChange: (val: boolean) => {
          open.set(val);
          navigateUser();
        },
      })}
    >
      <DialogContent
        ref={contentRef}
        tabIndex={-1}
        className="focus:outline-none sm:max-w-md"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          contentRef.current?.focus();
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <div
            className={cn(
              'flex size-10 shrink-0 items-center justify-center rounded-full bg-sky-600/10 dark:bg-sky-400'
            )}
            aria-hidden="true"
          >
            {isPending ? (
              <Spinner className="text-sky-600 dark:text-white" />
            ) : isError ? (
              <X className="text-red-500/90" />
            ) : (
              <MailIcon className="text-sky-600 dark:text-white" strokeWidth={1} />
            )}
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">
              {isPending
                ? 'Sending verification email...'
                : isError
                  ? 'Error sending verification email.'
                  : isUser?.email
                    ? 'Verify your email address'
                    : null}
            </DialogTitle>
            <DialogDescription className="sm:text-center">
              {isPending ? (
                <span>Just a moment...</span>
              ) : isError ? (
                <div className="flex flex-col gap-2">
                  <span className="text-2xl text-red-500">{isError}</span>
                  <strong className="text-primary">
                    This window will close in {seconds} seconds...
                  </strong>
                </div>
              ) : isUser?.email ? (
                <span>
                  Welcome <strong className="text-amber-500">{isUser.name}</strong>!
                  <br />
                  We’ve sent a verification email to{' '}
                  <strong className="text-amber-500">{isUser.email}</strong>. Please check your inbox to
                  activate your account.
                  <br />
                  If you don’t see the email, be sure to check your{' '}
                  <strong className="text-red-500">Spam</strong> or{' '}
                  <strong className="text-red-500">Junk</strong> folder.
                  <br />
                  <strong className="text-primary">
                    This window will close in {seconds} seconds...
                  </strong>
                </span>
              ) : null}
            </DialogDescription>
          </DialogHeader>
        </div>
        {isUser?.email && (
          <p className="text-center text-sm">
            Didn&apos;t get a email?{' '}
            <a className="text-sky-600 hover:underline dark:text-sky-400" href="#">
              Resend
            </a>
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};
export default EmailVerificationDialog;
