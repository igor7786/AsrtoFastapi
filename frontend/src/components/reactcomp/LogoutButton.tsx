import { actions } from 'astro:actions';
import { Spinner } from '@/components/reactcomp/spinner';
import { withState } from '@astrojs/react/actions';
import { startTransition, useActionState, useEffect } from 'react';
import { getQueryClient } from '@/lib/tan-stack/tanstack-query';
import { toast } from 'sonner';
import { Check, X } from 'lucide-react';

export default function LogoutButton() {
  const [state, action, pending] = useActionState(withState(actions.logout.logoutUser), {
    data: { success: false },
    error: undefined,
  });

  const queryClient = getQueryClient();

  const handleLogout = () => {
    queryClient.clear();
    startTransition(() => action(new FormData()));
  };

  useEffect(() => {
    const idToast = 'logout-toast';
    if (pending) {
      toast(
        <div className="flex items-center gap-2">
          <Spinner className="text-orange-500" />
          <span>Logging out...</span>
        </div>,
        {
          id: idToast,
          duration: Infinity,
        }
      );
    } else if (state?.error) {
      toast(
        <div className="flex items-center gap-2">
          <X className="text-red-500" />
          <span>{state.error.message ?? 'Failed to logout.'}</span>
        </div>,
        {
          id: idToast,
          duration: 1000,
        }
      );
    } else if (state?.data?.success) {
      toast(
        <div className="flex items-center gap-2">
          <Check className="text-green-500" />
          <span>Logged out successfully.</span>
        </div>,
        {
          id: idToast,
          duration: 1000,
        }
      );
      const timer = setTimeout(() => {
        window.location.replace('/loginshadcn');
      }, 500);
      return () => {
        clearTimeout(timer);
      };
    }

    // ✅ Clean up toast on component unmount
  }, [pending, state]);

  return (
    <button
      type="submit"
      onClick={handleLogout}
      disabled={pending}
      className="text-sm text-green-500 hover:underline disabled:opacity-50 dark:text-green-400"
    >
      Logout
    </button>
  );
}
