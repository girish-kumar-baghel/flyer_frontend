"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { OrderForm } from "@/components/order/order-form"
import { useAuth } from "@/lib/auth"
import { SAMPLE_FLYERS } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

export default function OrderPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const flyerId = params.flyerId as string
  const selectedFlyer = SAMPLE_FLYERS.find((flyer) => flyer.id === flyerId)

  if (!selectedFlyer) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Flyer not found</h1>
          <p className="text-muted-foreground">The flyer you're looking for doesn't exist.</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Please sign in to place an order</h1>
        </div>
        <Footer />
      </div>
    )
  }

  const handleOrderSubmit = async (orderData: any) => {
    setIsSubmitting(true)
    try {
      // Mock order creation - replace with real API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const orderId = `ORD-${Date.now()}`

      toast({
        title: "Order created!",
        description: "Redirecting to checkout...",
      })

      router.push(`/checkout/${orderId}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Place Your Order</h1>
          <p className="text-muted-foreground">Fill out the details for your custom flyer</p>
        </div>

        <OrderForm selectedFlyer={selectedFlyer} onSubmit={handleOrderSubmit} onCancel={handleCancel} />
      </main>

      <Footer />
    </div>
  )
}
