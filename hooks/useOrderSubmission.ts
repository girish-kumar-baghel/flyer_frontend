import { useState } from 'react';
import { OrderSubmission } from '@/types/order';
import { submitOrder } from '@/lib/api/order';
import { useRouter } from 'next/navigation';

export function useOrderSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmitOrder = async (orderSubmission: OrderSubmission) => {
    setIsSubmitting(true)
    setError(null)

    try {
      console.log('Starting order submission...')
      console.log('Order data:', orderSubmission)
      
      const result = await submitOrder(orderSubmission)
      
      console.log('Submit order result:', result)

      if (result.success) {
        console.log('Order submitted successfully')
        // Redirect to success page with order ID if available
        const orderId = result.data?.orderId || result.data?.id || result.data?._id
        console.log('Redirecting to thank-you page with orderId:', orderId)
        router.push(`/thank-you${orderId ? `?orderId=${orderId}` : ''}`)
        return { success: true, data: result.data }
      } else {
        console.error('Order submission failed:', result.error)
        throw new Error(result.error || 'Failed to submit order')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      setError(errorMessage)
      console.error('Order submission failed:', err)
      return { success: false, error: errorMessage }
    } finally {
      setIsSubmitting(false)
    }
  };

  return { handleSubmitOrder, isSubmitting, error };
}

export default useOrderSubmission;
