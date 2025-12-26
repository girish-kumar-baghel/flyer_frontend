"use client"

import React, { createContext, useContext, useRef } from "react"
import { FavoritesStore } from "./FavoritesStore"
import { AuthStore } from "./AuthStore"
import { FilterBarStore } from "./FilterBarStore"
import { CategoryStore } from "./CategoryStore"
import { FlyerFormStore } from "./FlyerFormStore"
import { CartStore } from "./CartStore"
import { FlyersStore } from "./flyersStore";
import bannerStore from "./BannerStore" // Import the banner store
import { LoadingStore } from "./LoadingStore" // Import the loading store

export class RootStore {
  flyersStore: FlyersStore = new FlyersStore()
  favoritesStore: FavoritesStore
  authStore: AuthStore
  filterBarStore: FilterBarStore
  categoryStore: CategoryStore
  flyerFormStore: FlyerFormStore
  cartStore: CartStore
  bannerStore = bannerStore // Add banner store
  loadingStore: LoadingStore // Add loading store

  constructor() {
    this.favoritesStore = new FavoritesStore()
    this.cartStore = new CartStore()
    this.filterBarStore = new FilterBarStore()
    this.categoryStore = new CategoryStore()
    this.flyerFormStore = new FlyerFormStore()
    this.loadingStore = new LoadingStore()

    // Create AuthStore and pass other stores for cleanup on logout
    this.authStore = new AuthStore(this.cartStore, this.favoritesStore)

    // Connect CategoryStore with FlyersStore
    this.categoryStore.setFlyersStore(this.flyersStore)
  }
}

// ✅ create context
const StoreContext = createContext<RootStore | null>(null)

// ✅ provider
export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const store = useRef(new RootStore()).current
  return (<StoreContext.Provider value={store}>{children}</StoreContext.Provider>)
}

// ✅ hook
export const useStore = () => {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error("useStore must be used inside StoreProvider")
  return ctx
}
