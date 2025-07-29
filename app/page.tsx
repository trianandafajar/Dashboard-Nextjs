import { Suspense } from 'react';
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Metadata } from 'next';
import { Skeleton } from '@/app/ui/skeletons';

export const metadata: Metadata = {
  title: 'Beranda',
  description: 'Selamat datang di Acme Dashboard - Platform manajemen bisnis modern',
};

// Lazy loaded components
const HeroImage = () => (
  <div className="h-64 w-full rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 md:h-80 lg:h-96 flex items-center justify-center">
    <div className="text-center">
      <div className="w-24 h-24 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center">
        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <p className="text-gray-600 font-medium">Dashboard Modern</p>
    </div>
  </div>
);

const WelcomeSection = () => (
  <div className="flex flex-col justify-center gap-6 rounded-lg bg-gradient-to-br from-gray-50 to-white px-6 py-10 md:w-2/5 md:px-20 shadow-sm">
    {/* Decorative element */}
    <div className="relative">
      <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-b-[26px] border-l-transparent border-r-transparent border-b-blue-500" />
    </div>

    {/* Welcome text */}
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
        Selamat Datang di <span className="text-blue-600">Acme</span>
      </h1>
      <p className="text-lg text-gray-700 leading-relaxed">
        Platform dashboard modern untuk mengelola bisnis Anda dengan efisien. 
        Dibangun dengan teknologi terdepan untuk performa optimal.
      </p>
      <p className="text-sm text-gray-600">
        Contoh dari{" "}
        <a 
          href="https://nextjs.org/learn/" 
          className="text-blue-500 underline hover:text-blue-600 transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          Next.js Learn Course
        </a>
        , disediakan oleh Vercel.
      </p>
    </div>

    {/* CTA Button */}
    <Link
      href="/login"
      className="group flex items-center gap-3 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-blue-600 hover:shadow-lg md:text-base"
    >
      <span>Masuk ke Dashboard</span>
      <ArrowRightIcon className="w-5 md:w-6 transition-transform group-hover:translate-x-1" />
    </Link>
  </div>
);

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      {/* Header with logo */}
      <header className="flex h-20 shrink-0 items-end rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 p-4 md:h-52 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-blue-600 font-bold text-lg">A</span>
          </div>
          <span className="text-white font-semibold text-xl">Acme Dashboard</span>
        </div>
      </header>

      {/* Main content area */}
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <Suspense fallback={<Skeleton className="h-96 w-full" />}>
          <WelcomeSection />
        </Suspense>

        {/* Right Section: Hero image */}
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          <Suspense fallback={<Skeleton className="h-64 w-full rounded-lg md:h-80 lg:h-96" />}>
            <HeroImage />
          </Suspense>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>&copy; 2024 Acme Dashboard. Dibuat dengan ❤️ menggunakan Next.js</p>
      </footer>
    </main>
  );
}
