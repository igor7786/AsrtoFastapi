import { useMutation } from '@tanstack/react-query';
import { navigate } from 'astro:transitions/client';
import { client } from '@/lib/hono-adapter/orpc/client';
import { getQueryClient } from '@/lib/tan-stack/tanstack-query';
import type { RegisterInputSchemaFrontend } from '@/lib/types-schemas-validator/orpc-schemas-types/auth.login.register';
import type { UseFormReturn } from 'react-hook-form';
import { isOpen, isPending, isError, isUser } from '@/lib/stores/register';

export function useRegisterMutation(form: UseFormReturn<RegisterInputSchemaFrontend>) {
  const queryClient = getQueryClient();
  return useMutation(
    {
      mutationFn: async ({ email, password, name }: RegisterInputSchemaFrontend) =>
        await client.auth.register({ email, password, name }),

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
        isUser.set(data);
        form.reset();
      },
    },
    queryClient
  );
}
