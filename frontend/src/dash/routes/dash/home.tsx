import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dash/home')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/dash/home"!</div>;
}
