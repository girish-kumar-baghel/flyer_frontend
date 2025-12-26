// "use client"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import AuthModal from "./auth-modal"
// import { User, Settings, Heart, ShoppingBag, LogOut, CreditCard, Download, Bell, ImageDown, ChartBarStacked, CircleDollarSign } from "lucide-react"
// import Link from "next/link"
// import { observer } from "mobx-react-lite"
// import { useStore } from "@/stores/StoreProvider"
// import { toast } from "sonner"
// import { cn } from "@/lib/utils"

// const UserMenu = observer(() => {
//   const { authStore } = useStore()
//   const [mounted, setMounted] = useState(false)

//   useEffect(() => {
//     setMounted(true)
//     // Check auth state on mount
//     const checkAuth = async () => {
//       try {
//         await authStore.updateUserFromAmplify()
//       } catch (error) {
//         console.error('Error checking auth state:', error)
//       }
//     }
//     checkAuth()
//   }, [authStore])

//   if (!mounted) {
//     return (
//       <Button className='h-7 w-14 sm:h-8 sm:w-18' disabled>...</Button>
//     )
//   }

//   if (!authStore.user) {
//     return (
//       <>
//         <Button 
//           className='h-7 w-14 sm:h-8 sm:w-18 hover:cursor-pointer' 
//           onClick={() => authStore.handleAuthModal()}
//         >
//           Sign In
//         </Button>
//         <AuthModal 
//           isOpen={authStore.authModal} 
//           onClose={() => authStore.handleAuthModal()} 
//         />
//       </>
//     )
//   }

//   const handleSignOut = async () => {
//     try {
//       await authStore.logout()
//       toast.success('Successfully signed out')
//     } catch (error) {
//       console.error('Error signing out:', error)
//       toast.error('Failed to sign out. Please try again.')
//     }

//   const getInitials = (name?: string) => {
//     if (!name) return "U"
//     return name
//       .split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase()
//   }


//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger className="flex items-center focus:outline-none focus-visible:outline-none">
//         <Button 
//           variant="ghost" 
//           className="relative h-5 w-5 sm:h-8 sm:w-8 rounded-full p-0 hover:!bg-transparent hover:cursor-pointer focus-visible:outline-none focus-visible:ring-0 focus:outline-none focus:ring-0"
//           aria-label="User menu"
//         >
//           <Avatar className="h-5 w-5 sm:h-8 sm:w-8">
//             <AvatarImage 
//               src={authStore.user.avatar || "/placeholder.svg"} 
//               alt={authStore.user.name || 'User'} 
//             />
//             <AvatarFallback className="bg-primary text-primary-foreground">
//               {getInitials(authStore.user.name)}
//             </AvatarFallback>
//           </Avatar>
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent className="w-56 bg-[#0f0f0f] border-0 shadow-lg" align="end" forceMount>
//         <DropdownMenuLabel className="font-normal">
//           <div className="flex flex-col gap-2">
//             <p className="text-sm font-medium leading-none text-popover-foreground">
//               {authStore.user.name}
//             </p>
//             <p className="text-xs leading-none text-muted-foreground">
//               {authStore.user.email}
//             </p>
//           </div>
//         </DropdownMenuLabel>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem asChild >
//           <Link href="/overview" >
//             <User className="h-4 w-4 " />
//             <span>Overview</span>
//           </Link>
//         </DropdownMenuItem>

//         <DropdownMenuItem asChild >
//           <Link href="/orders" >
//             <ShoppingBag className=" h-4 w-4" />
//             <span>My Orders</span>
//           </Link>
//         </DropdownMenuItem >
//         <DropdownMenuItem asChild>
//           <Link href="/favorites" >
//             <Heart className=" h-4 w-4" />
//             <span>Favorites</span>
//           </Link>
//         </DropdownMenuItem>
//         <DropdownMenuItem asChild>
//           <Link href="/downloads">
//             <Download className=" h-4 w-4" />
//             <span>Downloads</span>
//           </Link>
//         </DropdownMenuItem>
//         <DropdownMenuItem asChild>
//           <Link href="/notifications">
//             <Bell className=" h-4 w-4" />
//             <span>Notifications</span>
//           </Link>
//         </DropdownMenuItem>
//         <DropdownMenuItem asChild>
//           <Link href="/profile" >
//             <Settings className=" h-4 w-4" />
//             <span>Account Settings</span>
//           </Link>
//         </DropdownMenuItem>
//         <DropdownMenuItem asChild>
//           <Link href="/media" >
//             <ImageDown className=" h-4 w-4" />
//             <span>Media Library</span>
//           </Link>
//         </DropdownMenuItem>
//         <DropdownMenuItem asChild className="sm:hidden">
//           <Link href="/categories" >
//             <ChartBarStacked className=" h-4 w-4" />
//             <span>Category</span>
//           </Link>
//         </DropdownMenuItem>
//         <DropdownMenuItem asChild className="sm:hidden">
//           <Link href="/pricing">
//             <CircleDollarSign className=" h-4 w-4" />
//             <span>Pricing</span>
//           </Link>
//         </DropdownMenuItem>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem onClick={handleSignOut} asChild className="cursor-pointer">
//           <div>
//             <LogOut className="mr-2 h-4 w-4" />
//             <span>Sign out</span>
//           </div>
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
// }

// export default UserMenu
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import AuthModal from "./auth-modal"
import { User, Settings, Heart, ShoppingBag, LogOut, CreditCard, Download, Bell, ImageDown, ChartBarStacked, CircleDollarSign } from "lucide-react"
import Link from "next/link"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores/StoreProvider"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const UserMenu = () => {
  const { authStore } = useStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check auth state on mount
    const checkAuth = async () => {
      try {
        await authStore.updateUserFromAmplify()
      } catch (error) {
        console.error('Error checking auth state:', error)
      }
    }
    checkAuth()
  }, [authStore])

  if (!mounted) {
    return (
      <Button className='h-7 w-14 sm:h-8 sm:w-18' disabled>...</Button>
    )
  }

  if (!authStore.user) {
    return (
      <>
        <Button 
          className='h-7 w-14 sm:h-8 sm:w-18 hover:cursor-pointer' 
          onClick={() => authStore.handleAuthModal()}
        >
          Sign In
        </Button>
        <AuthModal 
          isOpen={authStore.authModal} 
          onClose={() => authStore.handleAuthModal()} 
        />
      </>
    )
  }

  const handleSignOut = async () => {
    try {
      await authStore.logout()
      toast.success('Successfully signed out')
    } catch (error) {
      console.error('Error signing out:', error)
      toast.error('Failed to sign out. Please try again.')
    }
  }

  const getInitials = (name?: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center focus:outline-none focus-visible:outline-none">
        <Button 
          variant="ghost" 
          className="relative h-5 w-5 sm:h-8 sm:w-8 rounded-full p-0 hover:!bg-transparent hover:cursor-pointer focus-visible:outline-none focus-visible:ring-0 focus:outline-none focus:ring-0"
          aria-label="User menu"
        >
          <Avatar className="h-5 w-5 sm:h-8 sm:w-8">
            <AvatarImage 
              src={authStore.user.avatar || "/placeholder.svg"} 
              alt={authStore.user.name || 'User'} 
            />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(authStore.user.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-[#0f0f0f] border-0 shadow-lg" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium leading-none text-popover-foreground">
              {authStore.user.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {authStore.user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/overview">
            <User className="h-4 w-4 mr-2" />
            <span>Overview</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/orders">
            <ShoppingBag className="h-4 w-4 mr-2" />
            <span>My Orders</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/favorites">
            <Heart className="h-4 w-4 mr-2" />
            <span>Favorites</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/downloads">
            <Download className="h-4 w-4 mr-2" />
            <span>Downloads</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/notifications">
            <Bell className="h-4 w-4 mr-2" />
            <span>Notifications</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <Settings className="h-4 w-4 mr-2" />
            <span>Account Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/media">
            <ImageDown className="h-4 w-4 mr-2" />
            <span>Media Library</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="sm:hidden">
          <Link href="/categories">
            <ChartBarStacked className="h-4 w-4 mr-2" />
            <span>Category</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="sm:hidden">
          <Link href="/pricing">
            <CircleDollarSign className="h-4 w-4 mr-2" />
            <span>Pricing</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          <LogOut className="h-4 w-4 mr-2" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default observer(UserMenu)
