"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Info, Copy } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { SAMPLE_FLYERS } from "@/lib/types"

export type OrderHistoryItemProps = {
  order: {
    id: string
    title: string
    flyerId: string
    variant?: string
    size?: string
    quantity: number
    priceCents: number
    basePriceCents?: number
    deliveryPriceCents?: number
    currency?: string
    orderedAt: string // ISO string
    orderTime: string
    status: "processing" | "shipped" | "delivered" | "canceled"
    imageUrl?: string
    orderNumber?: string
    deliveryDeadline?: string // ISO string for countdown
    deliverySpeed?: string
    priceDesc: {
      story: string,
      differentDesign: string,
      animatedFlyer: string,
      deliverySpeed: string,
    }
  }
  className?: string
  onReorder?: (orderId: string) => Promise<void> | void
}

function formatMoney(cents: number, currency = "USD") {
  const amount = cents / 100
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `$${amount.toFixed(2)}`
  }
}

function statusBadgeVariant(status: OrderHistoryItemProps["order"]["status"]) {
  switch (status) {
    case "processing":
      return "secondary"
    case "shipped":
      return "secondary"
    case "delivered":
      return "outline"
    case "canceled":
      return "destructive"
    default:
      return "secondary"
  }
}

export function OrderHistoryItem({ order, className, onReorder }: OrderHistoryItemProps) {
  const { toast } = useToast()
  const [isReordering, setIsReordering] = useState(false)
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState("")
  const [flyer, setFlyer] = useState(SAMPLE_FLYERS.find(f => f.id == order.flyerId))

  // ⏳ Countdown timer logic
  useEffect(() => {
    if (!order.deliveryDeadline) return

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const end = new Date(order.deliveryDeadline!).getTime()
      const diff = end - now

      if (diff <= 0) {
        setTimeLeft("Delivered")
        clearInterval(interval)
        return
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      setTimeLeft(`${'00'}h ${'00'}m ${'00'}s`)
    }, 1000)

    return () => clearInterval(interval)
  }, [order.deliveryDeadline])

  // 📋 Copy order ID
  const handleCopy = async () => {
    await navigator.clipboard.writeText(order.orderNumber || order.id)
    setCopied(true)
    toast({ title: "Copied!", description: "Order ID copied to clipboard." })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card
      className={cn(
        "relative p-4 md:p-5 bg-field-background text-card-foreground",
        "flex flex-col gap-4 md:flex-row md:items-start",
        className,
      )}
      role="article"
      aria-label={`Order ${order.orderNumber || order.id}`}
    >
      {/* Image */}
      <figure className="w-full md:w-40 lg:w-48 rounded-lg overflow-hidden bg-secondary">
        <img
          src={order.imageUrl || "/placeholder.svg"}
          alt={`Flyer preview: ${order.title}`}
          className="h-40 w-full object-fill md:h-48"
        />
        <figcaption className="sr-only">Flyer image</figcaption>
      </figure>

      {/* Details + Actions */}
      <div className="flex-1 grid gap-3">
        {/* Header row */}
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div className="grid gap-1">
            <h3 className="text-base md:text-lg font-semibold text-pretty">{order.title}</h3>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              {order.orderNumber && (
                <div className="flex items-center gap-1">
                  <span className="font-medium">Order #{order.orderNumber}</span>
                  <Tooltip>
                    <TooltipTrigger>
                      <Copy
                        className="h-3.5 w-3.5 cursor-pointer hover:text-foreground"
                        onClick={handleCopy}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{copied ? "Copied!" : "Copy Order ID"}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              )}

              <span className="hidden md:inline" aria-hidden>
                ·
              </span>
              <time dateTime={order.orderedAt}>{new Date(order.orderedAt).toLocaleDateString()}</time>
              <span className="hidden md:inline" aria-hidden>
                ·
              </span>
              <span>{order.orderTime}</span>
              <span className="hidden md:inline" aria-hidden>
                ·
              </span>
              <Badge variant={statusBadgeVariant(order.status)}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
              <span className="hidden md:inline" aria-hidden>
                ·
              </span>
              <span>{order.deliverySpeed}</span>
            </div>
          </div>

          {/* Price + Reorder */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="flex items-center justify-end gap-1">
                <div>
                  <div className="text-sm text-muted-foreground">Total</div>
                  <div className="flex gap-1">
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-2 w-2 text-muted-foreground hover:cursor-pointer " />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs text-sm border border-border bg-card w-72">
                        <p className="font-semibold mb-1">Price Breakdown</p>
                        <div className="flex justify-between">
                          <span>Base Price</span><span className="text-xs text-gray-300">${flyer?.price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Story</span><span className="text-xs text-gray-300">+{order.priceDesc.story}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Different Design</span><span className="text-xs text-gray-300">+{order.priceDesc.differentDesign}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Animated Flyer</span><span className="text-xs text-gray-300">+{order.priceDesc.animatedFlyer}</span>
                        </div>
                          <div className="flex justify-between">
                            <span>Delivery ({order.deliverySpeed})</span>
                            <span className="text-xs text-gray-300">+{order.priceDesc.deliverySpeed}</span>
                          </div>
                      </TooltipContent>
                    </Tooltip>
                    <div className="font-medium text-sm">{formatMoney(order.priceCents, order.currency)}</div>
                  </div>
                </div>

                {/* Tooltip for Price Breakdown */}

              </div>
            </div>

            <Button onClick={() => router.push(`/flyer/${order.flyerId}`)}>
              {isReordering ? "Reordering…" : "Reorder"}
            </Button>
          </div>
        </div>

        {/* Order details */}
        <div className="grid gap-2 rounded-md border border-border bg-card/50 p-3 md:p-4">
          <div className="grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
            <div className="grid gap-1">
              <span className="text-muted-foreground">Categor</span>
              <span className="font-medium">{flyer?.category}</span>
            </div>
            <div className="grid gap-1">
              <span className="text-muted-foreground">Size</span>
              <span className="font-medium">{order.size || '8.5" × 11"'}</span>
            </div>
            <div className="grid gap-1">
              <span className="text-muted-foreground">Quantity</span>
              <span className="font-medium">{order.quantity}</span>
            </div>
            <div className="grid gap-1">
              <span className="text-muted-foreground">ID</span>
              <span className="font-mono text-sm">{order.id}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Countdown Timer (bottom center) */}
      {(
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs ">
          {'00h 00m 00s'}
        </div>
      )}
    </Card>
  )
}

export default OrderHistoryItem
