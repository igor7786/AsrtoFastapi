// src/components/PostsList.tsx
import { getQueryClient } from '@/lib/tan-stack/tanstack-query';
import { useQuery } from '@tanstack/react-query';

const fetchPosts = async () => {
  const res = await fetch('http://localhost:4321/api/test');
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
};

export default function PostsList() {
  const client = getQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ['test'],
    queryFn: fetchPosts,
  }, client);

  if (isLoading) return <div>Loading posts...</div>;
  if (error instanceof Error) return <div>Error: {error.message}</div>;
  if (!data || data.length === 0) return <div>No posts found</div>;

  return (
    <ul>
      {data.message}
    </ul>
  );
}
