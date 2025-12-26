import Image from "next/image"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type Status = "pending" | "completed" | "delivered"

export function RecentOrders({
  orders,
}: {
  orders: { id: string; title: string; status: Status; image: string }[]
}) {
  return (
    <section aria-labelledby="recent-orders">
      <div className="mb-3 flex items-center justify-between">
        <h2 id="recent-orders" className="text-lg font-medium">
          Recent orders
        </h2>
        <a
          href="/orders"
          className="text-sm text-accent hover:underline focus:outline-none focus:ring-2 focus:ring-ring"
        >
          View all
        </a>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {orders.slice(0, 3).map((order) => (
          <Card
            key={order.id}
            className="group overflow-hidden rounded-lg border border-border/60 bg-card/80 shadow-sm transition-colors hover:border-primary/50"
          >
            <div className="relative aspect-[16/9] w-full">
              <Image
                src={order.image || "/placeholder.svg"}
                alt={`${order.title} preview`}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-fill"   
                priority
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" />
              <div className="absolute left-3 top-3 flex items-center gap-2">
                <StatusPill status={order.status} />
              </div>
            </div>
            <div className="flex items-center justify-between p-3">
              <div className="min-w-0">
                <p className="truncate text-sm text-muted-foreground">{order.id}</p>
                <h3 className="truncate text-base font-medium">{order.title}</h3>
              </div>
              <a
                href={`/orders/${order.id}`}
                className="rounded-full border border-border/60 px-3 py-1 text-xs text-foreground/80 transition-colors hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label={`Open ${order.title}`}
              >
                Open
              </a>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}

function StatusPill({ status }: { status: Status }) {
  const label = status === "pending" ? "Pending" : status === "completed" ? "Completed" : "Delivered"
  const color = cn(
    "bg-background/80 text-foreground/90",
    status === "pending" && "ring-1 ring-border/70",
    status === "completed" && "text-accent ring-1 ring-accent/30",
    status === "delivered" && "text-primary ring-1 ring-primary/30",
  )
  const dot = cn(
    "h-1.5 w-1.5 rounded-full",
    status === "pending" && "bg-muted-foreground",
    status === "completed" && "bg-accent",
    status === "delivered" && "bg-primary",
  )
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur-sm",
        color,
      )}
    >
      <span className={dot} aria-hidden />
      {label}
    </span>
  )
}
