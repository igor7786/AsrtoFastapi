import { getQueryClient } from '@/lib/tan-stack/tanstack-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, GalleryVerticalEnd, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { cn } from '@rcomp/lib/utils';
import { Spinner } from '@rcomp/spinner';
import { Button } from '@rcomp/ui/button';
import { AuroraText } from '@rcomp/magicui/aurora-text';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/reactcomp/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/reactcomp/ui/form';
import { Input } from '@/components/reactcomp/ui/input';
import { RippleButton } from '@/components/reactcomp/magicui/ripple-button';
import {
  type LoginSchema,
  inputLoginSchema,
} from '@/lib/types-schemas-validator/orpc-schemas-types/auth.login.register';
import { useMutation } from '@tanstack/react-query';
import { client } from '@/lib/hono-adapter/orpc/client';

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  const queryClient = getQueryClient();
  // 1. Define your form.
  const form = useForm<LoginSchema>({
    resolver: zodResolver(inputLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });
  // 2. Define a submit handler.
  const idToast = 'login-toast';
  const mutation = useMutation(
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
          window.location.reload();
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
    const { email, password } = formData;
    mutation.mutate({ email, password });
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
              <AuroraText className="mb-2 text-3xl font-bold">Welcome Back</AuroraText>
            </CardTitle>
            <CardDescription>Login with your Apple or Google account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button variant="outline" className="w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Apple
                </Button>
                <Button variant="outline" className="w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Google
                </Button>
              </div>
            </div>
            <div className="text-muted-foreground after:border-primary relative py-4 text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t dark:after:border-yellow-200">
              <span className="bg-card text-muted-foreground relative z-10 px-2">Or continue with</span>
            </div>
            {/*#! Form*/}
            <Form {...form}>
              <form onSubmit={onSubmit} className="space-y-8">
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
                          placeholder="email@com"
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
                          placeholder="*******"
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
                          Enter your password (min. 4 characters)
                        </FormDescription>
                      )}
                    </FormItem>
                  )}
                />

                <RippleButton
                  type="submit"
                  className="bg-primary text-primary-foreground w-full disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? (
                    <div className="flex items-center justify-center gap-4">
                      <span>Loading</span>
                      <Spinner variant="bars" className="h-4 w-4 text-amber-50" size={10} />
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
