export type NotificationType = "order" | "payment" | "system"

export interface AppNotification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  createdAt: string // ISO
  read: boolean
  link?: string // e.g. /orders, /checkout/[orderId]
}

const STORAGE_KEY = (userId: string) => `notifications:${userId}`

function load(userId: string): AppNotification[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY(userId))
    return raw ? (JSON.parse(raw) as AppNotification[]) : []
  } catch {
    return []
  }
}

function save(userId: string, items: AppNotification[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY(userId), JSON.stringify(items))
  // broadcast simple update event
  window.dispatchEvent(new CustomEvent("notifications:update", { detail: { userId } }))
}

export function getNotifications(userId: string): AppNotification[] {
  const items = load(userId)
  if (items.length === 0) {
    const seeded = seedSampleNotifications(userId)
    save(userId, seeded)
    return seeded
  }
  // sort newest first
  return [...items].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
}

export function getUnreadCount(userId: string): number {
  return getNotifications(userId).filter((n) => !n.read).length
}

export function addNotification(userId: string, n: Omit<AppNotification, "id" | "userId" | "createdAt" | "read">) {
  const items = load(userId)
  const item: AppNotification = {
    id: crypto.randomUUID(),
    userId,
    createdAt: new Date().toISOString(),
    read: false,
    ...n,
  }
  save(userId, [item, ...items])
}

export function markAsRead(userId: string, id: string) {
  const items = load(userId).map((n) => (n.id === id ? { ...n, read: true } : n))
  save(userId, items)
}

export function markAllAsRead(userId: string) {
  const items = load(userId).map((n) => ({ ...n, read: true }))
  save(userId, items)
}

export function clearAll(userId: string) {
  save(userId, [])
}

// Seed a realistic set of notifications per requirements
export function seedSampleNotifications(userId: string): AppNotification[] {
  const now = new Date()
  const ago = (mins: number) => new Date(now.getTime() - mins * 60000).toISOString()
  const orderId = "ORD-10248"
  const rushOrderId = "ORD-10251"

  return [
    {
      id: crypto.randomUUID(),
      userId,
      type: "payment",
      title: "Payment received",
      message: "Your payment for order ORD-10248 was successful.",
      createdAt: ago(15),
      read: false,
      link: `/orders`,
    },
    {
      id: crypto.randomUUID(),
      userId,
      type: "order",
      title: "Admin uploaded your files",
      message: "Your flyer for ORD-10248 is ready to download.",
      createdAt: ago(18),
      read: false,
      link: `/orders`,
    },
    {
      id: crypto.randomUUID(),
      userId,
      type: "order",
      title: "Status updated",
      message: "Order ORD-10248 moved to Designing.",
      createdAt: ago(45),
      read: true,
      link: `/orders`,
    },
    {
      id: crypto.randomUUID(),
      userId,
      type: "system",
      title: "Upgrade link created",
      message: "A link for Animated Flyer upgrade was added to your profile.",
      createdAt: ago(50),
      read: true,
      link: `/profile`,
    },
    {
      id: crypto.randomUUID(),
      userId,
      type: "order",
      title: "Rush reminder: 1 hour left",
      message: `Order ${rushOrderId} deadline is approaching.`,
      createdAt: ago(70),
      read: false,
      link: `/orders`,
    },
    {
      id: crypto.randomUUID(),
      userId,
      type: "order",
      title: "Rush reminder: 5 hours left",
      message: `Order ${rushOrderId} has 5 hours remaining.`,
      createdAt: ago(120),
      read: true,
      link: `/orders`,
    },
    {
      id: crypto.randomUUID(),
      userId,
      type: "order",
      title: "Order placed",
      message: `Your order ${orderId} was placed successfully.`,
      createdAt: ago(180),
      read: true,
      link: `/orders`,
    },
  ]
}

export function formatTimeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.round(hrs / 24)
  return `${days}d ago`
}
