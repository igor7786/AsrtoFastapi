import { Skeleton } from '@/components/reactcomp/ui/skeleton';

export function SkeletonPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="flex w-2/3 flex-col items-center space-y-3">
        <Skeleton className="h-[66.6667vh] w-full rounded-xl" />
        <div className="w-full space-y-3">
          <Skeleton className="h-6" />
          <Skeleton className="h-6" />
        </div>
      </div>
    </div>
  );
}
