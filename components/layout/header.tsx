"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import UserMenu from "@/components/auth/user-menu"
import { Search, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useStore } from "@/stores/StoreProvider";
import { observer } from "mobx-react-lite";
// const cartCount = useCartStore((state) => state.items.length)
// assume your store exposes something like: cartStore.items

// const cartCount =7;

export const Header = observer(() => {
  const router = useRouter()
  const { authStore, cartStore } = useStore()
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // const cart = CartStore((s) => s.cart);

  useEffect(() => {
    // Load cart for logged-in user only
    if (authStore.user?.id) {
      console.log('Header: Loading cart for user:', authStore.user.id)
      cartStore.load(authStore.user.id)
    }

    // Also try to load cart if user data becomes available later
    const checkUser = setInterval(() => {
      if (authStore.user?.id) {
        console.log('Header: Retrying cart load for user:', authStore.user.id)
        cartStore.load(authStore.user.id)
        clearInterval(checkUser)
      }
    }, 1000)

    // Cleanup interval after 10 seconds
    setTimeout(() => clearInterval(checkUser), 10000)

    return () => clearInterval(checkUser)
  }, [authStore.user?.id, cartStore])

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      console.log("🔍 Searching for:", searchQuery)
      // Navigate to categories page with search query
      router.push(`/categories?search=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false) // Close mobile search
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(e as any)
    }
  }

  // const cartCount = cartStore.count;

  // alert("Cart Count: " + JSON.stringify(cartCount));
  return (
    <header className="sticky top-0 z-[50] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-2 sm:px-4">
        <div className="flex items-center w-full justify-between h-14 md:h-16">
          {/* Logo */}

          {/* <Image src="/logo.png" height={10} alt="Logo" width={10} className="w-24 sm:w-32 md:w-36" /> */}
          {/* <Link href="/" className="flex items-center space-x-2">
            <Image src='/logo.png' alt="logo" width={10} height={1} className="w-32 h-20 object-contain block" />
          </Link> */}

          <Link
            href="/"
            className="inline-flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-110"
          >
            <Image
              src="/logo.png"
              alt="Grodify Logo"
              width={120}
              height={60}
              className="object-contain"
            />
          </Link>




          {/* Desktop Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
                placeholder="Search flyers..."
                className="pl-10 bg-card border-border text-input-text shadow-md
                focus-visible:!ring-0 focus-visible:!outline-none
                focus-visible:!shadow-[0_0_15px_rgba(185,32,37,0.8)]
                transition-all duration-300"
              />
            </form>
          </div>

          {/* Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/categories" className="text-foreground hover:text-primary transition-colors">
              Categories
            </Link>
            <Link href="/pricing" className="text-foreground hover:text-primary transition-colors">
              Pricing
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center md:space-x-5 gap-4 mr-1">
            {/* Mobile Search Icon */}
            <div
              className="sm:hidden cursor-pointer"
              onClick={() => setIsSearchOpen((prev) => !prev)}
            >
              <Search
                className={cn(
                  "h-5 w-5 transition-colors",
                  isSearchOpen ? "text-primary" : "text-foreground"
                )}
              />
            </div>

            {/* <div className="flex hover:bg-none cursor-pointer">
              <Link href={'/cart'}>
              
              <ShoppingCart className="w-5 h-5 sm:h-6 sm:w-6" />
                
    
              </Link>
            </div> */}
            <div className="relative cursor-pointer">
              <Link href="/cart">
                <ShoppingCart className="w-5 h-5 sm:h-6 sm:w-6" />
              </Link>

              {cartStore.count > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartStore.count}
                </span>
              )}

              {/* Show loading indicator when cart is being loaded */}
              {cartStore.isLoading && (
                <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  ...
                </span>
              )}
            </div>
            <div className="flex items-center">
              <UserMenu />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar (Dropdown style) */}
      <div
        className={cn(
          "sm:hidden sm:bg-background/95 backdrop-blur-md border-b border-border transition-all duration-300 overflow-hidden",
          isSearchOpen ? "max-h-20 opacity-100 px-3 pb-3 " : "max-h-0 opacity-0"
        )}
      >
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            placeholder="Search flyers..."
            className="pl-10 bg-card border-border text-input-text shadow-md
            focus-visible:!ring-0 focus-visible:!outline-none
            focus-visible:!shadow-[0_0_15px_rgba(185,32,37,0.8)]
            transition-all duration-300"
          />
        </form>
      </div>
    </header>
  )
})
