"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { PaymentForm } from "@/components/payment/payment-form"
import { PaymentSuccess } from "@/components/payment/payment-success"
import { useAuth } from "@/lib/auth"
import { SAMPLE_ORDERS } from "@/lib/orders"
import { DELIVERY_OPTIONS } from "@/lib/orders"
import type { PaymentIntent } from "@/lib/payments"

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const orderId = params.orderId as string

  // Mock order data - in real app, fetch from API
  const order = SAMPLE_ORDERS.find((o) => o.id === orderId)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Please sign in to continue</h1>
        </div>
        <Footer />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading checkout...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Order not found</h1>
          <p className="text-muted-foreground">The order you're looking for doesn't exist.</p>
        </div>
        <Footer />
      </div>
    )
  }

  const handlePaymentSuccess = (intent: PaymentIntent) => {
    setPaymentIntent(intent)
  }

  const handleContinue = () => {
    router.push("/orders")
  }

  const handleCancel = () => {
    router.back()
  }

  // Prepare order summary for payment form
  const orderSummary = {
    items: order.items.map((item) => ({
      name: item.flyerName,
      price: item.price,
    })),
    extras: [
      ...(order.items[0]?.extras.storySize ? [{ name: "Story Size Version", price: 10 }] : []),
      ...(order.items[0]?.extras.makeDifferent ? [{ name: "Make Different/Custom", price: 10 }] : []),
      ...(order.items[0]?.extras.animated ? [{ name: "Animated Flyer", price: 25 }] : []),
    ],
    delivery: {
      name: DELIVERY_OPTIONS.find((d) => d.value === order.deliveryOption)?.label || "Standard Delivery",
      price: DELIVERY_OPTIONS.find((d) => d.value === order.deliveryOption)?.price || 0,
    },
    total: order.totalAmount,
  }

  const orderDetails = {
    orderId: order.id,
    customerEmail: user.email,
    items: orderSummary.items,
    total: order.totalAmount,
    deliveryTime: DELIVERY_OPTIONS.find((d) => d.value === order.deliveryOption)?.label || "24 hours",
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {!paymentIntent ? (
          <>
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-foreground mb-2">Complete Your Payment</h1>
              <p className="text-muted-foreground">Secure checkout for Order #{orderId}</p>
            </div>

            <PaymentForm
              amount={order.totalAmount}
              orderId={orderId}
              orderSummary={orderSummary}
              onPaymentSuccess={handlePaymentSuccess}
              onCancel={handleCancel}
            />
          </>
        ) : (
          <>
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-foreground mb-2">Payment Complete</h1>
              <p className="text-muted-foreground">Thank you for your order!</p>
            </div>

            <PaymentSuccess paymentIntent={paymentIntent} orderDetails={orderDetails} onContinue={handleContinue} />
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
