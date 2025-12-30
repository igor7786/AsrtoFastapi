import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { navigate } from 'astro:transitions/client';
import { Check, X } from 'lucide-react';
import { Spinner } from '@rcomp/spinner';
import { client } from '@/lib/hono-adapter/orpc/client';
import { getQueryClient } from '@/lib/tan-stack/tanstack-query';
import type { LoginSchema } from '@/lib/types-schemas-validator/orpc-schemas-types/auth.login.register';
import { pending } from '@/lib/stores/pending';
import type { UseFormReturn } from 'react-hook-form';

export function useLoginMutation(form: UseFormReturn<LoginSchema>) {
  const queryClient = getQueryClient();
  const idToast = 'login-toast';

  return useMutation(
    {
      mutationFn: async ({ email, password }: LoginSchema) =>
        await client.auth.login({ email, password }),

      onMutate: async () => {
        toast(
          <div className="flex items-center gap-2">
            <Spinner className="text-orange-500" />
            <span>Saving your information...</span>
          </div>,
          {
            id: idToast,
            duration: Infinity,
          }
        );
        pending.set(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
      },

      onError: async (error) => {
        toast(
          <div className="flex items-center gap-2">
            <X className="text-red-500" />
            <span>{error.message ?? 'Failed to update account.'}</span>
          </div>,
          {
            id: idToast,
            duration: 1000,
          }
        );
        pending.set(false);
      },

      onSuccess: async (data) => {
        const fullPathWithQuery = window.location.pathname + window.location.search;
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
        form.reset();
        const timer = setTimeout(() => {
          pending.set(false);
          navigate(fullPathWithQuery, { history: 'replace' });
        }, 500);
        return () => {
          clearTimeout(timer);
        };
      },
    },
    queryClient
  );
}
