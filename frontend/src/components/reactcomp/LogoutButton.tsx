import { actions, isInputError } from 'astro:actions';
import { withState } from '@astrojs/react/actions';
import { startTransition, useActionState, useEffect } from 'react';
import { getQueryClient } from '@/lib/tan-stack/tanstack-query';

import toast from 'react-hot-toast';
import { navigate } from 'astro:transitions/client';

export default function LogoutButton() {
  const [state, action, pending] = useActionState(withState(actions.logout.logoutUser), {
    data: { success: false },
    error: undefined,
  });

  const queryClient = getQueryClient();

  const handleLogout = () => {
    toast.loading('Logging out...', { id: 'logout-toast' });
    startTransition(() => action(new FormData()));
  };

  // 🧹 Clear client cache when logout succeeds
  useEffect(() => {
    if (state.data?.success) {
      queryClient.clear(); // Clear React Query cache

      toast.success('Signed out successfully', { id: 'logout-toast' });
      const timer = setTimeout(() => {
        navigate('/');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state, queryClient]);

  return (
    <button
      onClick={handleLogout}
      disabled={pending}
      className="text-sm text-green-500 hover:underline disabled:opacity-50 dark:text-green-400"
    >
      Logout
    </button>
  );
}
