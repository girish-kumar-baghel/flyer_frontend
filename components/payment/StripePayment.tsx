'use client';

import { useState, useEffect } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { OrderSubmission } from '@/types/order';
import { submitOrder } from '@/lib/api/order';
import { useRouter } from 'next/navigation';

interface StripePaymentProps {
  orderData: OrderSubmission;
  clientSecret: string;
  onPaymentProcessing?: (isProcessing: boolean) => void;
}

export function StripePayment({
  orderData,
  clientSecret,
  onPaymentProcessing,
}: StripePaymentProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (onPaymentProcessing) {
      onPaymentProcessing(isLoading);
    }
  }, [isLoading, onPaymentProcessing]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // First, confirm the payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/thank-you`,
          receipt_email: orderData.userEmail,
        },
        redirect: 'if_required',
      });

      if (stripeError) {
        throw new Error(stripeError.message || 'Payment failed');
      }

      if (paymentIntent?.status === 'succeeded') {
        // Payment succeeded, now submit the order
        const result = await submitOrder(orderData);

        if (result.success) {
          // Redirect to thank you page with order ID if available
          const orderId = result.data?.orderId;
          router.push(`/thank-you${orderId ? `?orderId=${orderId}` : ''}`);
        } else {
          throw new Error(result.error || 'Failed to submit order');
        }
      } else {
        throw new Error('Payment was not successful');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      toast({
        title: 'Payment Error',
        description: errorMessage,
        variant: 'destructive',
      });
      console.error('Payment error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement
        options={{
          layout: 'tabs',
          fields: {
            billingDetails: {
              email: 'never', // We already have the email from the order form
            },
          },
        }}
      />
      
      {error && (
        <div className="text-red-500 text-sm mt-2">{error}</div>
      )}

      <Button
        type="submit"
        className="w-full mt-6"
        disabled={!stripe || isLoading}
      >
        {isLoading ? 'Processing...' : `Pay $${orderData.formData.total_price.toFixed(2)}`}
      </Button>

      <div className="text-xs text-gray-500 mt-2">
        Your payment is secured with Stripe. We do not store your payment details.
      </div>
    </form>
  );
}

export default StripePayment;
