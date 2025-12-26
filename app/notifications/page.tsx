"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingBag, CreditCard, Info, CheckCircle } from "lucide-react"
import { useAuth } from "@/lib/auth"
import {
  type AppNotification,
  getNotifications,
  formatTimeAgo,
  markAsRead,
  markAllAsRead,
  clearAll,
} from "@/lib/notifications"

export default function NotificationsPage() {
  const { user } = useAuth()
  const [items, setItems] = useState<AppNotification[]>([])
  const [tab, setTab] = useState<"all" | "order" | "payment" | "system">("all")

  const unread = useMemo(() => (user ? items.filter((n) => !n.read).length : 0), [items, user])

  useEffect(() => {
    if (!user) return
    setItems(getNotifications(user.id))
    const onUpdate = () => setItems(getNotifications(user.id))
    window.addEventListener("notifications:update", onUpdate as EventListener)
    return () => window.removeEventListener("notifications:update", onUpdate as EventListener)
  }, [user]) // Updated dependency array

  if (!user) {
    return (
      <>
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Please sign in to view your notifications.</p>
            </CardContent>
          </Card>
        </main>
      </>
    )
  }

  const filtered =
    tab === "all"
      ? items
      : items.filter((n) =>
        tab === "order" ? n.type === "order" : tab === "payment" ? n.type === "payment" : n.type === "system",
      )

  const iconFor = (t: AppNotification["type"]) =>
    t === "order" ? (
      <ShoppingBag className="h-5 w-5 text-primary" />
    ) : t === "payment" ? (
      <CreditCard className="h-5 w-5 text-primary" />
    ) : (
      <Info className="h-5 w-5 text-primary" />
    )

  return (
    <>
      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground text-balance">Notifications</h1>
            <p className="text-sm text-muted-foreground">Stay updated on orders, payments, and system messages.</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge>{unread} unread</Badge>
            <Button
              variant="outline"
              onClick={() => {
                markAllAsRead(user.id)
                setItems(getNotifications(user.id))
              }}
              className="hover:!bg-primary hover:!text-white"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                clearAll(user.id)
                setItems(getNotifications(user.id))
              }}
              className="hover:!bg-primary hover:!text-white"
            >
              Clear all
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="space-y-4">
          <TabsList className="bg-muted">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="order">Orders</TabsTrigger>
            <TabsTrigger value="payment">Payments</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3">
            {filtered.length === 0 ? <EmptyState /> : filtered.map((n) => <NotificationItem key={n.id} n={n} />)}
          </TabsContent>
          <TabsContent value="order" className="space-y-3">
            {filtered.length === 0 ? <EmptyState /> : filtered.map((n) => <NotificationItem key={n.id} n={n} />)}
          </TabsContent>
          <TabsContent value="payment" className="space-y-3">
            {filtered.length === 0 ? <EmptyState /> : filtered.map((n) => <NotificationItem key={n.id} n={n} />)}
          </TabsContent>
          <TabsContent value="system" className="space-y-3">
            {filtered.length === 0 ? <EmptyState /> : filtered.map((n) => <NotificationItem key={n.id} n={n} />)}
          </TabsContent>
        </Tabs>
      </main>
    </>
  )
}

function EmptyState() {
  return (
    <Card className="bg-card/50 border-dashed">
      <CardContent className="py-10 text-center text-muted-foreground">No notifications in this category.</CardContent>
    </Card>
  )
}

function NotificationItem({ n }: { n: AppNotification }) {
  const { user } = useAuth()
  if (!user) return null
  const icon =
    n.type === "order" ? (
      <ShoppingBag className="h-5 w-5 text-primary" />
    ) : n.type === "payment" ? (
      <CreditCard className="h-5 w-5 text-primary" />
    ) : (
      <Info className="h-5 w-5 text-primary" />
    )
  const onRead = () => {
    markAsRead(user.id, n.id)
    // trigger update event
    window.dispatchEvent(new CustomEvent("notifications:update", { detail: { userId: user.id } }))
  }

  return (
    <Card className={`transition-colors ${n.read ? "" : "bg-muted/30"}`}>
      <CardContent className="py-4">
        <div className="flex items-start gap-4">
          <div className="mt-0.5">{icon}</div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-medium">{n.title}</h3>
              <Badge variant="outline" className="capitalize">
                {n.type}
              </Badge>
              <span className="text-xs text-muted-foreground ml-auto">{formatTimeAgo(n.createdAt)}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{n.message}</p>
            <div className="mt-3 flex items-center gap-2">
              {n.link ? (
                <Link href={n.link} className="text-xs text-primary hover:underline">
                  View details
                </Link>
              ) : null}
              {!n.read && (
                <button onClick={onRead} className="text-xs text-muted-foreground hover:text-foreground">
                  Mark as read
                </button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
