export type LibraryItem = {
    id: string
    name: string
    type: "image" | "logo"
    dataUrl: string
    createdAt: string
    size?: number
}

const API_BASE_URL = "http://193.203.161.174:3007/api/user-media"

export async function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}

export async function imageFileToWebPDataUrl(file: File, quality = 0.8): Promise<string> {
    const dataUrl = await fileToDataUrl(file)
    const img = await loadImage(dataUrl)
    const canvas = document.createElement("canvas")
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error("Canvas not supported")
    ctx.drawImage(img, 0, 0)
    return canvas.toDataURL("image/webp", quality)
}

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = src
    })
}

export function sanitizeFileName(name: string): string {
    return name.replace(/[^\w\-.]+/g, "_")
}

// 2. Get All Media for User
export async function listLibrary(userId: string, type?: LibraryItem["type"]): Promise<LibraryItem[]> {
    if (!userId || userId === 'guest') return []
    
    // Explicitly encode User ID to be safe, though rare for google IDs to need it.
    const encodedId = encodeURIComponent(userId)
    const url = `${API_BASE_URL}/${encodedId}`

    try {
        console.log(`[API] Fetching media for: ${encodedId}`)
        // Added timestamp AND Cache-Control headers to forcefully prevent caching
        const res = await fetch(`${url}?_t=${Date.now()}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        })
        
        if (!res.ok) {
            console.error(`[API] Error fetching library: ${res.status} ${res.statusText}`)
            return []
        }

        const data = await res.json()
        if (!data.success) {
            console.error("[API] API Error listing library:", data.message)
            return []
        }
        
        const items: LibraryItem[] = (data.media || []).map((m: any) => ({
            id: String(m.id),
            name: m.original_name,
            type: m.is_logo ? "logo" : "image", 
            dataUrl: m.file_url,
            createdAt: m.created_at || new Date().toISOString(),
            size: undefined
        }))

        // Sort by created desc (newest first)
        items.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))

        if (type) {
            return items.filter(i => i.type === type)
        }
        return items
    } catch (error) {
        console.error("[API] Network/Parsing Error listing library:", error)
        return []
    }
}

// 1. Upload Media
export async function saveToLibrary(userId: string, file: File): Promise<boolean> {
    const formData = new FormData()
    formData.append("web_user_id", userId)
    formData.append("file", file)

    console.log(`[API] Uploading file for ${userId}: ${file.name} (${file.size} bytes)`)

    try {
        const res = await fetch(`${API_BASE_URL}`, {
            method: "POST",
            body: formData,
            // DO NOT set Content-Type header when using FormData; fetch does it automatically with boundary.
        })

        if (!res.ok) {
            const text = await res.text()
            console.error(`[API] Upload failed status: ${res.status} ${res.statusText}`, text)
            return false
        }

        const data = await res.json()
        if (!data.success) {
            console.error("[API] Upload API returned false success:", data)
            return false
        }
        console.log("[API] Upload successful")
        return true
    } catch (error) {
        console.error("[API] Error saving to library:", error)
        return false
    }
}

// 6. Delete Media
export async function removeFromLibrary(userId: string, id: string): Promise<boolean> {
    try {
        const res = await fetch(`${API_BASE_URL}/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ web_user_id: userId })
        })
        const data = await res.json()
        return data.success
    } catch (error) {
        console.error("[API] Error removing from library:", error)
        return false
    }
}

// 3. Rename Media
export async function renameLibraryItem(userId: string, id: string, newName: string): Promise<boolean> {
    try {
        const res = await fetch(`${API_BASE_URL}/${id}/rename`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                web_user_id: userId,
                new_name: newName
            })
        })
        const data = await res.json()
        return data.success
    } catch (error) {
        console.error("[API] Error renaming item:", error)
        return false
    }
}

// 4. Replace Media
export async function replaceLibraryItem(userId: string, id: string, file: File): Promise<boolean> {
    const formData = new FormData()
    formData.append("web_user_id", userId)
    formData.append("file", file)

    try {
        const res = await fetch(`${API_BASE_URL}/${id}/replace`, {
            method: "PATCH",
            body: formData,
        })
        const data = await res.json()
        return data.success
    } catch (error) {
        console.error("[API] Error replacing item:", error)
        return false
    }
}

// 5. Set as Logo/Image
export async function setLibraryItemIsLogo(userId: string, id: string, isLogo: boolean): Promise<boolean> {
    try {
        const res = await fetch(`${API_BASE_URL}/${id}/set-logo`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                web_user_id: userId,
                is_logo: isLogo
            })
        })
        const data = await res.json()
        return data.success
    } catch (error) {
        console.error("[API] Error setting logo status:", error)
        return false
    }
}

export async function setLibraryItemIsImage(userId: string, id: string, isImage: boolean): Promise<boolean> {
    try {
        const res = await fetch(`${API_BASE_URL}/${id}/set-image`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                web_user_id: userId,
                is_image: isImage
            })
        })
        const data = await res.json()
        return data.success
    } catch (error) {
        console.error("[API] Error setting image status:", error)
        return false
    }
}

export async function setLibraryItemType(userId: string, id: string, type: LibraryItem["type"]): Promise<boolean> {
    // To switch types, we explicitely set the target flag to true and the other to false
    // to match the user's provided endpoints and ensure clean state.
    
    if (type === 'logo') {
        const [p1, p2] = await Promise.all([
            setLibraryItemIsLogo(userId, id, true),
            setLibraryItemIsImage(userId, id, false)
        ])
        return p1 // Return true if at least the primary action succeeded
    } else {
        // Type is 'image'
        const [p1, p2] = await Promise.all([
            setLibraryItemIsLogo(userId, id, false),
            setLibraryItemIsImage(userId, id, true)
        ])
        return p1 // Return true if at least the primary action succeeded
    }
}

// Legacy support
export function clearLibrary(userId: string) {
    // No-op
}
