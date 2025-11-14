// src/components/Todos.tsx
import { useEffect, useState } from 'react';
import { client } from '@hono-adapt/orpc/client';
export default function TimeHono() {
  const [id, setId] = useState(1);
  async function load() {
    const data = await client.planet.list({});
    console.log(data[0].id);
  } // start with todo #1
  useEffect(() => {
    load();
  }, [id]);
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setId((prev) => Math.max(prev - 1, 1))}
          className="rounded bg-red-700 px-3 py-1"
        >
          -1
        </button>
        <button onClick={() => setId((prev) => prev + 1)} className="rounded bg-green-700 px-3 py-1">
          +1
        </button>
      </div>
    </div>
  );
  // const { data, isLoading } = useTime();
  // if (isLoading) return <p>Loading...</p>;
  // return <p>Current time: {data?.now}</p>;
}
