'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Thank You for Your Order!
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {orderId 
            ? `Your order #${orderId} has been received and is being processed.`
            : 'Your order has been received and is being processed.'
          }
        </p>
        <p className="text-sm text-gray-500">
          We've sent a confirmation email with all the details.
        </p>
        <div className="mt-6 space-y-3">
          <Link href="/orders" passHref>
            <Button variant="outline" className="w-full">
              View My Orders
            </Button>
          </Link>
          <Link href="/" passHref>
            <Button className="w-full">
              Back to Home
            </Button>
          </Link>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Need help?{' '}
            <a href="mailto:support@example.com" className="font-medium text-indigo-600 hover:text-indigo-500">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
