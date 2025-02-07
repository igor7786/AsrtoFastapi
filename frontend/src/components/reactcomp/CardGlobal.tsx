import * as React from 'react';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/reactcomp/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/reactcomp/ui/card';
import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { count, err } from '@/components/reactcomp/reactlib/utils.ts';

export default function CardGlobalState() {
  useEffect(() => {
    // @ts-ignore
    window.htmx.process(document.body);
  }, []);

  const fetchNewState = async () => {
    try {
      const response = await fetch('partials/1', { method: 'POST' });
      // Ensure the response is not empty before parsing JSON
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const text = await response.text();
      if (!text) {
        throw new Error('Empty response from server');
      }
      const data = JSON.parse(text);
      count.set(data.count);
    } catch (error) {
      err.set('Somthing went wrong!'); // This will set the error message in the err store
    }
  };

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
    }
  };
  const add = () => increment();
  const sub = () => decrement();

  return (
    <Card className="w-[350px]">
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
          <div className="text-2xl font-bold text-white">
            <div id="counter">{counter}</div>
          </div>
        )}
        {/*<div className="text-2xl font-bold">{globalState}</div>*/}
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
          onClick={fetchNewState}
          disabled={!!errorMessage || counter === 0}
        >
          Reset
        </Button>
      </CardFooter>
    </Card>
  );
}
