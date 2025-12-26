import { makeAutoObservable } from "mobx"
import { SAMPLE_FLYERS, FLYER_CATEGORIES } from "@/lib/types"

export type Flyer = {
    id: string
    name: string
    category: string
    price: number
    priceType: "basic" | "regular" | "premium"
    hasPhotos: boolean
    imageUrl: string
    tags: string[]
    isRecentlyAdded?: boolean
    isFeatured?: boolean
}

export class CategoryStore {
    flyers: any[] = []
    category: string = ''
    flyersStore: any = null // Reference to flyersStore

    categories: { id: number; name: string; rank: number }[] = []
    isLoading: boolean = false

    constructor() {
        makeAutoObservable(this)
    }

    async fetchCategories() {
        this.isLoading = true;
        try {
            const res = await fetch('http://193.203.161.174:3007/api/categories');
            const data = await res.json();
            if (data.success && Array.isArray(data.categories)) {
                // Sort by rank ascending (1, 2, 3...)
                this.categories = data.categories.sort((a: any, b: any) => a.rank - b.rank);
            }
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        } finally {
            this.isLoading = false;
        }
    }

    // Set reference to flyersStore
    setFlyersStore(store: any) {
        this.flyersStore = store
    }

    // Get all flyers from flyersStore or fallback to SAMPLE_FLYERS
    get allFlyers() {
        return this.flyersStore?.flyers?.length > 0
            ? this.flyersStore.flyers
            : SAMPLE_FLYERS
    }

    // set initial flyer 
    setFlyer(cat: string) {
        const allFlyers = this.allFlyers

        if (cat == 'Recently Added' || cat == 'recently-added') {
            this.flyers = allFlyers.filter((fly: any) => fly.isRecentlyAdded || fly.recently_added || fly.recentlyAdded)
            this.category = 'Recently Added'
        } else if (cat == 'premium-flyers' || cat == 'Premium Flyers') {
            this.category = 'Premium Flyers'
            this.flyers = allFlyers.filter((fly: any) => {
                const price = typeof fly.price === 'string' ? parseFloat(fly.price.replace('$', '')) : fly.price
                return price === 40
            })
        } else if (cat == 'basic-flyers' || cat == 'Basic Flyers') {
            this.category = 'Basic Flyers'
            this.flyers = allFlyers.filter((fly: any) => {
                const price = typeof fly.price === 'string' ? parseFloat(fly.price.replace('$', '')) : fly.price
                return price === 10
            })
        } else {
            // For other categories, check if flyer has this category in its categories array
            const categoryName = FLYER_CATEGORIES.find(categ => categ.slug == cat)?.name || cat
            this.category = categoryName

            this.flyers = allFlyers.filter((fly: any) => {
                // Check if flyer has categories array (API format)
                if (Array.isArray(fly.categories)) {
                    return fly.categories.includes(categoryName)
                }
                // Fallback to old format
                return fly.category === categoryName
            })
        }
    }


    // handle filter 
    setFlyerByFilter(val: string[]) {
        const allFlyers = this.allFlyers

        // Start from flyers of the currently selected category
        let filteredFlyers = this.flyers;

        if (val.length === 0) {
            // No filters selected, show all flyers in current category
            filteredFlyers = this.getFlyersByCategory(this.category);
        } else {
            // Filter current category flyers based on selected price
            filteredFlyers = this.getFlyersByCategory(this.category)
                .filter((flyer: any) => {
                    const price = typeof flyer.price === 'string' ? parseFloat(flyer.price.replace('$', '')) : flyer.price

                    // Map price to priceType
                    let priceType = 'regular'
                    if (price === 10) priceType = 'basic'
                    else if (price === 40) priceType = 'premium'
                    else if (price === 15) priceType = 'regular'

                    return val.includes(priceType)
                });
        }

        this.flyers = filteredFlyers;
    }


    // get flyers according to category
    getFlyersByCategory(cat: string) {
        const allFlyers = this.allFlyers

        if (cat === 'Recently Added' || cat === 'recently-added') {
            return allFlyers.filter((fly: any) => fly.isRecentlyAdded || fly.recently_added || fly.recentlyAdded);
        } else if (cat === 'premium-flyers' || cat === 'Premium Flyers') {
            return allFlyers.filter((fly: any) => {
                const price = typeof fly.price === 'string' ? parseFloat(fly.price.replace('$', '')) : fly.price
                return price === 40
            });
        } else if (cat === 'basic-flyers' || cat === 'Basic Flyers') {
            return allFlyers.filter((fly: any) => {
                const price = typeof fly.price === 'string' ? parseFloat(fly.price.replace('$', '')) : fly.price
                return price === 10
            });
        } else {
            const catName = FLYER_CATEGORIES.find(c => c.slug === cat)?.name || cat;
            return allFlyers.filter((fly: any) => {
                // Check if flyer has categories array (API format)
                if (Array.isArray(fly.categories)) {
                    return fly.categories.includes(catName)
                }
                // Fallback to old format
                return fly.category === catName
            });
        }
    }

    // Search flyers by query
    searchFlyers(query: string) {
        const allFlyers = this.allFlyers
        const searchLower = query.toLowerCase().trim()

        if (!searchLower) {
            this.flyers = allFlyers
            this.category = 'All Flyers'
            return
        }

        console.log("🔍 Searching flyers for:", searchLower)

        this.flyers = allFlyers.filter((fly: any) => {
            // Search in name
            const nameMatch = fly.name?.toLowerCase().includes(searchLower)

            // Search in title
            const titleMatch = fly.title?.toLowerCase().includes(searchLower)

            // Search in categories
            const categoryMatch = Array.isArray(fly.categories)
                ? fly.categories.some((cat: string) => cat.toLowerCase().includes(searchLower))
                : fly.category?.toLowerCase().includes(searchLower)

            // Search in tags
            const tagsMatch = Array.isArray(fly.tags)
                ? fly.tags.some((tag: string) => tag.toLowerCase().includes(searchLower))
                : false

            return nameMatch || titleMatch || categoryMatch || tagsMatch
        })

        this.category = `Search Results for "${query}"`
        console.log("✅ Found", this.flyers.length, "flyers")
    }



}
