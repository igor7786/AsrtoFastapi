import { hc } from 'hono/client';
import type { AppType } from '@/lib/hono-adapt';

// explicitly type the client
const client = hc<AppType>('http://localhost:4321/');

export const getTodos = async () => {
  // @ts-ignore
  const res = await client.api.todos.$get();
  console.log('res', res);
  if (!res.ok) {
    throw new Error('No response from server');
  }
  // ✅ typed
  const todos = await res.json(); // ✅ typed as TodosType
  return todos;
}; // has correct type
