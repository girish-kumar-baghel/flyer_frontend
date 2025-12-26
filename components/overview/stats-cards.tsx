import { Card } from "@/components/ui/card"

export function StatsCards({ totalPurchased }: { totalPurchased: number }) {
  return (
    <div className="grid gap-4">
      <Card className="rounded-lg border border-border/60 bg-card/80 p-4">
        <p className="text-sm text-muted-foreground">Total flyers purchased</p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-3xl font-semibold">{totalPurchased}</span>
          <span className="text-xs text-muted-foreground">all time</span>
        </div>
      </Card>

      <Card className="rounded-lg border border-border/60 bg-card/80 p-4">
        <p className="text-sm text-muted-foreground">Account health</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="inline-flex h-2 w-2 rounded-full bg-accent" aria-hidden />
          <span className="text-sm">Good standing</span>
        </div>
      </Card>
    </div>
  )
}
