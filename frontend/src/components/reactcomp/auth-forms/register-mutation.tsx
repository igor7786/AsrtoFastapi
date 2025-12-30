import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { navigate } from 'astro:transitions/client';
import { Check, X } from 'lucide-react';
import { Spinner } from '@rcomp/spinner';
import { client } from '@/lib/hono-adapter/orpc/client';
import { getQueryClient } from '@/lib/tan-stack/tanstack-query';
import type { RegisterInputSchemaFrontend } from '@/lib/types-schemas-validator/orpc-schemas-types/auth.login.register';
import type { UseFormReturn } from 'react-hook-form';

export function useRegisterMutation(form: UseFormReturn<RegisterInputSchemaFrontend>) {
  const queryClient = getQueryClient();
  const idToast = 'login-toast';
  return useMutation(
    {
      mutationFn: async ({ email, password, name }: RegisterInputSchemaFrontend) =>
        await client.auth.register({ email, password, name }),

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
        await new Promise((resolve) => setTimeout(resolve, 500));
      },

      onError: async (error) => {
        toast(
          <div className="flex items-center gap-2">
            <X className="text-red-500" />
            <span>{error.message ?? 'Failed to create account.'}</span>
          </div>,
          {
            id: idToast,
            duration: 1000,
          }
        );
      },

      onSuccess: async (data) => {
        const fullPathWithQuery = window.location.pathname + window.location.search;
        console.log(fullPathWithQuery);
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
          if (data.redirectTo) {
            navigate(data.redirectTo);
          } else {
            navigate(fullPathWithQuery, { history: 'replace' });
          }
        }, 500);
        return () => {
          clearTimeout(timer);
        };
      },
    },
    queryClient
  );
}
