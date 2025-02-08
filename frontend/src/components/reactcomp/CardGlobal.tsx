import * as React from 'react';
import { Plus, Minus } from 'lucide-react';
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
import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { count, err } from '@/components/reactcomp/reactlib/utils.ts';
import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '@/components/reactcomp/reactlib/utils.ts';

export default function CardGlobalState() {
  useEffect(() => {
    // @ts-ignore
    // ! initialize htmx to work in react
    window.htmx.process(document.body);
  }, []);

  // ! Nano stores
  const counter = useStore(count);
  const errorMessage = useStore(err);
  const increment = () => {
    err.set(''); // Clear error when incrementing
    count.set(counter + 1);
  };
  const decrement = () => {
    if (counter === 0) {
      err.set("Value can't be below zero!");
    } else {
      count.set(counter - 1);
      err.set('');
    }
  };
  const add = () => increment();
  const sub = () => decrement();
  // ! Tanstack Query
  const getData = async () => {
    const response = await fetch('/partials/1', { method: 'POST' });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
  };
  const mutation = useMutation(
    {
      mutationKey: ['reset'],
      mutationFn: getData,
      onSuccess: (data) => {
        count.set(data.count); // Update counter with the response
        err.set('');
      },
      onError: () => {
        err.set('Something went wrong!');
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
        {errorMessage ? (
          <div className="text-2xl font-bold text-red-500">
            <div id="counter">{counter}</div>
          </div>
        ) : (
          <div className="text-2xl font-bold text-black dark:text-white">
            <div id="counter">{counter}</div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="flex w-2/3 justify-between">
          <Button variant="outline" onClick={sub}>
            <Minus />
          </Button>
          <Button onClick={add}>
            <Plus />
          </Button>
        </div>
        <div className="mt-2 h-4">
          {errorMessage && <div className="mt-2 text-sm text-red-500">{errorMessage}</div>}
        </div>
        <Button
          className="mt-4 text-center font-bold text-white"
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending || counter === 0}
        >
          {mutation.isPending ? (
            <div className="flex items-center justify-between">
              <Spinner className="mr-2 text-white"></Spinner>
              <span className="text-cyan-white">Resting</span>
            </div>
          ) : (
            'Reset-Fetch'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
