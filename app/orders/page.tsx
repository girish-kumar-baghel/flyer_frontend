"use client"

import { useState, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores/StoreProvider"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Calendar, Package, Clock, DollarSign } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface DJ {
  name: string
  image: string | null
}

interface Host {
  name: string
  image: string | null
}

interface Sponsor {
  name: string | { name: string }
  image: string | null
}

interface Order {
  id: number
  presenting: string
  event_title: string
  event_date: string
  address_phone: string
  flyer_info: string
  venue_logo: string | null
  image_url: string | null
  djs: DJ[]
  host: Host
  sponsors: Sponsor[]
  delivery_time: string
  custom_notes: string
  total_price: number | null
  status: string
  created_at: string
}

interface OrdersResponse {
  success: boolean
  count: number
  orders: Order[]
}

const OrdersPage = observer(() => {
  const { authStore } = useStore()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    if (authStore.user?.id) {
      fetchOrders()
    } else {
      setLoading(false)
    }
  }, [authStore.user?.id])

  const fetchOrders = async () => {
    if (!authStore.user?.id) return

    setLoading(true)
    try {
      const response = await fetch(`http://193.203.161.174:3007/api/orders/user/${authStore.user.id}`)

      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }

      const data: OrdersResponse = await response.json()

      if (data.success) {
        setOrders(data.orders)
        console.log('✅ Orders loaded:', data.count)
      } else {
        toast.error('Failed to load orders')
      }
    } catch (error) {
      console.error('❌ Error fetching orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.event_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.presenting.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm)
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'bg-green-500/20 text-green-400 border-green-500/50'
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
      case 'processing':
      case 'in_progress':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50'
      case 'cancelled':
      case 'canceled':
        return 'bg-red-500/20 text-red-400 border-red-500/50'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50'
    }
  }

  const getSponsorName = (sponsor: Sponsor): string => {
    if (typeof sponsor.name === 'string') {
      return sponsor.name
    } else if (sponsor.name && typeof sponsor.name === 'object' && 'name' in sponsor.name) {
      return sponsor.name.name || ''
    }
    return ''
  }

  if (!authStore.user) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to view your orders</h1>
          <Button onClick={() => router.push('/')} className="bg-primary hover:bg-red-600">
            Go to Home
          </Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading your orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">My Orders</h1>
          <p className="text-gray-400">Track and manage your flyer orders ({orders.length} total)</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by event title, presenter, or order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-900 border-gray-800 text-white"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-gray-900 border-gray-800 text-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-800">
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="bg-gray-900 border-gray-800 hover:border-primary/50 transition-all">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Flyer Image */}
                    <div className="flex-shrink-0">
                      <div className="w-24 h-32 rounded-lg overflow-hidden bg-gray-800 border border-gray-700">
                        {(order.image_url || order.venue_logo) ? (
                          <img
                            src={order.image_url || order.venue_logo || ''}
                            alt={order.event_title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                              e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg></div>'
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-8 h-8 text-gray-600" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-bold text-white truncate">{order.event_title}</h3>
                          <p className="text-xs text-gray-400 truncate">by {order.presenting}</p>
                        </div>
                        <Badge className={`${getStatusColor(order.status)} border text-xs flex-shrink-0`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2 text-xs">
                        <div className="flex items-center gap-1 text-gray-400">
                          <Package className="w-3 h-3 text-primary flex-shrink-0" />
                          <span className="truncate">#{order.id}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400">
                          <Calendar className="w-3 h-3 text-primary flex-shrink-0" />
                          <span className="truncate">{formatDate(order.event_date)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400">
                          <Clock className="w-3 h-3 text-primary flex-shrink-0" />
                          <span className="truncate">{order.delivery_time}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400">
                          <DollarSign className="w-3 h-3 text-primary flex-shrink-0" />
                          <span className="truncate font-semibold text-white">
                            {order.total_price
                              ? `$${Number(order.total_price).toFixed(2)}`
                              : 'N/A'}
                          </span>
                        </div>
                      </div>

                      {/* Compact Details */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                        {order.djs && order.djs.length > 0 && order.djs.some(dj => dj.name) && (
                          <span className="truncate">
                            <span className="text-gray-500">DJs:</span> {order.djs.map(dj => dj.name).filter(name => name).join(', ')}
                          </span>
                        )}
                        {order.host && order.host.name && (
                          <span className="truncate">
                            <span className="text-gray-500">Host:</span> {order.host.name}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs border-primary text-primary hover:bg-primary hover:text-white"
                          onClick={() => {
                            toast.info('Order details coming soon!')
                          }}
                        >
                          View Details
                        </Button>
                        {order.status === 'completed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs border-gray-700 hover:bg-gray-800"
                            onClick={() => {
                              toast.info('Reorder functionality coming soon!')
                            }}
                          >
                            Reorder
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No orders found</h3>
              <p className="text-gray-400 mb-6">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "You haven't placed any orders yet"}
              </p>
              {!searchTerm && statusFilter === "all" && (
                <Button
                  className="bg-primary hover:bg-red-600"
                  onClick={() => router.push('/categories')}
                >
                  Browse Flyers
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
})

export default OrdersPage
