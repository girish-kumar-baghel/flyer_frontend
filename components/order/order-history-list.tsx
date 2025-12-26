import { OrderHistoryItem, type OrderHistoryItemProps } from "./order-history-item"

export type OrderHistoryListProps = {
  orders: OrderHistoryItemProps["order"][]
  onReorder?: OrderHistoryItemProps["onReorder"]
  className?: string
}

export function OrderHistoryList({ orders, onReorder, className }: OrderHistoryListProps) {
  if (!orders?.length) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-center">
        <p className="text-sm text-muted-foreground">No orders yet. Your past flyer orders will appear here.</p>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="grid gap-4">
        {orders.map((order) => (
          <OrderHistoryItem key={order.id} order={order} onReorder={onReorder} />
        ))}
      </div>
    </div>
  )
}

export default OrderHistoryList
