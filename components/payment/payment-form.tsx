"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { CreditCard, Smartphone, Shield, Lock, AlertCircle } from "lucide-react"
import { PAYMENT_METHODS, processStripePayment, processCashAppPayment, formatCurrency } from "@/lib/payments"
import type { StripeCardDetails } from "@/lib/payments"
import { useToast } from "@/hooks/use-toast"

interface PaymentFormProps {
  amount: number
  orderId: string
  orderSummary: {
    items: Array<{
      name: string
      price: number
    }>
    extras: Array<{
      name: string
      price: number
    }>
    delivery: {
      name: string
      price: number
    }
    total: number
  }
  onPaymentSuccess: (paymentIntent: any) => void
  onCancel: () => void
}

export function PaymentForm({ amount, orderId, orderSummary, onPaymentSuccess, onCancel }: PaymentFormProps) {
  const [selectedMethod, setSelectedMethod] = useState("stripe")
  const [isProcessing, setIsProcessing] = useState(false)
  const [saveCard, setSaveCard] = useState(false)
  const [cardDetails, setCardDetails] = useState<StripeCardDetails>({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
    zip: "",
  })
  const { toast } = useToast()

  const handleCardInputChange = (field: keyof StripeCardDetails, value: string) => {
    let formattedValue = value

    // Format card number
    if (field === "number") {
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim()
      if (formattedValue.length > 19) formattedValue = formattedValue.slice(0, 19)
    }

    // Format expiry
    if (field === "expiry") {
      formattedValue = value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2")
      if (formattedValue.length > 5) formattedValue = formattedValue.slice(0, 5)
    }

    // Format CVC
    if (field === "cvc") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4)
    }

    // Format ZIP
    if (field === "zip") {
      formattedValue = value.replace(/\D/g, "").slice(0, 5)
    }

    setCardDetails({ ...cardDetails, [field]: formattedValue })
  }

  const validateCardDetails = (): boolean => {
    if (!cardDetails.number || cardDetails.number.replace(/\s/g, "").length < 13) {
      toast({
        title: "Invalid card number",
        description: "Please enter a valid card number",
        variant: "destructive",
      })
      return false
    }

    if (!cardDetails.expiry || cardDetails.expiry.length !== 5) {
      toast({
        title: "Invalid expiry date",
        description: "Please enter a valid expiry date (MM/YY)",
        variant: "destructive",
      })
      return false
    }

    if (!cardDetails.cvc || cardDetails.cvc.length < 3) {
      toast({
        title: "Invalid CVC",
        description: "Please enter a valid CVC code",
        variant: "destructive",
      })
      return false
    }

    if (!cardDetails.name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter the cardholder name",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      let paymentIntent

      if (selectedMethod === "stripe") {
        if (!validateCardDetails()) {
          setIsProcessing(false)
          return
        }
        paymentIntent = await processStripePayment(amount, cardDetails, orderId)
      } else if (selectedMethod === "cashapp") {
        paymentIntent = await processCashAppPayment(amount, orderId)
      }

      toast({
        title: "Payment successful!",
        description: "Your order has been placed successfully.",
      })

      onPaymentSuccess(paymentIntent)
    } catch (error) {
      toast({
        title: "Payment failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const getCardIcon = (number: string) => {
    const firstDigit = number.replace(/\s/g, "")[0]
    if (firstDigit === "4") return "💳" // Visa
    if (firstDigit === "5") return "💳" // Mastercard
    if (firstDigit === "3") return "💳" // Amex
    return "💳"
  }

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Payment Form */}
      <div className="space-y-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod} className="space-y-4">
              {PAYMENT_METHODS.filter((method) => method.enabled).map((method) => (
                <div key={method.id} className="flex items-center space-x-3 p-4 border border-border rounded-lg">
                  <RadioGroupItem value={method.id} id={method.id} />
                  <div className="flex items-center space-x-3 flex-1">
                    {method.type === "stripe" ? (
                      <CreditCard className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <Smartphone className="w-5 h-5 text-muted-foreground" />
                    )}
                    <div>
                      <Label htmlFor={method.id} className="font-medium cursor-pointer">
                        {method.name}
                      </Label>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Payment Details */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Payment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {selectedMethod === "stripe" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <div className="relative">
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.number}
                        onChange={(e) => handleCardInputChange("number", e.target.value)}
                        className="bg-input border-border pr-10"
                        required
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <span className="text-lg">{getCardIcon(cardDetails.number)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={(e) => handleCardInputChange("expiry", e.target.value)}
                        className="bg-input border-border"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input
                        id="cvc"
                        placeholder="123"
                        value={cardDetails.cvc}
                        onChange={(e) => handleCardInputChange("cvc", e.target.value)}
                        className="bg-input border-border"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input
                      id="cardName"
                      placeholder="John Doe"
                      value={cardDetails.name}
                      onChange={(e) => handleCardInputChange("name", e.target.value)}
                      className="bg-input border-border"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input
                      id="zip"
                      placeholder="12345"
                      value={cardDetails.zip}
                      onChange={(e) => handleCardInputChange("zip", e.target.value)}
                      className="bg-input border-border"
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="saveCard" checked={saveCard} onCheckedChange={(checked) => setSaveCard(!!checked)} />
                    <Label htmlFor="saveCard" className="text-sm cursor-pointer">
                      Save card for future purchases
                    </Label>
                  </div>
                </>
              )}

              {selectedMethod === "cashapp" && (
                <div className="text-center py-8">
                  <Smartphone className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-card-foreground mb-2">Pay with Cash App</h3>
                  <p className="text-muted-foreground mb-4">
                    You'll be redirected to Cash App to complete your payment securely.
                  </p>
                  <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                    Instant Payment
                  </Badge>
                </div>
              )}

              {/* Security Notice */}
              <div className="flex items-start space-x-3 p-4 bg-muted/20 rounded-lg">
                <Shield className="w-5 h-5 text-green-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-card-foreground">Secure Payment</p>
                  <p className="text-xs text-muted-foreground">
                    Your payment information is encrypted and secure. We never store your card details.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
                  Cancel
                </Button>
                <Button type="submit" disabled={isProcessing} className="flex-1">
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Pay {formatCurrency(amount)}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Order Summary */}
      <div className="space-y-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Items */}
            <div className="space-y-3">
              {orderSummary.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-card-foreground">{item.name}</span>
                  <span className="text-card-foreground">{formatCurrency(item.price)}</span>
                </div>
              ))}
            </div>

            {/* Extras */}
            {orderSummary.extras.length > 0 && (
              <>
                <Separator />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-card-foreground">Extras</p>
                  {orderSummary.extras.map((extra, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{extra.name}</span>
                      <span className="text-muted-foreground">+{formatCurrency(extra.price)}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Delivery */}
            <Separator />
            <div className="flex justify-between">
              <span className="text-card-foreground">{orderSummary.delivery.name}</span>
              <span className="text-card-foreground">
                {orderSummary.delivery.price > 0 ? formatCurrency(orderSummary.delivery.price) : "Free"}
              </span>
            </div>

            {/* Total */}
            <Separator />
            <div className="flex justify-between text-lg font-semibold">
              <span className="text-card-foreground">Total</span>
              <span className="text-primary">{formatCurrency(orderSummary.total)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Security Features */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Security & Trust</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="text-sm text-card-foreground">SSL Encrypted</span>
            </div>
            <div className="flex items-center space-x-3">
              <Lock className="w-5 h-5 text-green-400" />
              <span className="text-sm text-card-foreground">PCI DSS Compliant</span>
            </div>
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-card-foreground">Money-back Guarantee</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
