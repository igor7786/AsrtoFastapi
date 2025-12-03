import { actions } from 'astro:actions';
import { withState } from '@astrojs/react/actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { GalleryVerticalEnd, X, Check } from 'lucide-react';
import { startTransition, useActionState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { cn } from '@/components/reactcomp/lib/utils';
import { Spinner } from '@/components/reactcomp/spinner';
import { AuroraText } from '@/components/reactcomp/magicui/aurora-text';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/reactcomp/ui/card';
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
import { RippleButton } from '@/components/reactcomp/ui/ripple-button';
import { registerSchema, type RegisterSchema } from '@/lib/types-schemas-validator/register-schema';

export function RegisterForm({ className, ...props }: React.ComponentProps<'div'>) {
  // 1. Define your form.
  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      password: '',
      repeatPassword: '',
    },
    mode: 'onChange',
  });
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  };
  // 2. Define your astro action.
  const [state, action, pending] = useActionState(withState(actions.login.loginUser), {
    data: { name: '', success: false },
    error: undefined,
  });
  useEffect(() => {
    const idToast = 'login-toast';
    if (pending) {
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
    } else if (state?.error) {
      toast(
        <div className="flex items-center gap-2">
          <X className="text-red-500" />
          <span>{state.error.message ?? 'Failed to update account.'}</span>
        </div>,
        {
          id: idToast,
          duration: 1000,
        }
      );
    } else if (state?.data?.success) {
      toast(
        <div className="flex items-center gap-2">
          <Check className="text-green-500" />
          <span>{`Welcome ${state.data.name}.`}</span>
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
    }

    // ✅ Clean up toast on component unmount
  }, [pending, state]);
  const onSubmit = form.handleSubmit((formData) => {
    const fd = new FormData();
    fd.append('name', formData.name);
    fd.append('password', formData.password);
    startTransition(() => {
      action(fd);
    });
  });
  // 4. Error handling with Soner

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
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
                  <motion.form
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    onSubmit={onSubmit}
                    className="space-y-8"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <motion.div variants={itemVariants}>
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input
                                className={`text-foreground autofill:text-input border-[1px] focus-visible:border-green-500/50 focus-visible:ring-0`}
                                placeholder="email@com"
                                autoComplete="email"
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
                                Enter your username (min. 6 characters)
                              </FormDescription>
                            )}
                          </FormItem>
                        </motion.div>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <motion.div variants={itemVariants}>
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                className={`text-foreground autofill:text-input border-[1px] focus-visible:border-green-500/50 focus-visible:ring-0`}
                                placeholder="Your password"
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
                        </motion.div>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="repeatPassword"
                      render={({ field }) => (
                        <motion.div variants={itemVariants}>
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
                              <FormDescription className="text-green-600">
                                ✓ Passwords match!
                              </FormDescription>
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
                        </motion.div>
                      )}
                    />

                    <motion.div variants={itemVariants}>
                      <RippleButton type="submit" className="w-full" disabled={pending}>
                        {pending ? (
                          <div className="disabled:text-primary flex items-center justify-center gap-4">
                            <span>Loading</span>
                            <Spinner className="text-amber-50" size={10} />
                          </div>
                        ) : (
                          'Submit'
                        )}
                      </RippleButton>
                    </motion.div>
                  </motion.form>
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
      </motion.div>
    </>
  );
}
