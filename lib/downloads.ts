"use client"

export type DeliveredFileType = "image" | "video" | "document" | "psd"

export interface DeliveredFile {
    id: string
    fileName: string
    type: DeliveredFileType
    size: number // bytes
    url: string
    unread: boolean
}

export interface OrderDelivery {
    orderId: string
    title: string
    deliveredAt: string // ISO
    files: DeliveredFile[]
}

const keyFor = (userId: string) => `grodify_downloads_${userId}`

export function getDownloads(userId: string): OrderDelivery[] {
    if (typeof window === "undefined") return []
    const raw = window.localStorage.getItem(keyFor(userId))
    try {
        return raw ? (JSON.parse(raw) as OrderDelivery[]) : []
    } catch {
        return []
    }
}

function setDownloads(userId: string, data: OrderDelivery[]) {
    if (typeof window === "undefined") return
    window.localStorage.setItem(keyFor(userId), JSON.stringify(data))
}

import { getApiUrl } from "@/config/api"

export async function fetchUserDownloads(userId: string): Promise<OrderDelivery[]> {
    try {
        // 1. Fetch user orders
        const response = await fetch(getApiUrl(`/api/orders/user/${userId}`))
        if (!response.ok) throw new Error("Failed to fetch orders")

        const data = await response.json()
        if (!data.success) return []

        const orders = data.orders

        // 2. Fetch files for each order in parallel
        const ordersWithFiles = await Promise.all(
            orders.map(async (order: any) => {
                let files: DeliveredFile[] = []
                try {
                    const filesResponse = await fetch(getApiUrl(`/api/order-files/order/${order.id}`))
                    if (filesResponse.ok) {
                        const filesData = await filesResponse.json()
                        if (filesData.success && Array.isArray(filesData.files)) {
                            files = filesData.files.map((f: any) => ({
                                id: f.id.toString(),
                                fileName: f.original_name || `file-${f.id}.${f.file_type}`,
                                type: mapFileType(f.file_type),
                                size: 0, // Backend doesn't provide size yet
                                url: f.file_url,
                                unread: false, // Could implement unread logic if needed
                            }))
                        }
                    }
                } catch (err) {
                    console.error(`Error fetching files for order ${order.id}:`, err)
                }

                return {
                    orderId: order.id.toString(),
                    title: order.event_title,
                    deliveredAt: order.created_at,
                    files: files
                }
            })
        )

        return ordersWithFiles
    } catch (error) {
        console.error("Error fetching downloads:", error)
        return []
    }
}

function mapFileType(type: string): DeliveredFileType {
    const lower = type.toLowerCase()
    if (lower.includes('image') ||  ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(lower)) return 'image'
    if (lower.includes('video') || ['mp4', 'mov', 'avi'].includes(lower)) return 'video'
    if (lower === 'pdf' || lower === 'doc' || lower === 'docx') return 'document'
    if (lower === 'psd' || lower === 'ai') return 'psd'
    if (lower === 'zip' || lower === 'rar') return 'document' // Treat archives as documents for now
    return 'document'
}

export function seedSampleDownloads(userId: string) {
    // Legacy seeding disabled in favor of real API data
    if (typeof window === "undefined") return
}

export function getUnreadDownloadsCount(userId: string): number {
    const data = getDownloads(userId)
    return data.reduce((sum, od) => sum + od.files.filter((f) => f.unread).length, 0)
}

export function markFileRead(userId: string, orderId: string, fileId: string) {
    const data = getDownloads(userId)
    let changed = false
    data.forEach((od) => {
        if (od.orderId !== orderId) return
        od.files = od.files.map((f) => (f.id === fileId ? { ...f, unread: false } : f))
        changed = true
    })
    if (changed) setDownloads(userId, data)
    return getDownloads(userId)
}

export function markAllRead(userId: string) {
    const data = getDownloads(userId).map((od) => ({
        ...od,
        files: od.files.map((f) => ({ ...f, unread: false })),
    }))
    setDownloads(userId, data)
    return data
}

export function formatBytes(bytes: number): string {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}
