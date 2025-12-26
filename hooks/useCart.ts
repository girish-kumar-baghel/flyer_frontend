"use client"

import { useState, useEffect, useCallback } from 'react';
import { fetchCartByUserId, fetchCartSafe, CartResponse, CartItem } from '@/lib/api/cart';
import { useStore } from '@/stores/StoreProvider';

interface UseCartOptions {
  autoFetch?: boolean;
  userId?: string;
}

interface UseCartReturn {
  cart: CartResponse | null;
  items: CartItem[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  fetchCart: (userId: string) => Promise<void>;
  clearError: () => void;
}

export function useCart(options: UseCartOptions = {}): UseCartReturn {
  const { autoFetch = false, userId } = options;
  const { authStore } = useStore();
  
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async (userId: string) => {
    if (!userId) {
      setError('User ID is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const cartData = await fetchCartByUserId(userId);
      setCart(cartData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch cart';
      setError(errorMessage);
      console.error('Cart fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    const currentUserId = userId || authStore.user?.id;
    if (currentUserId) {
      await fetchCart(currentUserId);
    }
  }, [userId, authStore.user?.id, fetchCart]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-fetch on mount if userId is provided or user is logged in
  useEffect(() => {
    if (autoFetch) {
      const currentUserId = userId || authStore.user?.id;
      if (currentUserId) {
        fetchCart(currentUserId);
      }
    }
  }, [autoFetch, userId, authStore.user?.id, fetchCart]);

  return {
    cart,
    items: cart?.data?.items || [],
    loading,
    error,
    refetch,
    fetchCart,
    clearError,
  };
}

/**
 * Hook for fetching cart with safe error handling (returns null on error instead of throwing)
 */
export function useCartSafe(userId?: string) {
  const { authStore } = useStore();
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchCartSafeData = useCallback(async (userId: string) => {
    setLoading(true);
    try {
      const cartData = await fetchCartSafe(userId);
      setCart(cartData);
    } catch (err) {
      console.error('Safe cart fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const currentUserId = userId || authStore.user?.id;
    if (currentUserId) {
      fetchCartSafeData(currentUserId);
    }
  }, [userId, authStore.user?.id, fetchCartSafeData]);

  return {
    cart,
    items: cart?.data?.items || [],
    loading,
    refetch: () => {
      const currentUserId = userId || authStore.user?.id;
      if (currentUserId) fetchCartSafeData(currentUserId);
    },
  };
}

/**
 * Hook that automatically fetches cart for the currently logged-in user
 */
export function useCurrentUserCart() {
  const { authStore } = useStore();
  const userId = authStore.user?.id;
  
  return useCart({ 
    autoFetch: !!userId, 
    userId 
  });
}
