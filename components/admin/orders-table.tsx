"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SAMPLE_ORDERS, ORDER_STATUSES, type Order } from "@/lib/orders"
import { Search, MoreHorizontal, Eye, Download, Clock, AlertTriangle } from "lucide-react"

export function OrdersTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  const getOrderPriority = (order: Order) => {
    const now = new Date()
    const deadline = new Date(order.deliveryDeadline)
    const hoursRemaining = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60)

    if (hoursRemaining <= 1) return "urgent"
    if (hoursRemaining <= 5) return "high"
    return "normal"
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      case "high":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20"
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
    }
  }

  const filteredOrders = SAMPLE_ORDERS.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderDetails.presenting.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const priority = getOrderPriority(order)
    const matchesPriority = priorityFilter === "all" || priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  }).sort((a, b) => {
    // Sort by priority (urgent first) then by deadline
    const aPriority = getOrderPriority(a)
    const bPriority = getOrderPriority(b)

    if (aPriority === "urgent" && bPriority !== "urgent") return -1
    if (bPriority === "urgent" && aPriority !== "urgent") return 1
    if (aPriority === "high" && bPriority === "normal") return -1
    if (bPriority === "high" && aPriority === "normal") return 1

    return new Date(a.deliveryDeadline).getTime() - new Date(b.deliveryDeadline).getTime()
  })

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    console.log(`Updating order ${orderId} to status: ${newStatus}`)
    // TODO: Implement status update
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-card-foreground">Orders Management</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64 bg-input border-border"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32 bg-input border-border">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {Object.entries(ORDER_STATUSES).map(([value, { label }]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-32 bg-input border-border">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => {
              const priority = getOrderPriority(order)
              const deadline = new Date(order.deliveryDeadline)
              const isOverdue = deadline < new Date()

              return (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      {priority === "urgent" && <AlertTriangle className="w-4 h-4 text-red-400" />}
                      <span>{order.id}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.orderDetails.presenting}</p>
                      <p className="text-sm text-muted-foreground">Customer #{order.userId}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.orderDetails.mainTitle}</p>
                      <p className="text-sm text-muted-foreground">{order.items.length} item(s)</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={ORDER_STATUSES[order.status].color}>{ORDER_STATUSES[order.status].label}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(priority)}>{priority}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className={isOverdue ? "text-red-400" : "text-muted-foreground"}>
                        {deadline.toLocaleDateString()}{" "}
                        {deadline.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">${order.totalAmount}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover border-border">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Download Assets
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "in-progress")}>
                          Mark In Progress
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "designing")}>
                          Mark Designing
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "ready")}>
                          Mark Ready
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        {filteredOrders.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No orders found matching your criteria</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
