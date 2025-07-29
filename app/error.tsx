'use client';

import { useEffect } from 'react';
import { Button } from '@/app/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error untuk monitoring
    console.error('Error occurred:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Oops! Terjadi kesalahan
        </h2>
        <p className="text-gray-600 mb-6 max-w-md">
          Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi atau hubungi tim support jika masalah berlanjut.
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            onClick={reset}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Coba Lagi
          </Button>
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
            className="border-gray-300 hover:bg-gray-50"
          >
            Kembali ke Beranda
          </Button>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left max-w-md mx-auto">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Detail Error (Development)
            </summary>
            <pre className="mt-2 text-xs text-red-600 bg-red-50 p-3 rounded overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
} 