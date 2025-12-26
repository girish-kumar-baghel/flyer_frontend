// stores/BannerStore.ts
import { makeAutoObservable, runInAction } from "mobx"
import { getApiUrl } from "@/config/api"


// banner store
export type Banner = {
  id: number
  title: string
  description: string | null
  button_text: string | null
  button_enabled: boolean
  link_type: 'category' | 'flyer' | 'external' | 'none'
  link_value: string | null
  display_order: number
  image: string
  image_url: string
  status: boolean
  created_at: string
  updated_at: string
}

export class BannerStore {
  banners: Banner[] = []
  loading = false
  error: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  // Fetch all banners
  async fetchBanners() {
    this.loading = true
    this.error = null

    try {
      const response = await fetch(`${getApiUrl()}/api/banners`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        runInAction(() => {
          this.banners = data.data
          console.log('📢 Banners loaded:', data.data)
        })
      } else {
        throw new Error(data.message || 'Failed to fetch banners')
      }
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'An unknown error occurred'
        console.error('Error fetching banners:', error)
      })
    } finally {
      runInAction(() => {
        this.loading = false
      })
    }
  }

  // Get banner by ID
  getBannerById(id: number): Banner | undefined {
    return this.banners.find(banner => banner.id === id)
  }

  // Get active banners (status is boolean now)
  get activeBanners(): Banner[] {
    return this.banners.filter(banner => banner.status === true)
  }

  // Generate link based on link_type and link_value
  getBannerLink(banner: Banner): string | null {
    if (banner.link_type === 'none' || !banner.link_value) {
      return null
    }

    switch (banner.link_type) {
      case 'category':
        // Convert category name to slug
        const categorySlug = banner.link_value.toLowerCase().replace(/\s+/g, '-')
        return `/categories?slug=${categorySlug}`

      case 'flyer':
        return `/flyer/${banner.link_value}`

      case 'external':
        return banner.link_value

      default:
        return null
    }
  }
}

// Create a singleton instance
const bannerStore = new BannerStore()
export default bannerStore