// src/components/TodoList.tsx

import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { client } from '@/utils/tanstack-query';

async function fetchTodos() {
  const res = await fetch('/api/todos');
  return res.json();
}

const TodoList = () => {
  const { data, isLoading, error } = useQuery({ queryKey: ['todos'], queryFn: fetchTodos }, client);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading todos</div>;

  return (
    <ul>
      {data.map((todo: any) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
};

export default TodoList;
