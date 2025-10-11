import { useQuery } from '@tanstack/react-query';
import { getQueryClient } from '@/utils/tanstack-query';
import type { Todo } from '@db/types';
import axios from 'axios';

const queryClient = getQueryClient();
async function fetchTodos(signal?: AbortSignal): Promise<Todo[]> {
  const res = await axios.get<Todo[]>('/api/todos', { signal }); // ✅ typed response

  if (res.status !== 200) {
    throw new Error(`code ${res.status} error ${res.statusText}`);
  }

  return res.data; // now TS knows it's Todo[]
}
const TodoList = () => {
  const { data, isLoading, error } = useQuery<Todo[], Error>(
    {
      queryKey: ['todos'],
      queryFn: async ({ signal }) => fetchTodos(signal),
      staleTime: 5000,
      retry: false,
    },
    queryClient
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  if (!data || data.length === 0) return <div>No todos found</div>;

  return (
    <ul>
      {data.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
};

export default TodoList;
