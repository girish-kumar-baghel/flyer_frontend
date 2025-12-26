import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { RecentOrders } from "../../components/overview/recent-orders"
import { StatsCards } from "../../components/overview/stats-cards"
import { QuickActions } from "../../components/overview/quick-actions"

export default function OverviewPage() {
  const orders = [
    {
      id: "FLY-1029",
      title: "Summer Sale Flyer",
      status: "pending" as const,
      image: "/pic22.jpg",
    },
    {
      id: "FLY-1028",
      title: "Grand Opening Poster",
      status: "completed" as const,
      image: "/pic23.jpg",
    },
    {
      id: "FLY-1027",
      title: "Event Night Handout",
      status: "delivered" as const,
      image: "/pic24.jpg",
    },
  ]

  const totalPurchased = 128

  return (
    <main className="min-h-screen">
      {/* Hero header */}
      <section className="mx-auto w-full max-w-6xl px-4 pt-10 md:pt-14">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h1 className={cn("text-pretty text-3xl font-semibold tracking-tight md:text-4xl")}>Overview</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              A quick snapshot of your recent activity and essentials.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button className="rounded-full px-5">New Flyer</Button>
            <Button
              variant="outline"
              className="rounded-full border-border/60 px-5 hover:border-primary bg-transparent"
            >
              Import Design
            </Button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Suspense>
              <RecentOrders orders={orders} />
            </Suspense>
          </div>
          <div className="md:col-span-1">
            <StatsCards totalPurchased={totalPurchased} />
            <div className="mt-6">
              <QuickActions />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
