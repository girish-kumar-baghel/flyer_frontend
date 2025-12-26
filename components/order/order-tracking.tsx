"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Clock, CheckCircle, Circle, Download, MessageSquare } from "lucide-react"
import { ORDER_STATUSES, type Order } from "@/lib/orders"

interface OrderTrackingProps {
  order: Order
}

export function OrderTracking({ order }: OrderTrackingProps) {
  const getStatusProgress = (status: string) => {
    const statuses = ["pending", "in-progress", "designing", "ready", "delivered"]
    const currentIndex = statuses.indexOf(status)
    return ((currentIndex + 1) / statuses.length) * 100
  }

  const getTimeRemaining = (deadline: string) => {
    const now = new Date()
    const deadlineDate = new Date(deadline)
    const diff = deadlineDate.getTime() - now.getTime()

    if (diff <= 0) return "Overdue"

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`
    }
    return `${minutes}m remaining`
  }

  const isUrgent = (deadline: string) => {
    const now = new Date()
    const deadlineDate = new Date(deadline)
    const diff = deadlineDate.getTime() - now.getTime()
    return diff <= 60 * 60 * 1000 // 1 hour or less
  }

  return (
    <div className="space-y-6">
      {/* Order Header */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-card-foreground">Order #{order.id}</CardTitle>
              <p className="text-muted-foreground">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <Badge className={ORDER_STATUSES[order.status].color}>{ORDER_STATUSES[order.status].label}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-muted-foreground">{Math.round(getStatusProgress(order.status))}%</span>
            </div>
            <Progress value={getStatusProgress(order.status)} className="h-2" />
          </div>

          {/* Delivery Info */}
          <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Clock
                className={`w-4 h-4 ${isUrgent(order.deliveryDeadline) ? "text-red-400" : "text-muted-foreground"}`}
              />
              <span
                className={`text-sm ${isUrgent(order.deliveryDeadline) ? "text-red-400" : "text-muted-foreground"}`}
              >
                {getTimeRemaining(order.deliveryDeadline)}
              </span>
            </div>
            <span className="text-sm font-medium">Expected: {new Date(order.deliveryDeadline).toLocaleString()}</span>
          </div>

          {/* Order Items */}
          <div className="space-y-3">
            <h4 className="font-medium text-card-foreground">Order Items</h4>
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 p-3 border border-border rounded-lg">
                <img
                  src={item.flyerImage || "/placeholder.svg"}
                  alt={item.flyerName}
                  className="w-12 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h5 className="font-medium text-card-foreground">{item.flyerName}</h5>
                  <p className="text-sm text-muted-foreground">
                    {item.priceType} • ${item.price}
                  </p>
                  {Object.entries(item.extras).some(([_, value]) => value) && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.extras.storySize && (
                        <Badge variant="outline" className="text-xs">
                          Story Size
                        </Badge>
                      )}
                      {item.extras.makeDifferent && (
                        <Badge variant="outline" className="text-xs">
                          Custom
                        </Badge>
                      )}
                      {item.extras.animated && (
                        <Badge variant="outline" className="text-xs">
                          Animated
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex justify-between items-center pt-3 border-t border-border">
            <span className="font-medium text-card-foreground">Total Amount</span>
            <span className="text-lg font-bold text-primary">${order.totalAmount}</span>
          </div>
        </CardContent>
      </Card>

      {/* Tracking Timeline */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Order Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.trackingUpdates.map((update, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {update.status === order.status ? (
                    <Circle className="w-4 h-4 text-primary fill-primary" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-card-foreground">
                    {ORDER_STATUSES[update.status as keyof typeof ORDER_STATUSES]?.label || update.status}
                  </p>
                  <p className="text-sm text-muted-foreground">{update.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(update.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {order.status === "ready" && (
            <Button className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download Flyer
            </Button>
          )}

          <Button variant="outline" className="w-full bg-transparent">
            <MessageSquare className="w-4 h-4 mr-2" />
            Contact Support
          </Button>

          {order.status !== "delivered" && (
            <Button variant="outline" className="w-full bg-transparent">
              Request Changes
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
