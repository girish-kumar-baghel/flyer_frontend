'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('✅ Success page loaded - payment completed')

    // Get parameters from URL
    const sessionId = searchParams.get('session_id')
    const orderCreated = searchParams.get('order_created')
    const errorParam = searchParams.get('error')

    console.log('📋 URL Parameters:', { sessionId, orderCreated, errorParam })

    // Check for errors
    if (errorParam) {
      setError(decodeURIComponent(errorParam))
      return
    }

    // If no session_id, something went wrong
    if (!sessionId) {
      setError('No session ID found. Please contact support.')
      return
    }

    // Success! Order was already created in the API route
    console.log('🎉 Order creation completed in API route')

  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950/30 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-black/50 backdrop-blur-lg border border-gray-800 rounded-2xl p-8 text-center">
        {error ? (
          <>
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-2xl">⚠️</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Order Error</h1>
            <p className="text-gray-300 mb-6 whitespace-pre-line">{error}</p>
            <div className="space-y-3">
              <Button onClick={() => router.push('/')} className="w-full">
                Go Back Home
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/checkout')}
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Try Again
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Payment Successful!</h1>
            <p className="text-gray-300 mb-2">
              Your payment has been processed successfully.
            </p>
            <p className="text-gray-400 mb-6 text-sm">
              Your order has been created and will be processed shortly.
            </p>
            <div className="space-y-3">
              <Button onClick={() => router.push('/')} className="w-full">
                Go Back Home
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/orders')}
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                View My Orders
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
