import * as React from 'react';
import { Plus, Minus } from 'lucide-react';
import { Skeleton } from '@/components/reactcomp/ui/skeleton';
import { Button } from '@/components/reactcomp/ui/button';
import { Spinner } from '@/components/reactcomp/ui/spinner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/reactcomp/ui/card';
import { useStore } from '@nanostores/react';
import { count, err } from '@/components/reactcomp/reactlib/utils.ts';
import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '@/components/reactcomp/reactlib/utils.ts';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export default function CardGlobalState() {
  const [disabled, setDisabled] = useState(false);

  // ! Nano stores
  const counter = useStore(count);
  const errorMessage = useStore(err);

  // +
  const increment = () => {
    err.set(''); // Clear error when incrementing
    count.set(counter + 1);
  };

  // -
  const showErrorWithDelay = async (message: string) => {
    err.set('');
    await new Promise((resolve) => setTimeout(resolve, 300));
    err.set(message);
  };
  const decrement = async () => {
    if (counter === 0) {
      showErrorWithDelay("Value can't be below zero!");
    } else {
      count.set(counter - 1);
      err.set('');
    }
  };

  // +- fn
  const add = () => increment();
  const sub = () => decrement();
  // ! Tanstack Query
  const getData = async () => {
    const response = await fetch(`/partials/${counter}`, { method: 'POST' });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
  };
  const mutation = useMutation(
    {
      mutationKey: ['reset', counter],
      mutationFn: getData,
      onSuccess: (data: { count: number }) => {
        count.set(data?.count); // Update counter with the response
        err.set('');
        setDisabled(false);
      },
      onError: () => {
        err.set('Something went wrong!');
      },
      onMutate: () => {
        err.set('');
        setDisabled(true);
      },
    },
    queryClient
  );

  return (
    <Card className="w-[340px]">
      <CardHeader>
        <CardTitle className="text-center">Global State</CardTitle>
        <CardDescription className="text-center">Global State with Nano stores</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        {mutation.isPending ? (
          <Skeleton className="h-8 w-8 bg-gray-300 dark:bg-gray-800" />
        ) : (
          <div
            className={`text-2xl font-bold ${errorMessage ? 'text-red-500' : 'text-black dark:text-white'}`}
          >
            {counter}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="flex w-2/3 justify-between">
          <Button variant="outline" onClick={sub} disabled={mutation.isPending}>
            <Minus />
          </Button>
          <Button disabled={disabled} onClick={add} className="md:hover:text-white">
            <Plus />
          </Button>
        </div>
        {/* !ERROR MESSAGE WITH FADE-IN EFFECT */}
        <div className="mt-2 h-4">
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -5 }} // → Starts invisible & slightly above.
                animate={{ opacity: 1, y: 0 }} // → Fades in and moves to normal position.
                exit={{ opacity: 0, y: 0 }} // → Fades out smoothly.
                transition={{ duration: 0.3, ease: 'easeInOut' }} // → Controls speed.
                className="mt-2 text-sm text-red-500"
              >
                {errorMessage}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <Button
          className="mt-4 text-center font-bold text-white"
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending || counter === 0}
        >
          {mutation.isPending ? (
            <div className="flex items-center justify-between">
              <Spinner className="mr-2 text-white"></Spinner>
              <span className="text-cyan-white">Resetting</span>
            </div>
          ) : (
            'Reset-Fetch'
          )}
        </Button>
      </CardFooter>
      <ReactQueryDevtools client={queryClient} />
    </Card>
  );
}
