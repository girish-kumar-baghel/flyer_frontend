"use client"

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { OrderForm } from '@/components/order/order-form'
import { Flyer } from '@/lib/types'
import { SAMPLE_FLYERS } from '@/lib/types'

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const [selectedFlyer, setSelectedFlyer] = useState<Flyer | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Get flyer ID from URL params
    const flyerId = searchParams.get('flyerId')
    
    if (flyerId) {
      // Find the flyer in sample data
      const flyer = SAMPLE_FLYERS.find(f => f.id === flyerId)
      if (flyer) {
        setSelectedFlyer(flyer)
      } else {
        setError('Flyer not found')
      }
    } else {
      setError('No flyer selected')
    }

    // Check for error params
    const errorParam = searchParams.get('error')
    const messageParam = searchParams.get('message')
    
    if (errorParam) {
      setError(messageParam || 'An error occurred during checkout')
    }
  }, [searchParams])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Checkout Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  if (!selectedFlyer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <OrderForm
          selectedFlyer={selectedFlyer}
          onCancel={() => window.history.back()}
        />
      </div>
    </div>
  )
}
