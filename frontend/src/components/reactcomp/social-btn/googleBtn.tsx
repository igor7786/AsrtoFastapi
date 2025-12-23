import { Button } from '@rcomp/ui/button';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/tan-stack/tanstack-query';
import { navigate } from 'astro:transitions/client';
import { Check, GalleryVerticalEnd, X } from 'lucide-react';
import { Spinner } from '@rcomp/spinner';
import { client } from '@/lib/hono-adapter/orpc/client';
import { RippleButton } from '../magicui/ripple-button';

export function GoogleBtn() {
  const queryClient = getQueryClient();
  const idToast = 'login-toast';
  const mutation = useMutation(
    {
      mutationFn: async () => await client.authSocial.google(),

      onMutate: async () => {
        toast(
          <div className="flex items-center gap-2">
            <Spinner className="text-orange-500" />
            <span>Logging to Google...</span>
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
        await new Promise((resolve) => setTimeout(resolve, 500));
        toast(
          <div className="flex items-center gap-2">
            <Check className="text-green-500" />
            <span>Redirecting to Google</span>
          </div>,
          {
            id: idToast,
            duration: 1000,
          }
        );
        navigate(`${data.redirectTo}`, { history: 'replace' });
      },
    },
    queryClient
  );

  return (
    <Button onClick={() => mutation.mutate()} variant="outline" className="w-full">
      {mutation.isPending ? (
        <div className="flex w-full items-center justify-center gap-4">
          <span>Logging to Google</span>
          <Spinner variant="default" className="h-4 w-4 text-amber-50" size={10} />
        </div>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
              fill="currentColor"
            />
          </svg>
          <span>Login with Google</span>
        </>
      )}
    </Button>
  );
}
