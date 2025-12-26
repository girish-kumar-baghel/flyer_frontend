import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { StatsCards } from "@/components/admin/stats-cards"
import { OrdersTable } from "@/components/admin/orders-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MOCK_ADMIN_STATS } from "@/lib/admin"
import { TrendingUp, Activity } from "lucide-react"

export default function AdminDashboard() {
  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Welcome Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
            </div>
            <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
              <Activity className="w-3 h-3 mr-1" />
              System Online
            </Badge>
          </div>

          {/* Stats Cards */}
          <StatsCards stats={MOCK_ADMIN_STATS} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Orders Table - Takes 2 columns */}
            <div className="lg:col-span-2">
              <OrdersTable />
            </div>

            {/* Sidebar Content */}
            <div className="space-y-6">
              {/* Popular Flyers */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground">Popular Flyers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {MOCK_ADMIN_STATS.popularFlyers.map((flyer) => (
                    <div key={flyer.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-card-foreground">{flyer.name}</p>
                        <p className="text-sm text-muted-foreground">{flyer.orders} orders</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-primary">${flyer.revenue}</p>
                        <div className="flex items-center text-xs text-green-400">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          +12%
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {MOCK_ADMIN_STATS.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-card-foreground">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">{new Date(activity.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
