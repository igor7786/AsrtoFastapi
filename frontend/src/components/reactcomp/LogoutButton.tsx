import { Spinner } from '@/components/reactcomp/spinner';
import { getQueryClient } from '@/lib/tan-stack/tanstack-query';
import { toast } from 'sonner';
import { Check, X } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { client } from '@hono-adapt/orpc/client';
import { Button } from '@rcomp/ui/button';
import { $nanoUser } from '@/lib/stores/user';
import { navigate } from 'astro:transitions/client';

export default function LogoutButton() {
  const queryClient = getQueryClient();
  const idToast = 'login-toast';
  const mutation = useMutation(
    {
      mutationFn: async () => await client.auth.logout(),

      onMutate: async () => {
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
        await new Promise((resolve) => setTimeout(resolve, 500));
      },

      onError: async (error) => {
        toast(
          <div className="flex items-center gap-2">
            <X className="text-red-500" />
            <span>{error.message ?? 'Failed to logout from account.'}</span>
          </div>,
          {
            id: idToast,
            duration: 1000,
          }
        );
      },

      onSuccess: async (data) => {
        toast(
          <div className="flex items-center gap-2">
            <Check className="text-green-500" />
            <span>{data.message}</span>
          </div>,
          {
            id: idToast,
            duration: 1000,
          }
        );
        const timer = setTimeout(() => {
          navigate('/', { history: 'replace' });
        }, 500);
        return () => {
          clearTimeout(timer);
        };
      },
    },
    queryClient
  );

  const handleLogout = () => {
    queryClient.clear();
    // Clear in-memory state
    $nanoUser.set(null);
    // cleanStores($nanoUser);

    // Clear persistent storage
    mutation.mutate();
  };

  return (
    <Button
      onClick={handleLogout}
      disabled={mutation.isPending}
      size="sm"
      className="text-primary-foreground bg-emerald-700 md:inline-flex"
    >
      Logout
    </Button>
  );
}
