// src/dash/routes/dash/index.lazy.tsx
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/dash/')({
  component: () => <div>Dashboard Home</div>,
});
