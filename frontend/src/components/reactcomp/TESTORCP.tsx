import { useState } from 'react';
import { client } from '@hono-adapt/orpc/client';
import type { OutputTodo } from '@hono-adapt/orpc/schemas/todos';

interface GetTodoByIdProps {
  result: OutputTodo | null;
  findId: string;
  err: string;
}

export default function GetTodoById({ result, findId , err}: GetTodoByIdProps) {
  const [id, setId] = useState(findId);
  const [todo, setTodo] = useState<OutputTodo | null>(result);
  const [errorMessage, setErrorMessage] = useState(err);
  const [loading, setLoading] = useState(false);

  async function handleFetch() {
    setErrorMessage('');
    setTodo(null);
    setLoading(true);

    try {
      const data = await client.todos.getTodo({ id });
      setTodo(data);
    } catch (err: any) {
      console.error('ORPC Error:', err);

      if (err.issues) {
        setErrorMessage(err.issues.map((i: any) => i.message).join(', '));
        setLoading(false);
        return;
      }

      switch (err.code) {
        case 'NOT_FOUND':
          setErrorMessage('Todo not found.');
          break;
        case 'BAD_REQUEST':
          setErrorMessage(err.message ?? 'Invalid request.');
          break;
        case 'UNAUTHORIZED':
          setErrorMessage('You are not allowed to access this.');
          break;
        default:
          setErrorMessage('Unexpected error. Please try again.');
      }
    }

    setLoading(false);
  }

  return (
    <div className="max-w-md space-y-3 p-4">
      {result && <div>{result.title}</div>}

      <h2 className="text-xl font-semibold">Find Todo by ID</h2>

      <input
        value={id}
        onChange={(e) => setId(e.target.value)}
        className="w-full rounded border p-2"
        placeholder="Enter todo ID"
      />

      <button
        onClick={handleFetch}
        disabled={loading}
        className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? 'Loading...' : 'Fetch Todo'}
      </button>

      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

      {todo && (
        <div className="rounded border bg-gray-50 p-3">
          <h3 className="font-medium">Todo:</h3>
          <pre className="text-sm">{JSON.stringify(todo, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
