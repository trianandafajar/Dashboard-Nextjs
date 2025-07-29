import { Skeleton } from '@/app/ui/skeletons';

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col p-6">
      {/* Header skeleton */}
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-gray-200 p-4 md:h-52">
        <Skeleton className="h-8 w-32" />
      </div>

      {/* Main content skeleton */}
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        {/* Left section skeleton */}
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <Skeleton className="h-4 w-16" />
          <div className="space-y-3">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>

        {/* Right section skeleton */}
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          <Skeleton className="h-64 w-full rounded-lg md:h-80 lg:h-96" />
        </div>
      </div>
    </div>
  );
} 