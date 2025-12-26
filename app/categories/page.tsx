'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FLYER_CATEGORIES, SAMPLE_FLYERS } from "@/lib/types"
import Link from "next/link"
import FilterBar from "@/components/categories/FilterBar"
import FlyersSection from "@/components/home/FlyersSection"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores/StoreProvider"
import { toJS } from "mobx"
import { useEffect, useState } from "react"
import FlyersCategorySection from "@/components/categories/FlyersCategorySection"
import { useSearchParams } from "next/navigation"



const CategoriesPage = () => {

  const searchParams = useSearchParams()
  const { authStore, filterBarStore, categoryStore, flyersStore, favoritesStore } = useStore()
  const [filter, setFilter] = useState({
    price: [],
    category: '',
    type: ''
  })
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch flyers from API on mount
  useEffect(() => {
    if (!flyersStore.flyers.length && !flyersStore.loading) {
      flyersStore.fetchFlyers()
    }
  }, [flyersStore])

  // Fetch favorites on mount if user is logged in
  useEffect(() => {
    if (authStore.user?.id) {
      console.log("📂 Categories page: Fetching favorites for user:", authStore.user.id)
      favoritesStore.fetchFavorites(authStore.user.id)
    }
  }, [authStore.user?.id, favoritesStore])

  // Handle search query from URL
  useEffect(() => {
    const search = searchParams.get('search')
    if (search) {
      console.log("🔍 Search query:", search)
      setSearchQuery(search)
      categoryStore.searchFlyers(search)
    } else {
      setSearchQuery('')
      const value = searchParams.get('slug')
      if (searchParams.size == 0) {
        categoryStore.setFlyer('Recently Added')
      } else {
        categoryStore.setFlyer(value ? value : '')
      }
    }
  }, [searchParams, flyersStore.flyers]) // Re-run when flyers are loaded



  return (
    <section className="min-h-[150vh] bg-background sm:grid sm:grid-cols-11">
      {/* filter bar  */}
      <div className="hidden sm:flex col-span-2 sticky top-16 h-screen bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 z-50 shadow-lg">
        <FilterBar />
      </div>

      {/* carousel bar  */}
      <div className="col-span-9 ">
        {/* Featured Flyers */}
        <FlyersCategorySection />
      </div>
    </section>
  )
}


export default observer(CategoriesPage)
