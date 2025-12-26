// Shared in-memory storage for order data across API routes
// In production, replace with Redis or database

class OrderDataStorage {
    private storage = new Map<string, any>()

    set(key: string, data: any) {
        this.storage.set(key, {
            data,
            timestamp: Date.now()
        })
        this.cleanup()
    }

    get(key: string) {
        const item = this.storage.get(key)
        if (!item) return null

        // Check if data is expired (older than 1 hour)
        const oneHourAgo = Date.now() - (60 * 60 * 1000)
        if (item.timestamp < oneHourAgo) {
            this.storage.delete(key)
            return null
        }

        return item.data
    }

    delete(key: string) {
        this.storage.delete(key)
    }

    private cleanup() {
        const oneHourAgo = Date.now() - (60 * 60 * 1000)
        for (const [key, value] of this.storage.entries()) {
            if (value.timestamp < oneHourAgo) {
                this.storage.delete(key)
            }
        }
    }
}

// Export singleton instance
export const orderDataStore = new OrderDataStorage()
