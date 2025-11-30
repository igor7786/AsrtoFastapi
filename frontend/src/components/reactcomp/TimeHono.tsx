// src/components/Todos.tsx
import { useTime, useTodo } from '@/components/reactcomp/hooks/use-fetch';
import { useState } from 'react';
export default function TimeHono() {
  const [id, setId] = useState(1); // start with todo #1
  const { data, isLoading, error } = useTodo(id);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setId((prev) => Math.max(prev - 1, 1))}
          className="rounded bg-red-700 px-3 py-1"
          disabled={isLoading}
        >
          -1
        </button>
        <button
          onClick={() => setId((prev) => prev + 1)}
          disabled={isLoading}
          className="rounded bg-green-700 px-3 py-1"
        >
          +1
        </button>
      </div>

      {isLoading && <p>Loading...{id}</p>}
      {error && (
        <p>
          Error fetching todo {id}: {error.message}
        </p>
      )}
      {data && (
        <p>
          <b>Todo #{id}:</b> {data.title}
        </p>
      )}
    </div>
  );
  // const { data, isLoading } = useTime();
  // if (isLoading) return <p>Loading...</p>;
  // return <p>Current time: {data?.now}</p>;
}
