import { actions, isInputError } from 'astro:actions';
import { withState } from '@astrojs/react/actions';
import { startTransition, useActionState, useEffect, useRef } from 'react';
import { getQueryClient } from '@/lib/tan-stack/tanstack-query';

import toast from 'react-hot-toast';
import { navigate } from 'astro:transitions/client';
import { CustomToaster } from './custom-toast';

export default function LogoutButton() {
  const [state, action, pending] = useActionState(withState(actions.logout.logoutUser), {
    data: { success: false },
    error: undefined,
  });
  const toastIdRef = useRef<string | null>(null);
  const isDark = useRef<boolean | null>(null);
  const queryClient = getQueryClient();

  const handleLogout = () => {
    const htmlClass = document.documentElement.className;
    isDark.current = htmlClass.includes('dark');
    toastIdRef.current = toast.loading('Logging you out.....', {
      id: 'login-toast',
    });
    startTransition(() => action(new FormData()));
  };

  // 🧹 Clear client cache when logout succeeds

  useEffect(() => {
    if (state.error) {
      if (isInputError(state.error)) {
        const fieldErrors = state.error.fields as Record<string, string[] | undefined>;
        const messages = [...(fieldErrors.name ?? []), ...(fieldErrors.password ?? [])];
        toast.error(messages.join('\n'), { id: 'logout-toast' });
      } else {
        toast.error(state.error.message, { id: 'logout-toast' });
      }
    } else if (state.data?.success) {
      toast.success(`Signed out successfully! Redirecting...`, {
        id: 'login-toast',
      });

      const timer = setTimeout(() => {
        navigate('/');
      }, 1000);

      return () => clearTimeout(timer);
    }
    // ✅ No toast dismiss in cleanup
  }, [state, queryClient]);

  return (
    <>
      <button
        type="submit"
        onClick={handleLogout}
        disabled={pending}
        className="text-sm text-green-500 hover:underline disabled:opacity-50 dark:text-green-400"
      >
        Logout
      </button>
    </>
  );
}
