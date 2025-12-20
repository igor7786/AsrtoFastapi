import { lazy, Suspense } from 'react';

import { AppSidebar } from '@/components/reactcomp/app-sidebar';
const ChartAreaInteractive = lazy(() =>
  import('@/components/reactcomp/chart-area-interactive').then((m) => ({
    default: m.ChartAreaInteractive,
  }))
);
const SectionCards = lazy(() =>
  import('@/components/reactcomp/section-cards').then((m) => ({
    default: m.SectionCards,
  }))
);
const DataTable = lazy(() =>
  import('@/components/reactcomp/data-table').then((m) => ({
    default: m.DataTable,
  }))
);
import { SiteHeader } from '@/components/reactcomp/site-header';
import { SidebarInset, SidebarProvider } from '@/components/reactcomp/ui/sidebar';
import FullPageLoader from './skeleton-dashboard-page.tsx';

export default function Page({ data }: any) {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <Suspense fallback={<FullPageLoader />}>
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <SectionCards />
                <div className="px-4 lg:px-6">
                  <ChartAreaInteractive />
                </div>
                <DataTable data={data} />
              </div>
            </div>
          </div>
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  );
}
