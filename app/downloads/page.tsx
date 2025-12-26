"use client"

import type React from "react"

import Link from "next/link"
import useSWR from "swr"
import { useEffect, useMemo, useState } from "react"
import { Download, ExternalLink, FileText, Film, ImageIcon, CheckCheck } from "lucide-react"
import { useStore } from "@/stores/StoreProvider"
import { observer } from "mobx-react-lite"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    getDownloads,
    fetchUserDownloads,
    markFileRead,
    markAllRead,
    formatBytes,
    type DeliveredFile,
    type OrderDelivery,
} from "@/lib/downloads"

type FilterKey = "all" | "image" | "video" | "document"

const fetcher = (userId: string) => () => fetchUserDownloads(userId)

const DownloadsPage = observer(() => {
    const { authStore } = useStore()
    const [filter, setFilter] = useState<FilterKey>("all")
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [authStore.user])

    const { data, mutate } = useSWR<OrderDelivery[]>(
        authStore.user ? ["downloads", authStore.user.id] : null,
        authStore.user ? fetcher(authStore.user.id) : null,
        { revalidateOnFocus: false },
    )

    const filtered = useMemo(() => {
        if (!data) return []
        if (filter === "all") return data
        return data
            .map((od) => ({
                ...od,
                files: od.files.filter((f) => f.type === filter),
            }))
            .filter((od) => od.files.length > 0)
    }, [data, filter])

    // Prevent hydration mismatch
    if (!mounted) {
        return (
            <main className="container mx-auto max-w-6xl px-4 py-8">
                <h1 className="text-xl md:text-2xl font-semibold text-foreground text-balance">Downloads</h1>
                <p className="text-muted-foreground mt-2">Loading...</p>
            </main>
        )
    }

    // Only show sign-in message if user is not authenticated
    if (!authStore.user) {
        return (
            <main className="container mx-auto max-w-6xl px-4 py-8">
                <h1 className="text-xl md:text-2xl font-semibold text-foreground text-balance">Downloads</h1>
                <p className="text-muted-foreground mt-2">Sign in to view and download your delivered files.</p>
            </main>
        )
    }

    const unreadTotal = (data || []).reduce((sum, od) => sum + od.files.filter((f) => f.unread).length, 0)

    const handleMarkAllRead = async () => {
        markAllRead(authStore.user!.id)
        mutate()
    }

    const headerIcon = (t: DeliveredFile["type"]) => {
        switch (t) {
            case "image":
                return <ImageIcon className="size-4" />
            case "video":
                return <Film className="size-4" />
            case "document":
                return <FileText className="size-4" />
            case "psd":
                return <FileText className="size-4" />
            default:
                return <FileText className="size-4" />
        }
    }

    return (
        <main className="container mx-auto max-w-6xl px-4 py-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl md:text-2xl font-semibold text-foreground text-balance">Downloads</h1>
                    <p className="text-muted-foreground mt-2">
                        Access all delivered files grouped by order. New deliveries are highlighted.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {unreadTotal > 0 && (
                        <Badge variant="destructive" className="h-6">
                            {unreadTotal} New
                        </Badge>
                    )}
                    <Button variant="secondary" size="sm" className="bg-primary text-white hover:bg-popover hover:cursor-pointer" onClick={handleMarkAllRead}>
                        <CheckCheck className="mr-2 h-4 w-4" />
                        Mark all as read
                    </Button>
                </div>
            </div>

            <div className="mt-6">
                <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterKey)}>
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="image">Images</TabsTrigger>
                        <TabsTrigger value="video">Videos</TabsTrigger>
                        <TabsTrigger value="document">Documents</TabsTrigger>
                    </TabsList>
                    <TabsContent value={filter} className="mt-4">
                        <div className="space-y-6">
                            {filtered.length === 0 ? (
                                <div className="border border-border rounded-lg p-8 bg-card">
                                    <p className="text-muted-foreground">No downloads found for this filter.</p>
                                </div>
                            ) : (
                                filtered.map((order) => (
                                    <OrderBlock
                                        key={order.orderId}
                                        order={order}
                                        userId={authStore.user!.id}
                                        onMutate={() => mutate()}
                                        headerIcon={headerIcon}
                                    />
                                ))
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    )
})

export default DownloadsPage


function OrderBlock({
    order,
    userId,
    onMutate,
    headerIcon,
}: {
    order: OrderDelivery
    userId: string
    onMutate: () => void
    headerIcon: (t: DeliveredFile["type"]) => React.ReactNode
}) {
    const unread = order.files.some((f) => f.unread)

    return (
        <section className="rounded-lg border border-border bg-card">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 p-4 md:p-5 border-b border-border">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-10 rounded-md bg-muted text-muted-foreground">
                        <Download className="size-5" />
                    </div>
                    <div>
                        <h2 className="text-base md:text-lg font-semibold text-foreground flex items-center gap-2">
                            {order.title}
                            {unread && (
                                <Badge variant="destructive" className="h-5">
                                    New
                                </Badge>
                            )}
                        </h2>
                        <p className="text-xs md:text-sm text-muted-foreground">
                            Order {order.orderId} • Delivered {new Date(order.deliveredAt).toLocaleString()}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link
                        href={`/orders?orderId=${order.orderId}`}
                        className="text-sm text-primary hover:underline inline-flex items-center"
                    >
                        View Order Details
                        <ExternalLink className="ml-1 h-4 w-4" />
                    </Link>
                </div>
            </div>

            <div className="p-4 md:p-5">
                <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {order.files.length === 0 ? (
                        <li className="col-span-full py-8 text-center border border-dashed border-border rounded-lg bg-background/20">
                            <p className="text-muted-foreground">Files are being prepared...</p>
                        </li>
                    ) : (
                        order.files.map((file) => (
                            <li key={file.id} className="rounded-md border border-border bg-background/40 p-4 flex gap-2">
                                {/* image  */}
                                <div>
                                    <img src={file.url} alt="flyer" className="object-fill h-26" />
                                </div>
                                <div className="flex flex-col justify-between">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-baseline gap-2">
                                            {headerIcon(file.type)}
                                            <div>
                                                <p className="text-sm font-medium text-foreground">{file.fileName}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {file.type.toUpperCase()} • {formatBytes(file.size)}
                                                </p>
                                            </div>
                                        </div>
                                        {file.unread && (
                                            <span className="inline-block h-2 w-2 rounded-full bg-primary" aria-label="unread indicator" />
                                        )}
                                    </div>

                                    <div className="mt-3 flex items-center justify-between gap-2">
                                        <a
                                            href={file.url}
                                            download
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-md border border-border hover:bg-primary transition"
                                            onClick={() => {
                                                markFileRead(userId, order.orderId, file.id)
                                                onMutate()
                                            }}
                                        >
                                            <Download className="h-4 w-4" />
                                            Download
                                        </a>
                                        <span className="text-xs text-muted-foreground">{file.unread ? "New" : "Viewed"}</span>
                                    </div>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </section>
    )
}
