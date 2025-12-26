export interface PaymentMethod {
  id: string
  type: "stripe" | "cashapp"
  name: string
  description: string
  icon: string
  enabled: boolean
}

export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: "pending" | "processing" | "succeeded" | "failed"
  paymentMethod: string
  orderId: string
  createdAt: string
}

export interface StripeCardDetails {
  number: string
  expiry: string
  cvc: string
  name: string
  zip: string
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "stripe",
    type: "stripe",
    name: "Credit/Debit Card",
    description: "Pay securely with your credit or debit card",
    icon: "CreditCard",
    enabled: true,
  },
  {
    id: "cashapp",
    type: "cashapp",
    name: "Cash App",
    description: "Pay instantly with Cash App",
    icon: "Smartphone",
    enabled: true,
  },
]

// Mock payment processing functions
export const processStripePayment = async (
  amount: number,
  cardDetails: StripeCardDetails,
  orderId: string,
): Promise<PaymentIntent> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Mock validation
  if (cardDetails.number === "4000000000000002") {
    throw new Error("Your card was declined")
  }

  if (cardDetails.cvc === "000") {
    throw new Error("Invalid CVC code")
  }

  return {
    id: `pi_${Date.now()}`,
    amount,
    currency: "usd",
    status: "succeeded",
    paymentMethod: "stripe",
    orderId,
    createdAt: new Date().toISOString(),
  }
}

export const processCashAppPayment = async (amount: number, orderId: string): Promise<PaymentIntent> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Mock Cash App payment flow
  return {
    id: `ca_${Date.now()}`,
    amount,
    currency: "usd",
    status: "succeeded",
    paymentMethod: "cashapp",
    orderId,
    createdAt: new Date().toISOString(),
  }
}

export const createUpgradePaymentLink = async (orderId: string, upgradeAmount: number): Promise<string> => {
  // Mock upgrade link generation
  await new Promise((resolve) => setTimeout(resolve, 500))
  return `https://pay.grodify.com/upgrade/${orderId}?amount=${upgradeAmount}`
}

export const formatCurrency = (amount: number, currency = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount)
}
