import { useRef } from 'react';
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
const EmailVerificationDialog = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const isOpen = useStore(open);
  const isPending = useStore(pending);
  const isError = useStore(error);
  const isUser = useStore(user);
  // onOpenChange={(val) => open.set(val)}
  return (
    <Dialog
      open={isOpen}
      {...(!isPending && {
        onOpenChange: (val: boolean) => open.set(val),
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
                <span className="text-2xl text-red-500">{isError}</span>
              ) : isUser?.email ? (
                <span>
                  Welcome <strong>{isUser.name}</strong>. We have sent a verification email to{' '}
                  <strong>{isUser.email}</strong>. Please check your inbox to activate your account!{' '}
                  <br />
                  <strong className="text-primary">This window will close automatically.</strong>
                </span>
              ) : null}
            </DialogDescription>
          </DialogHeader>
        </div>
        <p className="text-center text-sm">
          Didn&apos;t get a email?{' '}
          <a className="text-sky-600 hover:underline dark:text-sky-400" href="#">
            Resend
          </a>
        </p>
      </DialogContent>
    </Dialog>
  );
};
export default EmailVerificationDialog;
