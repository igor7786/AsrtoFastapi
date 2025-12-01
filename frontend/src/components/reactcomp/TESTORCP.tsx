import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { client } from '@hono-adapt/orpc/client';
import type { OutputTodo } from '@hono-adapt/orpc/schemas/todos';
import { getQueryClient } from '@/lib/tan-stack/tanstack-query';

interface GetTodoByIdProps {
  findId: string; // initial ID from SSR
}

export default function GetTodoById({ findId }: GetTodoByIdProps) {
  const queryClient = getQueryClient();
  const [id, setId] = useState(findId);

  // Query to fetch todo by ID
  const {
    data: OutputTodo,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery(
    {
      queryKey: ['todo', id],
      queryFn: async () => client.todos.getTodo({ id }),
      enabled: !!id, // only run if id exists
      // optional: show old data while fetching
      placeholderData: (previousData) => previousData,
    },
    queryClient
  );

  return (
    <div className="max-w-md space-y-3 p-4">
      <h2 className="text-xl font-semibold">Find Todo by ID</h2>

      <input
        value={id}
        onChange={(e) => setId(e.target.value)}
        className="w-full rounded border p-2"
        placeholder="Enter todo ID"
      />

      <button
        onClick={() => refetch()}
        disabled={isLoading || isFetching}
        className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {isLoading || isFetching ? 'Loading...' : 'Fetch Todo'}
      </button>

      {error && <p className="text-sm text-red-600">{(error as any)?.message ?? 'Unexpected error'}</p>}

      {OutputTodo && (
        <div className="rounded border bg-gray-50 p-3">
          <h3 className="font-medium">Todo:</h3>
          <pre className="text-sm">{JSON.stringify(OutputTodo, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
