// src/dash/routes/__root.tsx
import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

export const Route = createRootRoute({
  component: () => (
    <div className="flex flex-col gap-4 p-4">
      {/* Or your app shell */}
      <Link to="/dash">Root Index</Link>
      <Link to="/dash/home">Root Home</Link>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  ),
});
