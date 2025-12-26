"use client"

import { useState } from 'react';
import { useCart, useCurrentUserCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ShoppingCart, AlertCircle, User, Package, DollarSign } from 'lucide-react';
import { useStore } from '@/stores/StoreProvider';

export default function CartTest() {
  const { authStore } = useStore();
  const [userId, setUserId] = useState('');
  const { cart, items, loading, error, fetchCart, clearError } = useCart();
  
  // Auto-fetch cart for logged-in user
  const userCart = useCurrentUserCart();

  const handleFetchCart = () => {
    if (userId.trim()) {
      fetchCart(userId.trim());
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Current User Info */}
      {authStore.user && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <User className="w-5 h-5" />
              Current User Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-semibold text-gray-600">Name:</span>
                <p className="text-gray-900">{authStore.user.name}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-600">Email:</span>
                <p className="text-gray-900">{authStore.user.email}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-600">User ID:</span>
                <p className="text-gray-900 font-mono text-xs break-all">{authStore.user.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Manual Cart Fetch */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Manual Cart Fetch
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter User ID to test"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="flex-1 font-mono text-sm"
            />
            <Button 
              onClick={handleFetchCart} 
              disabled={loading || !userId.trim()}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Fetch Cart'
              )}
            </Button>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-red-700 text-sm">{error}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearError}
                className="ml-auto"
              >
                Clear
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current User Cart */}
      {authStore.user && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <ShoppingCart className="w-5 h-5" />
              Your Cart (Auto-fetched)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userCart.loading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="ml-2">Loading your cart...</span>
              </div>
            )}

            {userCart.error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="text-red-700 text-sm">{userCart.error}</span>
              </div>
            )}

            {userCart.cart && (
              <div className="space-y-4">
                {/* Cart Summary */}
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Cart Summary
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 block">Total Items</span>
                      <span className="font-semibold text-lg">{userCart.items.length}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 block">Subtotal</span>
                      <span className="font-semibold text-lg text-green-700">
                        {formatPrice(userCart.cart.data?.subtotal || 0)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 block">Total Price</span>
                      <span className="font-semibold text-lg text-green-700">
                        {formatPrice(userCart.cart.data?.total_price || 0)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 block">User ID</span>
                      <span className="font-mono text-xs break-all">
                        {userCart.cart.data?.user_id?.slice(0, 8)}...
                      </span>
                    </div>
                  </div>
                </div>

                {/* Cart Items */}
                {userCart.items.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Cart Items ({userCart.items.length})
                    </h4>
                    <div className="grid gap-3">
                      {userCart.items.map((item, index) => (
                        <div key={item.id || index} className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <h5 className="font-semibold text-gray-900 mb-1">
                                {item.name || `Item ${index + 1}`}
                              </h5>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <span className="font-medium">Qty:</span>
                                  <span className="font-semibold">{item.quantity || 1}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <DollarSign className="w-3 h-3" />
                                  <span className="font-semibold">{formatPrice(item.price || 0)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="font-medium">Total:</span>
                                  <span className="font-semibold text-green-700">
                                    {formatPrice((item.price || 0) * (item.quantity || 1))}
                                  </span>
                                </div>
                              </div>
                              
                              {/* Additional item properties */}
                              {Object.entries(item)
                                .filter(([key]) => !['id', 'name', 'price', 'quantity', 'image_url'].includes(key))
                                .length > 0 && (
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                  <p className="text-xs font-semibold text-gray-500 mb-2">Additional Details:</p>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-xs">
                                    {Object.entries(item)
                                      .filter(([key]) => !['id', 'name', 'price', 'quantity', 'image_url'].includes(key))
                                      .map(([key, value]) => (
                                        <div key={key} className="flex gap-2">
                                          <span className="font-medium text-gray-600 capitalize">
                                            {key.replace(/_/g, '')}:
                                          </span>
                                          <span className="text-gray-800 break-all">
                                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                          </span>
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {item.image_url && (
                              <div className="flex-shrink-0">
                                <img 
                                  src={item.image_url} 
                                  alt={item.name}
                                  className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {userCart.items.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Your cart is empty</p>
                  </div>
                )}
              </div>
            )}

            {!userCart.cart && !userCart.loading && !userCart.error && (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No cart data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Manual Test Results */}
      {cart && !authStore.user && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Manual Test Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Test Cart Data</h3>
                <div className="text-sm space-y-1">
                  <p><strong>User ID:</strong> {cart.data?.user_id}</p>
                  <p><strong>Total Items:</strong> {items.length}</p>
                  <p><strong>Subtotal:</strong> {formatPrice(cart.data?.subtotal || 0)}</p>
                  <p><strong>Total Price:</strong> {formatPrice(cart.data?.total_price || 0)}</p>
                </div>
              </div>

              {items.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Test Items:</h4>
                  {items.map((item, index) => (
                    <div key={item.id || index} className="p-3 border rounded-lg bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{item.name || `Item ${index + 1}`}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          <p className="text-sm text-gray-600">Price: {formatPrice(item.price)}</p>
                        </div>
                        {item.image_url && (
                          <img 
                            src={item.image_url} 
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Not Logged In State */}
      {!authStore.user && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="text-center text-yellow-800">
              <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="font-semibold">Please log in to see your cart</p>
              <p className="text-sm text-yellow-700 mt-1">
                Or use the manual fetch above to test with a specific user ID
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
