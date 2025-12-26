export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  [key: string]: any;
}

export interface CartResponse {
  success: boolean;
  data: {
    items: CartItem[];
    total_price: number;
    subtotal: number;
    user_id: string;
    [key: string]: any;
  };
  message?: string;
}

/**
 * Fetch cart data for a specific user
 * @param userId - The user ID to fetch cart for
 * @returns Promise<CartResponse> - Cart data response
 */
export async function fetchCartByUserId(userId: string): Promise<CartResponse> {
  try {
    const response = await fetch(`http://193.203.161.174:3007/api/cart/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch cart: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
}

/**
 * Fetch cart data with error handling
 * @param userId - The user ID to fetch cart for
 * @returns Promise<CartResponse | null> - Cart data or null if error
 */
export async function fetchCartSafe(userId: string): Promise<CartResponse | null> {
  try {
    return await fetchCartByUserId(userId);
  } catch (error) {
    console.error('Cart fetch failed:', error);
    return null;
  }
}
