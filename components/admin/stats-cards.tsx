import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, ShoppingBag, Users, DollarSign, Clock } from "lucide-react"
import type { AdminStats } from "@/lib/admin"

interface StatsCardsProps {
  stats: AdminStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      change: "+12%",
      trend: "up",
      icon: ShoppingBag,
    },
    {
      title: "Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: "+8%",
      trend: "up",
      icon: DollarSign,
      subtitle: `$${stats.todayRevenue} today`,
    },
    {
      title: "Customers",
      value: stats.totalCustomers.toLocaleString(),
      change: "+5%",
      trend: "up",
      icon: Users,
      subtitle: `${stats.newCustomers} new this week`,
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders.toString(),
      urgent: stats.urgentOrders,
      icon: Clock,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index} className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{card.value}</div>
            {card.change && (
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                {card.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-green-400" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-400" />
                )}
                <span className={card.trend === "up" ? "text-green-400" : "text-red-400"}>{card.change}</span>
                <span>from last month</span>
              </div>
            )}
            {card.subtitle && <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>}
            {card.urgent && card.urgent > 0 && (
              <Badge variant="destructive" className="mt-2">
                {card.urgent} urgent
              </Badge>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
