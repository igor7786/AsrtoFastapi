import { useEffect, useRef, useState } from 'react';
import { MailIcon, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@rcomp/ui/dialog';
import { cn } from '@rcomp/lib/utils';
import { navigate } from 'astro:transitions/client';
const EmailVerificationDialog = ({ errorMessage }: { errorMessage: string }) => {
  const err = errorMessage;
  const contentRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(true);
  function navigateUser() {
    navigate('/auth?tabs=signin', { history: 'replace' });
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
        return s - 1;
      });
    }, 1_000);

    const timeout = setTimeout(() => {
      setIsOpen(false); // auto-close after 30s
      navigateUser();
    }, 10_000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isOpen]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(val: boolean) => {
        setIsOpen(val);
        navigateUser();
      }}
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
            {err ? (
              <X className="text-red-500/90" />
            ) : (
              <MailIcon className="text-sky-600 dark:text-white" strokeWidth={1} />
            )}
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">
              {err ? 'Error verifying email. You will be redirected...' : null}
            </DialogTitle>
            <DialogDescription className="sm:text-center">
              {err ? (
                <span className="flex flex-col gap-2">
                  <span className="text-2xl text-red-500">{err}</span>
                  <strong className="text-primary">
                    This window will close in {seconds} seconds...
                  </strong>
                </span>
              ) : (
                <span>Just a moment...</span>
              )}
            </DialogDescription>
          </DialogHeader>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default EmailVerificationDialog;
