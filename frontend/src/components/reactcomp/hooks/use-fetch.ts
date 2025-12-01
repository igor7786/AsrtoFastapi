// src/components/reactcomp/hooks/useTime.ts
import { useQuery } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/tan-stack/tanstack-query';
import axios from 'axios';
import type { TimeResponse } from '@/lib/types-schemas-validator/time-type.ts';
import type { createTodoSchema } from '@/lib/types-schemas-validator/create-todo.validator';
import type z from 'zod';
import clientHonoRpC from '@/lib/hono-adapter/rpc/client';

const client = getQueryClient();
export function useTime() {
  return useQuery(
    {
      queryKey: ['time'],
      queryFn: async (): Promise<TimeResponse> => {
        const res = await axios.get('/api/time');
        console.log(res.data);
        return res.data;
      },
    },
    client
  );
}

async function fetchTodo(id: number, signal?: AbortSignal): Promise<z.infer<typeof createTodoSchema>> {
  const res = await axios.get(`/api/rpc/todos/${id}`, { signal });
  return res.data;
}

export async function fetchTodoRPC(
  id: number,
  signal?: AbortSignal
): Promise<z.infer<typeof createTodoSchema>> {
  // Fetch the todo by ID via RPC
  const idStr = String(id);
  const res = await clientHonoRpC.api.todo[':id'].$get(
    { param: { id: idStr } }, // path params
    { init: { signal } } // pass the AbortSignal for cancellation
  );
  // Handle errors based on status
  if (res.status !== 200) {
    throw new Error(` ${res.status} ${res.statusText}`);
  }
  // Parse JSON and return the typed todo
  return res.json() as Promise<z.infer<typeof createTodoSchema>>;
}

export const useTodo = (id: number) => {
  const cachedData = client.getQueryData(['todo', id]);
  return useQuery(
    {
      queryKey: ['todo', id],
      queryFn: ({ signal }) => fetchTodo(id, signal),
      placeholderData: (previousData) => previousData,
      staleTime: 5000,
      enabled: !cachedData,
      retry: false,
    },
    client
  );
};
