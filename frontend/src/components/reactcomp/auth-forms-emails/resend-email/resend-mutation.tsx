import { useMutation } from '@tanstack/react-query';
import { client } from '@/lib/hono-adapter/orpc/client';
import { getQueryClient } from '@/lib/tan-stack/tanstack-query';
import type { LoginSchema } from '@/lib/types-schemas-validator/orpc-schemas-types/auth.login.register';
import type { UseFormReturn } from 'react-hook-form';
import { isOpen, isPending, isError, isUser } from '@/lib/stores/register';
import { navigate } from 'astro:transitions/client';

export function useResendEmailMutation(form: UseFormReturn<LoginSchema>) {
  const queryClient = getQueryClient();
  return useMutation(
    {
      mutationFn: async ({ email, password }: LoginSchema) =>
        await client.authEmail.resendEmail({ email, password }),

      onMutate: async () => {
        isOpen.set(true);
        isPending.set(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      },

      onError: async (error) => {
        isPending.set(false);
        isError.set(error.message ?? 'Failed to create account.');
      },

      onSuccess: async (data) => {
        isError.set('');
        isPending.set(false);
        // isUser.set(data);
        form.reset();
        navigate(data.redirectTo, { history: 'replace' });
      },
    },
    queryClient
  );
}
