import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeOff, GalleryVerticalEnd, Mail, MailCheckIcon, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { cn } from '@rcomp/lib/utils';
import { Spinner } from '@rcomp/spinner';
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
import { Input } from '@rcomp/ui/input';
import { RippleButton } from '@rcomp/magicui/ripple-button';
import {
  type LoginSchema,
  inputLoginSchema,
} from '@/lib/types-schemas-validator/orpc-schemas-types/auth.login.register';
import { SocialBtn } from '@/components/reactcomp/social-btn/socialLoginBtn';
import { useStore } from '@nanostores/react';
import { pending } from '@/lib/stores/pending';
import { useState } from 'react';
import { Button } from '@rcomp/ui/button';
import { useLoginMutation } from '@rcomp/auth-forms/login-mutation';

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  const isDisabled = useStore(pending);

  const [showPassword, setShowPassword] = useState<boolean>(false);
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
  const mutation = useLoginMutation(form);
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
                {/* #! Social Login */}
                {/* <GithubBtn /> */}
                <SocialBtn provider="google" />
                <SocialBtn provider="github" />
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
                      <FormLabel htmlFor={field.name}>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            id={field.name}
                            className={`text-foreground autofill:text-input border-[1px] focus-visible:border-green-500/50 focus-visible:ring-0`}
                            type="text"
                            placeholder="example@example.com"
                            autoComplete="email"
                            disabled={mutation.isPending}
                            {...field}
                          />
                          <Button
                            className="absolute top-0 right-0 h-full px-3 hover:bg-transparent"
                            size="icon"
                            type="button"
                            variant="ghost"
                            disabled={mutation.isPending}
                          >
                            {form.watch('email').length > 0 && !form.formState.errors.email ? (
                              <MailCheckIcon className="h-4 w-4 text-green-600 disabled:text-neutral-800" />
                            ) : form.formState.errors.email ? (
                              <Mail className="h-4 w-4 text-red-500 disabled:text-neutral-800" />
                            ) : (
                              <Mail className="text-foreground h-4 w-4 disabled:text-neutral-800" />
                            )}
                          </Button>
                        </div>
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
                      <FormLabel htmlFor={field.name}>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            id={field.name}
                            disabled={isDisabled}
                            type={showPassword ? 'text' : 'password'}
                            className={`text-foreground autofill:text-input border-[1px] focus-visible:border-green-500/50 focus-visible:ring-0`}
                            placeholder="*******"
                            autoComplete="current-password"
                            {...field}
                          />
                          <Button
                            className="absolute top-0 right-0 h-full px-3 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                            size="icon"
                            type="button"
                            variant="ghost"
                          >
                            {showPassword ? (
                              <EyeOff className="text-muted-foreground h-4 w-4" />
                            ) : (
                              <EyeIcon className="text-muted-foreground h-4 w-4" />
                            )}
                          </Button>
                        </div>
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
                  className="bg-primary text-primary-foreground w-full px-0 disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={mutation.isPending || !form.formState.isValid || isDisabled}
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
