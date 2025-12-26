"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Download, Mail, MessageSquare } from "lucide-react"
import { formatCurrency } from "@/lib/payments"
import type { PaymentIntent } from "@/lib/payments"

interface PaymentSuccessProps {
  paymentIntent: PaymentIntent
  orderDetails: {
    orderId: string
    customerEmail: string
    items: Array<{
      name: string
      price: number
    }>
    total: number
    deliveryTime: string
  }
  onContinue: () => void
}

export function PaymentSuccess({ paymentIntent, orderDetails, onContinue }: PaymentSuccessProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Success Header */}
      <Card className="bg-card border-border text-center">
        <CardContent className="p-8">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-card-foreground mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground mb-4">Your order has been placed and payment confirmed.</p>
          <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Order #{orderDetails.orderId}</Badge>
        </CardContent>
      </Card>

      {/* Payment Details */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Payment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Payment ID</p>
              <p className="font-medium text-card-foreground">{paymentIntent.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Amount Paid</p>
              <p className="font-medium text-primary">{formatCurrency(paymentIntent.amount)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Payment Method</p>
              <p className="font-medium text-card-foreground capitalize">{paymentIntent.paymentMethod}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Paid</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {orderDetails.items.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-card-foreground">{item.name}</span>
                <span className="text-card-foreground">{formatCurrency(item.price)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-2">
            <div className="flex justify-between font-semibold">
              <span className="text-card-foreground">Total</span>
              <span className="text-primary">{formatCurrency(orderDetails.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">What's Next?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-card-foreground">Confirmation Email</p>
                <p className="text-sm text-muted-foreground">
                  We've sent a confirmation email to {orderDetails.customerEmail}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-card-foreground">Order Processing</p>
                <p className="text-sm text-muted-foreground">Your flyer will be ready in {orderDetails.deliveryTime}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Download className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-card-foreground">Download Ready</p>
                <p className="text-sm text-muted-foreground">You'll receive download links via email and SMS</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={onContinue} className="flex-1">
          View Order Status
        </Button>
        <Button variant="outline" className="flex-1 bg-transparent">
          <MessageSquare className="w-4 h-4 mr-2" />
          Contact Support
        </Button>
      </div>
    </div>
  )
}
