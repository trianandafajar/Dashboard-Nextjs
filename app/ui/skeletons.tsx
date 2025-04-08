// tailwind.config.js (shimmer animation)
module.exports = {
  theme: {
    extend: {
      animation: {
        shimmer: 'shimmer 2s infinite',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
};

// components/skeletons/SkeletonBox.tsx
export function SkeletonBox({ className = '' }: { className?: string }) {
  return <div className={`rounded bg-gray-100 ${className}`} />;
}

// components/skeletons/CardSkeleton.tsx
import { SkeletonBox } from './SkeletonBox';
const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export function CardSkeleton() {
  return (
    <div
      className={`${shimmer} relative overflow-hidden rounded-xl bg-gray-100 p-2 shadow-sm`}
    >
      <div className="flex p-4">
        <SkeletonBox className="h-5 w-5 rounded-md bg-gray-200" />
        <SkeletonBox className="ml-2 h-6 w-16" />
      </div>
      <div className="flex items-center justify-center truncate rounded-xl bg-white px-4 py-8">
        <SkeletonBox className="h-7 w-20" />
      </div>
    </div>
  );
}

// components/skeletons/CardsSkeleton.tsx
import { CardSkeleton } from './CardSkeleton';

export function CardsSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </>
  );
}

// components/skeletons/TableRowSkeleton.tsx
import { SkeletonBox } from './SkeletonBox';

export function TableRowSkeleton() {
  return (
    <tr className="w-full border-b border-gray-100 last-of-type:border-none">
      <td className="relative overflow-hidden whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex items-center gap-3">
          <SkeletonBox className="h-8 w-8 rounded-full" />
          <SkeletonBox className="h-6 w-24" />
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-3">
        <SkeletonBox className="h-6 w-32" />
      </td>
      <td className="whitespace-nowrap px-3 py-3">
        <SkeletonBox className="h-6 w-16" />
      </td>
      <td className="whitespace-nowrap px-3 py-3">
        <SkeletonBox className="h-6 w-16" />
      </td>
      <td className="whitespace-nowrap px-3 py-3">
        <SkeletonBox className="h-6 w-16" />
      </td>
      <td className="whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex justify-end gap-3">
          <SkeletonBox className="h-[38px] w-[38px]" />
          <SkeletonBox className="h-[38px] w-[38px]" />
        </div>
      </td>
    </tr>
  );
}

// components/skeletons/InvoicesTableSkeleton.tsx
import { TableRowSkeleton } from './TableRowSkeleton';
const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export function InvoicesTableSkeleton() {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="min-w-full text-gray-900">
            <thead className="text-left text-sm font-normal">
              <tr>
                <th className="px-4 py-5 font-medium sm:pl-6">Customer</th>
                <th className="px-3 py-5 font-medium">Email</th>
                <th className="px-3 py-5 font-medium">Amount</th>
                <th className="px-3 py-5 font-medium">Date</th>
                <th className="px-3 py-5 font-medium">Status</th>
                <th className="pb-4 pl-3 pr-6 pt-2">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {Array.from({ length: 6 }).map((_, i) => (
                <TableRowSkeleton key={i} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
