import { zodResolver } from '@hookform/resolvers/zod';
import { GalleryVerticalEnd, X, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { cn } from '@rcomp/lib/utils';
import { Spinner } from '@rcomp/spinner';
import { AuroraText } from '@rcomp/magicui/aurora-text';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@rcomp/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rcomp/ui/form';
import { Input } from '@rcomp/ui/input';
import { RippleButton } from '@/components/reactcomp/magicui/ripple-button';
import {
  registerInputSchemaFrontend,
  type RegisterInputSchemaFrontend,
} from '@/lib/types-schemas-validator/orpc-schemas-types/auth.login.register';
import { getQueryClient } from '@/lib/tan-stack/tanstack-query';
import { useMutation } from '@tanstack/react-query';
import { client } from '@/lib/hono-adapter/orpc/client';
import { navigate } from 'astro:transitions/client';

export function RegisterForm({ className, ...props }: React.ComponentProps<'div'>) {
  const queryClient = getQueryClient();
  // 1. Define your form.
  const form = useForm<RegisterInputSchemaFrontend>({
    resolver: zodResolver(registerInputSchemaFrontend),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      repeatPassword: '',
    },
    mode: 'onChange',
  });
  // 2. Define a submit handler.
  const idToast = 'login-toast';
  const mutation = useMutation(
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
            <span>{error.message ?? 'Failed to update account.'}</span>
          </div>,
          {
            id: idToast,
            duration: 1000,
          }
        );
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

  // 3. Use the useForm return values.
  const onSubmit = form.handleSubmit((formData) => {
    const { email, password, name } = formData;
    mutation.mutate({ email, password, name, repeatPassword: password });
  });
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-4 py-4">
      <a href="#" className="flex items-center gap-2 self-center font-medium">
        <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
          <GalleryVerticalEnd className="size-4" />
        </div>
        Acme Inc.
      </a>
      <div className={cn('flex flex-col gap-6', className)} {...props}>
        <Card className="relative overflow-hidden border-none shadow-none ring-0">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">
              <AuroraText className="mb-2 text-3xl font-bold">Sign up to get started</AuroraText>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground after:border-primary relative py-4 text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t dark:after:border-red-400">
              <span className="bg-card text-muted-foreground relative z-10 px-2">
                All fields are required
              </span>
            </div>
            {/*#! Form*/}
            <Form {...form}>
              <form onSubmit={onSubmit} className="space-y-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          className={`text-foreground autofill:text-input border-[1px] focus-visible:border-green-500/50 focus-visible:ring-0`}
                          type="text"
                          placeholder="John Doe"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      {/* ✅ Conditionally show FormMessage or FormDescription */}
                      {form.watch('name').length > 0 && !form.formState.errors.name ? (
                        <FormDescription className="text-green-600">✓ Looks good!</FormDescription>
                      ) : form.formState.errors.name ? (
                        <FormMessage className="flex items-center text-red-500">
                          <X className="mr-2 h-4 w-4" />
                          <span>{form.formState.errors.name.message}</span>
                        </FormMessage>
                      ) : (
                        <FormDescription className="text-foreground">
                          Enter your Name (min. 4 characters)
                        </FormDescription>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          className={`text-foreground autofill:text-input border-[1px] focus-visible:border-green-500/50 focus-visible:ring-0`}
                          type="text"
                          placeholder="example@example.com"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      {/* ✅ Conditionally show FormMessage or FormDescription */}
                      {form.watch('email').length > 0 && !form.formState.errors.email ? (
                        <FormDescription className="text-green-600">✓ Looks good!</FormDescription>
                      ) : form.formState.errors.email ? (
                        <FormMessage className="flex items-center text-red-500">
                          <X className="mr-2 h-4 w-4" />
                          <span>{form.formState.errors.email.message}</span>
                        </FormMessage>
                      ) : (
                        <FormDescription className="text-foreground">
                          Enter your Email (min. 6 characters)
                        </FormDescription>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          className={`text-foreground autofill:text-input border-[1px] focus-visible:border-green-500/50 focus-visible:ring-0`}
                          placeholder="********"
                          autoComplete="current-password"
                          {...field}
                        />
                      </FormControl>

                      {/* Conditional Feedback */}
                      {form.watch('password').length > 0 && !form.formState.errors.password ? (
                        <FormDescription className="text-green-600">✓ Looks good!</FormDescription>
                      ) : form.formState.errors.password ? (
                        <FormMessage className="flex items-center text-red-500">
                          <X className="mr-2 h-4 w-4" />
                          <span>{form.formState.errors.password.message}</span>
                        </FormMessage>
                      ) : (
                        <FormDescription className="text-foreground">
                          Enter your Password (min. 4 characters)
                        </FormDescription>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="repeatPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Repeat Password</FormLabel>

                      <FormControl>
                        <Input
                          type="password"
                          className="text-foreground autofill:text-input border-[1px] focus-visible:border-green-500/50 focus-visible:ring-0"
                          placeholder="Repeat your password"
                          autoComplete="current-password"
                          {...field}
                        />
                      </FormControl>

                      {/* Conditional Feedback */}
                      {form.watch('repeatPassword').length > 0 &&
                      !form.formState.errors.repeatPassword ? (
                        <FormDescription className="text-green-600">✓ Passwords match!</FormDescription>
                      ) : form.formState.errors.repeatPassword ? (
                        <FormMessage className="flex items-center text-red-500">
                          <X className="mr-2 h-4 w-4" />
                          <span>{form.formState.errors.repeatPassword.message}</span>
                        </FormMessage>
                      ) : (
                        <FormDescription className="text-foreground">
                          Re-enter your password to confirm.
                        </FormDescription>
                      )}
                    </FormItem>
                  )}
                />

                <RippleButton
                  type="submit"
                  className="bg-primary text-primary-foreground w-full px-0 disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? (
                    <div className="flex w-full items-center justify-center gap-4">
                      <span>Loading</span>
                      <Spinner variant="default" className="h-4 w-4 text-amber-50" size={10} />
                    </div>
                  ) : (
                    'Submit'
                  )}
                </RippleButton>
              </form>
            </Form>
          </CardContent>

          <CardFooter className={'flex-col'}>
            <div className="text-muted-foreground gap-2 py-4 text-center text-sm">
              © {new Date().getFullYear()} Asrto Inc. — All rights reserved.
            </div>
          </CardFooter>
        </Card>

        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
          By clicking Submit, you agree to our <a href="#">Terms of Service</a> and{' '}
          <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </div>
  );
}
