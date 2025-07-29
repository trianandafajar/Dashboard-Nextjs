import Link from 'next/link';
import { Button } from '@/app/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="text-center max-w-md mx-auto">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
            <span className="text-6xl font-bold text-blue-600">404</span>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Halaman Tidak Ditemukan
        </h1>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          Maaf, halaman yang Anda cari tidak dapat ditemukan. 
          Mungkin halaman tersebut telah dipindahkan, dihapus, atau URL yang Anda masukkan salah.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="border-gray-300 hover:bg-gray-50"
          >
            Kembali
          </Button>
          
          <Link href="/">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">
              Beranda
            </Button>
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            Mungkin Anda mencari:
          </h3>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link 
              href="/dashboard" 
              className="text-blue-500 hover:text-blue-600 hover:underline"
            >
              Dashboard
            </Link>
            <Link 
              href="/dashboard/invoices" 
              className="text-blue-500 hover:text-blue-600 hover:underline"
            >
              Invoice
            </Link>
            <Link 
              href="/dashboard/customers" 
              className="text-blue-500 hover:text-blue-600 hover:underline"
            >
              Customers
            </Link>
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-8 text-xs text-gray-500">
          <p>
            Jika Anda yakin ini adalah kesalahan, silakan{' '}
            <a 
              href="mailto:support@acme.com" 
              className="text-blue-500 hover:underline"
            >
              hubungi tim support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 