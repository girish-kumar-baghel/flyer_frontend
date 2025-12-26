// import { makeAutoObservable } from "mobx"

// export class CartStore {
//     cart: string[] = []

//     constructor() {
//         makeAutoObservable(this)
//     }

//     addToCart(id: string) {
//         if (!this.cart.includes(id)) {
//             this.cart.push(id)
//         }
//     }

//     removeFromCart(id: string) {
//         this.cart = this.cart.filter(itemId => itemId !== id)
//     }

//     clearCart() {
//         this.cart = []
//     }
// }





// import { makeAutoObservable } from "mobx"
// import { getApiUrl } from "@/config/api"


// export class CartStore {
//     cart: string[] = []
//     // cartfly: string[] = []




//     constructor() {
//         makeAutoObservable(this)
//     }

//     async addToCart(id: string, userId: string, formData?: any) {
//         if (!userId) {
//             throw new Error("User ID is required to add items to the cart.")
//         }

//         console.log("🛒 addToCart called")

//         // 1) Add to local cart
//         if (!this.cart.includes(id)) {
//             this.cart.push(id)
//         }

//         // 2) Prepare API values here
//         const payload = {
//             user_id: userId,
//             flyer_id: id,
//             event_title: formData.event_title,
//             event_date: formData.event_date,
//             image_url: formData.image_url,         // id IS flyer_id
//             form_data: formData ?? null
//         }

//         console.log("📦 Saving to server:", payload)

//         try {
//             // const res = await fetch(`http://193.203.161.174:3007/api/cart/add`, {
//             const res = await fetch(getApiUrl("/api/cart/add"), {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify(payload)
//             })

//             const data = await res.json()
//             console.log("🟢 Cart saved:", data)

//         } catch (err) {
//             console.error("❌ Cart save error:", err)
//         }
//     }



//     // Load cart for user
//     async load(userId: string) {
//         // alert("Loading cart for user: " + userId);
//         if (!userId) return

//         try {
//             const res = await fetch(getApiUrl(`/api/cart/${userId}`))
//             const data = await res.json()

//             if (data.success) {
//                 // Save full flyer objects
//                 this.cart = data.cart
//             }
//         } catch (err) {
//             console.error("❌ Cart load error:", err)
//         }
//     }   


//     removeFromCart(id: string) {
//         this.cart = this.cart.filter(itemId => itemId !== id)
//     }

//     clearCart() {
//         this.cart = []
//     }
//      get count() {
//     return this.cart?.length ?? 7
//   }
// }



// stores/CartStore.ts
import { makeAutoObservable } from "mobx"
import { getApiUrl } from "@/config/api"

export interface DJ {
  name: string;
  image: string;
}

export interface Host {
  name: string;
  image: string;
}

export interface Sponsor {
  name: string | null;
  image: string | null;
}

export interface CartItem {
  id: number;
  user_id: string;
  flyer_is: number;
  added_time: string;
  status?: string;
  presenting: string;
  event_title: string;
  image_url: string | null;
  event_date: string;
  address_and_phone: string;
  delivery_time: string;
  amount?: string;
  venue_logo?: string | null;
  djs: DJ[];
  host: Host;
  sponsors: Sponsor[];
  flyer_info: string;
  custom_notes: string;
  email: string | null;
  story_size_version: number | boolean;
  custom_flyer: number | boolean;
  animated_flyer: number | boolean;
  instagram_post_size: number | boolean;
  total_price: string | number;
  flyer?: {
    id: number;
    title: string;
    price: number;
    image: string;
    type: string;
    categories: string[];
  };
}


export interface CartResponse {
  success: boolean;
  count: number;
  cart: CartItem[];
}

export interface AddToCartData {
  presenting: string;
  event_title: string;
  event_date: string;
  flyer_info: string;
  address_phone: string;
  story_size_version: string;
  custom_flyer: string;
  animated_flyer: string;
  instagram_post_size: string;
  custom_notes: string;
  flyer_is: string;
  category_id: string;
  user_id: string;
  delivery_time: string;
  total_price: string;
  subtotal: string;
  image_url?: string;
  venue_logo?: File;
  host_file?: File;
  dj_0?: File;
  dj_1?: File;
  sponsor_0?: File;
  sponsor_1?: File;
  sponsor_2?: File;
  djs: string;
  host: string;
  sponsors: string;
  web_user_id?: string;
  " total_price"?: string;
}

export class CartStore {
  cartItems: CartItem[] = [];
  isLoading = false;
  error: string | null = null;
  isAdding = false;
  addError: string | null = null;

  constructor() {
    makeAutoObservable(this)
  }

  // Load cart for user from API
  async load(userId: string) {
    if (!userId) return

    this.isLoading = true
    this.error = null

    try {
      const response = await fetch(getApiUrl(`/api/cart/${userId}`))
      const data: CartResponse = await response.json()

      console.log('Raw API response:', data)

      if (data.success && Array.isArray(data.cart)) {
        this.cartItems = data.cart
        console.log('Cart loaded successfully:', data.cart.length, 'items')
      } else {
        this.cartItems = []
        console.log('No cart items found or invalid response:', data)
      }
    } catch (err) {
      console.error("Cart load error:", err)
      this.error = "Failed to load cart"
      this.cartItems = []
    } finally {
      this.isLoading = false
    }
  }

  // Add item to cart with FormData
  async addToCart(formData: FormData) {
    this.isAdding = true
    this.addError = null

    try {
      const response = await fetch(getApiUrl('/api/cart/add'), {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (response.ok) {
        console.log('Item added to cart successfully:', data)

        // Reload cart to get updated items
        const userId = formData.get('user_id') as string
        if (userId) {
          await this.load(userId)
        }

        return { success: true, data }
      } else {
        throw new Error(data.message || 'Failed to add item to cart')
      }
    } catch (err) {
      console.error("Add to cart error:", err)
      this.addError = err instanceof Error ? err.message : 'Failed to add item to cart'
      throw err
    } finally {
      this.isAdding = false
    }
  }

  // Remove item from cart (API call needed)
  async removeFromCart(itemId: number, userId: string) {
    if (!userId) return

    try {
      // You'll need to implement the remove endpoint
      const response = await fetch(getApiUrl(`/api/cart/remove/${itemId}`), {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId })
      })

      if (response.ok) {
        this.cartItems = this.cartItems.filter(item => item.id !== itemId)
        console.log('Item removed from cart:', itemId)
      }
    } catch (err) {
      console.error("Failed to remove item from cart:", err)
      this.error = "Failed to remove item from cart"
    }
  }

  // Clear entire cart
  async clearCart(userId: string) {
    if (!userId) return

    try {
      // You'll need to implement the clear endpoint
      const response = await fetch(getApiUrl(`/api/cart/clear/${userId}`), {
        method: "DELETE"
      })

      if (response.ok) {
        this.cartItems = []
        console.log('Cart cleared successfully')
      }
    } catch (err) {
      console.error("Failed to clear cart:", err)
      this.error = "Failed to clear cart"
    }
  }

  // Get total items count
  get count() {
    console.log('CartStore.count called, cartItems.length:', this.cartItems.length)
    console.log('CartStore.cartItems:', this.cartItems)
    return this.cartItems.length
  }

  // Get total price (convert string to number)
  get totalPrice() {
    return this.cartItems.reduce((sum, item) => {
      const price = parseFloat(String(item.total_price)) || 0
      return sum + price
    }, 0)
  }

  // Get formatted total price
  get formattedTotalPrice() {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(this.totalPrice)
  }

  // Check if cart is empty
  get isEmpty() {
    return this.cartItems.length === 0
  }

  // Get item by ID
  getItemById(itemId: number) {
    return this.cartItems.find(item => item.id === itemId)
  }

  // Get items grouped by status
  get itemsByStatus() {
    const grouped: Record<string, CartItem[]> = {}
    this.cartItems.forEach(item => {
      const status = item.status || 'pending'
      if (!grouped[status]) {
        grouped[status] = []
      }
      grouped[status].push(item)
    })
    return grouped
  }
}
