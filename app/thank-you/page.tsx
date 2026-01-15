'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ShoppingBag, ArrowLeft } from 'lucide-react';

function ThankYouContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black p-4 sm:p-6 lg:p-8 relative overflow-hidden">


      <div className="relative max-w-lg w-full bg-zinc-900 border border-zinc-800 shadow-2xl rounded-3xl p-8 sm:p-10 text-center animate-in fade-in zoom-in duration-500 slide-in-from-bottom-4">

        <div className="mx-auto flex items-center justify-center mb-8 relative">
          <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping opacity-25 duration-1000" />
          <div className="relative h-24 w-24 rounded-full bg-zinc-800 flex items-center justify-center shadow-inner border border-zinc-700">
            <CheckCircle2 className="h-12 w-12 text-green-500 drop-shadow-md" strokeWidth={2.5} />
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
          Order Confirmed!
        </h1>

        <p className="text-zinc-400 text-lg mb-2">
          Thank you for your purchase.
        </p>

        <p className="text-sm text-zinc-500 mb-8 max-w-sm mx-auto">
          {orderId
            ? <span>Your order <span className="font-mono font-medium text-red-400 bg-red-900/20 px-2 py-0.5 rounded border border-red-900/30">#{orderId}</span> has been received.</span>
            : 'Your order has been received.'
          }
          <br />
          We've sent a confirmation email with details.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
          <Link href="/orders" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto min-w-[160px] bg-red-600 hover:bg-red-700 text-white border-0 rounded-xl h-12 shadow-[0_4px_14px_0_rgba(220,38,38,0.39)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.23)] transition-all duration-300 group">
              <ShoppingBag className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              View Orders
            </Button>
          </Link>

          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto min-w-[160px] border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white hover:border-zinc-600 rounded-xl h-12 shadow-sm transition-all duration-300">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back Home
            </Button>
          </Link>
        </div>

        <div className="mt-10 pt-6 border-t border-zinc-800">
          <p className="text-sm text-zinc-500">
            Need help?{' '}
            <a href="mailto:support@example.com" className="font-medium text-red-500 hover:text-red-400 transition-colors">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-700"></div></div>}>
      <ThankYouContent />
    </Suspense>
  );
}
