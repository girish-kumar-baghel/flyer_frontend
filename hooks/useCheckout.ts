import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import type { OrderSubmission } from '@/types/order'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export function useCheckout() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const processCheckout = async (orderData: OrderSubmission) => {
    setIsProcessing(true)
    setError(null)

    try {
      const stripe = await stripePromise
      
      if (!stripe) {
        throw new Error('Failed to load Stripe')
      }

      // Create checkout session
      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: orderData.formData.total_price,
          orderData
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create checkout session')
      }

      const { sessionId } = await response.json()

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({ sessionId })
      
      if (result.error) {
        throw result.error
      }

      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      setError(errorMessage)
      console.error('Checkout error:', err)
      return { success: false, error: errorMessage }
    } finally {
      setIsProcessing(false)
    }
  }

  return { processCheckout, isProcessing, error }
}
