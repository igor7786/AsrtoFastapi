// src/components/TodoList.tsx

import { useQuery } from '@tanstack/react-query';
import { client } from '@/utils/tanstack-query';
import { getTodos } from '@/lib/hono-adapt/client';

async function fetchTodos() {
  const res = await fetch('/api/todos');
  if (!res.ok) {
    throw new Error(`code ${res.status} error ${res.statusText}`);
  }
  return res.json();
}

const TodoList = () => {
  const { data, isLoading, error } = useQuery({ queryKey: ['todos'], queryFn: getTodos }, client);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div> {error.message}</div>;
  if (!data) return <div>No todos found</div>;

  return (
    <ul>
      {data.map((todo: any) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
};

export default TodoList;
