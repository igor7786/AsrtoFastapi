import React from 'react';
import { Spinner } from '@/components/reactcomp/spinner.tsx';
export default function FullPageLoader() {
  return (
    <div className="flex min-h-fit w-full flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-1 flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
          {/* Full Section Loader */}
          <div className="bg-card text-card-foreground flex h-full w-full items-center justify-center rounded-lg border shadow-sm">
            <div className="flex flex-col items-center gap-3">
              <Spinner className="text-primary" size={50} />
              <p className="text-muted-foreground text-sm font-medium">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
