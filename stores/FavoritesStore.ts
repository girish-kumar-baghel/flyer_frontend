import { makeAutoObservable, runInAction } from "mobx"
import { getApiUrl } from "@/config/api"

export interface FavoriteFlyer {
  id: number
  title: string
  price: string
  form_type: string
  recently_added: number
  categories: string[]
  image_url: string
  file_name_original: string | null
  created_at: string
  recentlyAdded: boolean
}

export interface FavoritesResponse {
  success: boolean
  count: number
  favorites: FavoriteFlyer[]
}

export class FavoritesStore {
  favorites: string[] = [] // Array of flyer IDs (for quick lookup)
  favoritesData: FavoriteFlyer[] = [] // Full flyer data from backend
  loading = false
  error: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  // Add flyer to favorites
  async addToFavorites(userId: string, flyerId: number) {
    if (!userId) {
      throw new Error("User ID is required")
    }

    try {
      const response = await fetch(getApiUrl("/api/favorites/add"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          flyer_id: flyerId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        runInAction(() => {
          // Add to local favorites array
          if (!this.favorites.includes(String(flyerId))) {
            this.favorites.push(String(flyerId))
          }
        })
        console.log("✅ Added to favorites:", flyerId)
        return { success: true, message: data.message }
      } else {
        throw new Error(data.message || "Failed to add to favorites")
      }
    } catch (error: any) {
      console.error("❌ Error adding to favorites:", error)
      runInAction(() => {
        this.error = error.message
      })
      throw error
    }
  }

  // Remove flyer from favorites
  async removeFromFavorites(userId: string, flyerId: number) {
    if (!userId) {
      throw new Error("User ID is required")
    }

    try {
      const response = await fetch(getApiUrl(`/api/favorites/remove`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          flyer_id: flyerId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        runInAction(() => {
          // Remove from local favorites array
          this.favorites = this.favorites.filter(id => id !== String(flyerId))
          this.favoritesData = this.favoritesData.filter(f => f.id !== flyerId)
        })
        console.log("✅ Removed from favorites:", flyerId)
        return { success: true, message: data.message }
      } else {
        throw new Error(data.message || "Failed to remove from favorites")
      }
    } catch (error: any) {
      console.error("❌ Error removing from favorites:", error)
      runInAction(() => {
        this.error = error.message
      })
      throw error
    }
  }

  // Fetch user's favorites from backend
  async fetchFavorites(userId: string) {
    if (!userId) {
      console.warn("⚠️ No user ID provided, skipping favorites fetch")
      return
    }

    this.loading = true
    this.error = null

    try {
      const response = await fetch(getApiUrl(`/api/favorites/user/${userId}`), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data: FavoritesResponse = await response.json()

      if (data.success) {
        runInAction(() => {
          this.favoritesData = data.favorites
          this.favorites = data.favorites.map(f => String(f.id))
          this.loading = false
        })
        console.log(`✅ Fetched ${data.count} favorites for user:`, userId)
      } else {
        throw new Error("Failed to fetch favorites")
      }
    } catch (error: any) {
      console.error("❌ Error fetching favorites:", error)
      runInAction(() => {
        this.error = error.message
        this.loading = false
        this.favoritesData = []
        this.favorites = []
      })
    }
  }

  // Toggle favorite (add or remove)
  async toggleFavorite(userId: string, flyerId: number) {
    const isFavorited = this.favorites.includes(String(flyerId))

    if (isFavorited) {
      await this.removeFromFavorites(userId, flyerId)
    } else {
      await this.addToFavorites(userId, flyerId)
    }
  }

  // Check if a flyer is favorited
  isFavorited(flyerId: number | string): boolean {
    return this.favorites.includes(String(flyerId))
  }

  // Clear all favorites (local only)
  clearLocalFavorites() {
    runInAction(() => {
      this.favorites = []
      this.favoritesData = []
    })
  }

  // Get favorites count
  get count() {
    return this.favorites.length
  }

  // Legacy method for backward compatibility
  handleFavorites(id: string) {
    console.warn("⚠️ handleFavorites is deprecated. Use toggleFavorite instead.")
    if (!this.favorites.includes(id)) {
      this.favorites.push(id)
    } else {
      this.favorites = this.favorites.filter(favId => favId !== id)
    }
  }
}
