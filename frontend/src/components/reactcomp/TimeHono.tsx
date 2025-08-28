// src/components/Todos.tsx
'use client';
import { useTime, useTodo } from '@/components/reactcomp/hooks/use-time.ts';
import { useState } from 'react';
export default function TimeHono() {
  const [id, setId] = useState(1); // start with todo #1
  const { data, isLoading, error } = useTodo(id);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setId((prev) => Math.max(prev - 1, 1))}
          className="rounded bg-gray-200 px-3 py-1"
        >
          -1
        </button>
        <button onClick={() => setId((prev) => prev + 1)} className="rounded bg-gray-200 px-3 py-1">
          +1
        </button>
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p>Error fetching todo</p>}
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
