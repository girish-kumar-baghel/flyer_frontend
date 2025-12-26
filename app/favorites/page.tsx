"use client"

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HeartOff, Heart } from "lucide-react"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores/StoreProvider"
import { toast } from "sonner"

const FavoritesPage = () => {
  const router = useRouter()
  const { authStore, favoritesStore } = useStore()

  // Use authStore.user instead of useAuth() to work with AWS Cognito
  const user = authStore.user

  // Fetch favorites when user is logged in
  useEffect(() => {
    if (user?.id) {
      console.log("📊 Fetching favorites for user:", user.id)
      favoritesStore.fetchFavorites(user.id)
    }
  }, [user?.id, favoritesStore])

  const handleRemoveFavorite = async (flyerId: number) => {
    if (!user) return

    try {
      await favoritesStore.removeFromFavorites(user.id, flyerId)
      toast.success("Removed from favorites")
    } catch (error: any) {
      toast.error(error.message || "Failed to remove from favorites")
    }
  }

  const handleClearAll = async () => {
    if (!user) return

    try {
      // Remove all favorites one by one
      const favoriteIds = [...favoritesStore.favoritesData.map(f => f.id)]

      for (const flyerId of favoriteIds) {
        await favoritesStore.removeFromFavorites(user.id, flyerId)
      }

      toast.success("All favorites cleared")
    } catch (error: any) {
      toast.error(error.message || "Failed to clear favorites")
    }
  }

  const handleFlyerClick = (flyerId: number, imageUrl: string, title: string, price: string) => {
    router.push(`/flyer/${flyerId}?image=${encodeURIComponent(imageUrl)}&name=${encodeURIComponent(title)}&price=${price}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-xl md:text-2xl font-bold text-foreground mb-2">Your Favorites</h1>
          <p className="text-sm text-muted-foreground">Save flyer templates you love and reorder them anytime.</p>
        </div>

        {/* Loading state */}
        {favoritesStore.loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="bg-card border-border h-64 animate-pulse" />
            ))}
          </div>
        )}

        {/* Not signed in */}
        {!favoritesStore.loading && !user && (
          <div className="max-w-xl mx-auto">
            <Card className="bg-card border-border">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-semibold text-card-foreground mb-2">Sign in to view favorites</h3>
                <p className="text-muted-foreground mb-6">
                  Create an account or sign in to save flyer templates to your favorites and access them across devices.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Button onClick={() => authStore.handleAuthModal()} className="px-6">
                    Sign In
                  </Button>
                  <Link href="/">
                    <Button variant="outline" className="bg-transparent px-6">
                      Browse Templates
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty state */}
        {!favoritesStore.loading && user && favoritesStore.favoritesData.length === 0 && (
          <div className="max-w-xl mx-auto">
            <Card className="bg-card border-border">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
                  <HeartOff className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-card-foreground mb-2">No favorites yet</h3>
                <p className="text-muted-foreground mb-6">
                  Explore our collection and tap the heart icon on a flyer to save it here.
                </p>
                <Link href="/categories">
                  <Button className="px-6">Find Flyers</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Favorites grid */}
        {!favoritesStore.loading && user && favoritesStore.favoritesData.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground">
                {favoritesStore.count} {favoritesStore.count === 1 ? "template" : "templates"} saved
              </span>
              <Button
                variant="outline"
                size="sm"
                className="hover:!bg-primary hover:!text-white"
                onClick={handleClearAll}
              >
                Clear All
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {favoritesStore.favoritesData.map((flyer) => (
                <div
                  key={flyer.id}
                  className="relative group cursor-pointer"
                  onClick={() => handleFlyerClick(flyer.id, flyer.image_url, flyer.title, flyer.price)}
                >
                  {/* Flyer Card */}
                  <div className="bg-card border rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20">
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <Image
                        src={flyer.image_url || "/placeholder.svg"}
                        alt={flyer.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-102"
                      />

                      {/* Remove Favorite Button */}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-2 right-2 bg-black/20 hover:bg-black/40 z-30"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveFavorite(flyer.id)
                        }}
                      >
                        <Heart className="w-6 h-6 fill-primary text-primary" />
                      </Button>

                      {/* Price Badge */}
                      <div className="absolute bottom-2 right-2 z-30">
                        <Badge className="bg-primary/80 border-primary/20 shadow-[0_0_10px_3px_rgba(0,0,0,0.6)]">
                          {flyer.price}
                        </Badge>
                      </div>

                      {/* Premium Ribbon */}
                      {flyer.price === "$40" && (
                        <div className="absolute top-0 left-0 w-32 h-32 overflow-hidden pointer-events-none z-20">
                          <div
                            style={{ left: "-35px", top: "11px" }}
                            className="absolute w-[120px] bg-[#FFB700] text-black text-[10px] font-bold text-center shadow-md transform -rotate-45 z-20 py-1 uppercase tracking-wider border-y border-white/20"
                          >
                            Premium
                          </div>
                        </div>
                      )}

                      {/* Photo Ribbon */}
                      {flyer.form_type === "With Photo" && (
                        <div className="absolute top-0 left-0 w-32 h-32 overflow-hidden pointer-events-none z-10">
                          <div
                            className={`absolute w-[120px] text-white text-[9px] font-bold text-center shadow-md transform -rotate-45 z-10 py-0.5 uppercase tracking-wider border-y border-white/20 ${flyer.price === "$40"
                              ? 'top-[27px] -left-[21px] bg-[#D32F2F]'
                              : 'top-[22px] -left-[30px] bg-[#D32F2F]'
                              }`}
                          >
                            PHOTO
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Flyer Title (Optional) */}
                    <div className="p-2 text-center">
                      <p className="text-sm font-medium text-foreground truncate">{flyer.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default observer(FavoritesPage)
