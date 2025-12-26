export interface AdminUser {
  id: string
  email: string
  name: string
  role: "admin" | "designer" | "manager"
  permissions: string[]
  lastLogin: string
}




export interface AdminStats {
  totalOrders: number
  pendingOrders: number
  urgentOrders: number
  totalRevenue: number
  todayRevenue: number
  totalCustomers: number
  newCustomers: number
  popularFlyers: {
    id: string
    name: string
    orders: number
    revenue: number
  }[]
  recentActivity: {
    id: string
    type: "order" | "user" | "flyer"
    message: string
    timestamp: string
  }[]
}

// Mock admin data
export const MOCK_ADMIN_STATS: AdminStats = {
  totalOrders: 1247,
  pendingOrders: 23,
  urgentOrders: 5,
  totalRevenue: 18750,
  todayRevenue: 340,
  totalCustomers: 892,
  newCustomers: 12,
  popularFlyers: [
    { id: "1", name: "Neon Nights Party", orders: 45, revenue: 675 },
    { id: "2", name: "Halloween Horror Night", orders: 38, revenue: 1520 },
    { id: "3", name: "Ladies Night Elegance", orders: 42, revenue: 420 },
    { id: "4", name: "EDM Festival Vibes", orders: 35, revenue: 525 },
  ],
  recentActivity: [
    {
      id: "1",
      type: "order",
      message: "New order #ORD-1248 placed by john@example.com",
      timestamp: "2024-01-15T16:30:00Z",
    },
    {
      id: "2",
      type: "user",
      message: "New customer registered: sarah@example.com",
      timestamp: "2024-01-15T16:15:00Z",
    },
    {
      id: "3",
      type: "order",
      message: "Order #ORD-1247 marked as ready",
      timestamp: "2024-01-15T16:00:00Z",
    },
  ],
}

export const ADMIN_PERMISSIONS = {
  view_orders: "View Orders",
  manage_orders: "Manage Orders",
  view_users: "View Users",
  manage_users: "Manage Users",
  view_flyers: "View Flyers",
  manage_flyers: "Manage Flyers",
  view_analytics: "View Analytics",
  manage_settings: "Manage Settings",
}
