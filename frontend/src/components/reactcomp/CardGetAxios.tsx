import * as React from 'react';
import { Plus, Minus } from 'lucide-react';
import { Skeleton } from '@/components/reactcomp/ui/skeleton';
import { Button } from '@/components/reactcomp/ui/button';
import { Spinner } from '@/components/reactcomp/ui/spinner';
import { Progress } from '@/components/reactcomp/ui/progress';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/reactcomp/ui/card';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from '@/components/reactcomp/reactlib/utils.ts';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import axios from 'axios';

export default function CardGlobalState() {
  const [image, setImage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [count, setCount] = useState(0);
  const [err, setErr] = useState('');

  // +
  const increment = () => {
    setImage(null);
    setErr(''); // Clear error when incrementing
    setCount(count + 1);
  };

  // -
  const showErrorWithDelay = async (message: string) => {
    setErr('');
    await new Promise((resolve) => setTimeout(resolve, 300));
    setErr(message);
  };
  const decrement = async () => {
    if (count === 0) {
      showErrorWithDelay("Value can't be below zero!");
    } else {
      setImage(null);
      setCount(count - 1);
      setErr('');
    }
  };

  // +- fn
  const add = () => increment();
  const sub = () => decrement();

  // !Tanstack Query

  const getData = async () => {
    const options = {
      responseType: 'blob',
      onDownloadProgress: async function (progressEvent: any) {
        const percentCompleted: number = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setProgress(percentCompleted);
      },
    };
    // @ts-ignore
    const res = await axios.get('/pexels-fotios-photos-1540258.jpg', options);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(res);
    setProgress(0);
    const img = new Image();
    img.src = URL.createObjectURL(res.data);
    console.log(img.src);
    setImage(img.src);
    return res.status;
  };
  const query = useQuery(
    {
      queryKey: ['data', count],
      queryFn: getData,
      enabled: false,
      staleTime: 0,
      gcTime: 0, // Always refetch on each query call
      // staleTime: 2 * 60 * 1000, // 2 minutes
    },
    queryClient
  );
  useEffect(() => {
    if (query.error) {
      setErr('Something went wrong! Try again later.');
      const timeout = setTimeout(() => {
        setErr('');
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [query.error]);
  return (
    <Card className="h-[600px] w-[340px]">
      <CardHeader>
        <CardTitle className="text-center">Global State</CardTitle>
        <CardDescription className="text-center">Global State with Nano stores</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        {query.isLoading ? (
          <Skeleton className="h-8 w-8 bg-gray-300 dark:bg-gray-800" />
        ) : (
          <div className={"'text-black dark:text-white'} text-2xl font-bold"}>{count}</div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="flex w-2/3 justify-between">
          <Button variant="outline" onClick={sub} disabled={query.isLoading}>
            <Minus />
          </Button>
          <Button disabled={query.isLoading} onClick={add} className="md:hover:text-white">
            <Plus />
          </Button>
        </div>
        {/* !ERROR MESSAGE WITH FADE-IN EFFECT */}
        <div className="mt-2 h-2">
          <AnimatePresence>
            {(err || query.error) && (
              <motion.div
                initial={{ opacity: 0, y: -5 }} // → Starts invisible & slightly above.
                animate={{ opacity: 1, y: 0 }} // → Fades in and moves to normal position.
                exit={{ opacity: 0, y: 0 }} // → Fades out smoothly.
                transition={{ duration: 0.3, ease: 'easeInOut' }} // → Controls speed.
                className="mt-2 text-sm text-red-500"
              >
                {err}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="mt-2 flex h-2 w-full justify-center">
          {query.isFetching && progress > 0 && (
            <Progress value={progress || 1} className="w-[60%] bg-red-600" />
          )}
        </div>
        <Button
          className="mt-8 text-center font-bold text-white"
          onClick={() => query.refetch()}
          disabled={query.isLoading || count === 0}
        >
          {query.isLoading ? (
            <div className="flex items-center justify-between">
              <Spinner className="mr-2 text-white"></Spinner>
              <span className="text-cyan-white">Resetting</span>
            </div>
          ) : (
            'Get Image'
          )}
        </Button>
        {/*{image && <img src={image} alt="Downloaded" className="mt-4 h-auto w-full rounded-lg" />}*/}
        <div className="mt-10 flex h-20">
          <AnimatePresence>
            {image && (
              <motion.div
                key="image" // Ensure that it is uniquely keyed
                initial={{ opacity: 0, y: -5 }} // → Starts invisible and slightly below
                animate={{ opacity: 1, y: 0 }} // → Fades in and moves to normal position
                exit={{ opacity: 0, y: 0 }} // → Fades out smoothly
                transition={{ duration: 1, ease: 'easeInOut' }} // → Controls speed
                className="mt-4 h-auto w-full rounded-lg"
              >
                <img src={image} alt="Downloaded" className="h-auto w-full object-cover" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardFooter>
      <ReactQueryDevtools client={queryClient} />
    </Card>
  );
}

//#####################################################
// const getData = async () => {
//     const options = {
//       responseType: 'blob',
//       onDownloadProgress: async function (progressEvent: any) {
//         const percentCompleted: number = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//         console.log(percentCompleted);
//         setErr(`${percentCompleted}%`);
//       },
//     };
//     // @ts-ignore
//     const res = await axios.get('/pexels-fotios-photos-1540258.jpg', options);
//     console.log(res.data);
//     return res.data;
//   };
//   const query = useQuery(
//     {
//       queryKey: ['data', count],
//       queryFn: () => getData(),
//       enabled: false,
//       staleTime: 2000,
//     },
//     queryClient
//   );
