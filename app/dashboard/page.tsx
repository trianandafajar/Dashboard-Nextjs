import { Suspense } from 'react';
import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { fetchRevenue, fetchLatestInvoices, fetchCardData } from '@/app/lib/data';
import { Skeleton } from '@/app/ui/skeletons';

export default async function Page() {
  const revenue = await fetchRevenue();
  const latestInvoices = await fetchLatestInvoices();
  const {
    numberOfInvoices,
    numberOfCustomers,
    totalPaidInvoices,
    totalPendingInvoices,
  } = await fetchCardData();

  return (
    <main>
      <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<Skeleton className="h-32" />}>
          <Card title="Total Pendapatan" value={totalPaidInvoices} type="collected" />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-32" />}>
          <Card title="Menunggu Pembayaran" value={totalPendingInvoices} type="pending" />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-32" />}>
          <Card title="Total Faktur" value={numberOfInvoices} type="invoices" />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-32" />}>
          <Card title="Total Pelanggan" value={numberOfCustomers} type="customers" />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<Skeleton className="h-80 w-full" />}>
          <RevenueChart revenue={revenue} />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-80 w-full" />}>
          <LatestInvoices latestInvoices={latestInvoices} />
        </Suspense>
      </div>
    </main>
  );
} 