import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { OrdersTable } from "@/components/admin/orders-table"
import { Card, CardContent } from "@/components/ui/card"
import { SAMPLE_ORDERS } from "@/lib/orders"
import { Clock, AlertTriangle, CheckCircle } from "lucide-react"

export default function AdminOrdersPage() {
  const urgentOrders = SAMPLE_ORDERS.filter((order) => {
    const deadline = new Date(order.deliveryDeadline)
    const now = new Date()
    const hoursRemaining = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60)
    return hoursRemaining <= 1
  }).length

  const pendingOrders = SAMPLE_ORDERS.filter((order) => order.status === "pending").length
  const inProgressOrders = SAMPLE_ORDERS.filter(
    (order) => order.status === "in-progress" || order.status === "designing",
  ).length

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Orders Management</h1>
            <p className="text-muted-foreground">Manage and track all customer orders</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <div>
                    <p className="text-sm text-muted-foreground">Urgent Orders</p>
                    <p className="text-2xl font-bold text-red-400">{urgentOrders}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-orange-400" />
                  <div>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                    <p className="text-2xl font-bold text-orange-400">{inProgressOrders}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold text-green-400">{pendingOrders}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Orders Table */}
          <OrdersTable />
        </main>
      </div>
    </div>
  )
}
