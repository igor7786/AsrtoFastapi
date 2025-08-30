// src/components/reactcomp/hooks/useTime.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { TimeResponse } from '@/lib/types-schemas-validator/time-type.ts';
import { client } from '@/utils/tanstack-query';
import type { Todo } from '@/lib/types-schemas-validator/todo-schema.ts';

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

async function fetchTodo(id: number, signal?: AbortSignal): Promise<Todo> {
  const res = await axios.get(`/api/todos/${id}`, { signal });
  return res.data;
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
