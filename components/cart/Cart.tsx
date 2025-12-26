"use client"

import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/stores/StoreProvider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, ShoppingCart, Trash2, Calendar, MapPin, Clock, Users, Music, User, DollarSign, Image as ImageIcon } from 'lucide-react'
import { CartItem } from '@/stores/CartStore'

const Cart = observer(() => {
  const { cartStore, authStore } = useStore()

  useEffect(() => {
    // Auto-load cart when user is logged in
    if (authStore.user?.id) {
      console.log('Loading cart for user:', authStore.user.id)
      cartStore.load(authStore.user.id)
    }
  }, [authStore.user?.id, cartStore])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(price) || 0)
  }

  const handleRemoveItem = (itemId: number) => {
    if (authStore.user?.id) {
      console.log('Removing item:', itemId, 'for user:', authStore.user.id)
      cartStore.removeFromCart(itemId, authStore.user.id)
    }
  }

  const handleClearCart = () => {
    if (authStore.user?.id) {
      console.log('Clearing cart for user:', authStore.user.id)
      cartStore.clearCart(authStore.user.id)
    }
  }

  const CartItemCard = ({ item }: { item: CartItem }) => (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="w-full md:w-48 h-48 bg-gray-100 relative">
            {item.flyer?.image || item.image_url ? (
              <img
                src={item.flyer?.image || item.image_url || ''}
                alt={item.flyer?.title || item.event_title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <ImageIcon className="w-12 h-12 text-gray-400" />
              </div>
            )}
            {item.status && (
              <Badge className="absolute top-2 right-2" variant="secondary">
                {item.status}
              </Badge>
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {item.event_title}
                </h3>
                {item.flyer && (
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      Template: {item.flyer.title}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {item.flyer.type}
                    </Badge>
                  </div>
                )}
                <p className="text-gray-600 flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {item.presenting}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">
                  {formatPrice(item.total_price)}
                </p>
                <p className="text-sm text-gray-500">Total Price</p>
              </div>
            </div>

            {/* Event Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(item.event_date)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{item.address_and_phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{item.delivery_time}</span>
              </div>
              {item.amount && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  <span>Amount: {formatPrice(item.amount)}</span>
                </div>
              )}
            </div>

            {/* DJs Section */}
            {item.djs && item.djs.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                  <Music className="w-4 h-4" />
                  DJs
                </p>
                <div className="flex gap-2">
                  {item.djs.map((dj, index) => (
                    <div key={index} className="flex items-center gap-1 text-sm">
                      {dj.image && (
                        <img
                          src={dj.image}
                          alt={dj.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      )}
                      <span>{dj.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Host Section */}
            {item.host && (
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                  <User className="w-4 h-4" />
                  Host
                </p>
                <div className="flex items-center gap-2 text-sm">
                  {item.host.image && (
                    <img
                      src={item.host.image}
                      alt={item.host.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  )}
                  <span>{item.host.name}</span>
                </div>
              </div>
            )}

            {/* Sponsors Section */}
            {item.sponsors && item.sponsors.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Sponsors</p>
                <div className="flex flex-wrap gap-2">
                  {item.sponsors.map((sponsor, index) => (
                    <div key={index} className="text-sm">
                      {sponsor.image ? (
                        <img
                          src={sponsor.image}
                          alt={sponsor.name || `Sponsor ${index + 1}`}
                          className="w-8 h-8 rounded object-cover"
                        />
                      ) : sponsor.name ? (
                        <span>{sponsor.name}</span>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Info */}
            {(item.flyer_info || item.custom_notes) && (
              <div className="border-t pt-3 mt-3">
                {item.flyer_info && (
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Info:</span> {item.flyer_info}
                  </p>
                )}
                {item.custom_notes && (
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Notes:</span> {item.custom_notes}
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-4 pt-3 border-t">
              <div className="flex gap-2">
                <Badge variant={item.story_size_version ? "default" : "secondary"}>
                  Story Size {item.story_size_version ? 'On' : 'Off'}
                </Badge>
                <Badge variant={item.custom_flyer ? "default" : "secondary"}>
                  Custom {item.custom_flyer ? 'On' : 'Off'}
                </Badge>
                <Badge variant={item.animated_flyer ? "default" : "secondary"}>
                  Animated {item.animated_flyer ? 'On' : 'Off'}
                </Badge>
                <Badge variant={item.instagram_post_size ? "default" : "secondary"}>
                  Instagram Post {item.instagram_post_size ? 'On' : 'Off'}
                </Badge>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleRemoveItem(item.id)}
                className="flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (!authStore.user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-gray-500">
              <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Please log in to view your cart</h3>
              <p>You need to be logged in to see your cart items.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (cartStore.isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="py-12">
            <div className="flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">Loading your cart...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (cartStore.error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="py-6">
            <div className="text-center text-red-700">
              <h3 className="text-lg font-semibold mb-2">Error Loading Cart</h3>
              <p>{cartStore.error}</p>
              <Button
                onClick={() => {
                  console.log('Retrying cart load for user:', authStore.user?.id)
                  cartStore.load(authStore.user!.id)
                }}
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (cartStore.isEmpty) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-gray-500">
              <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
              <p>Add some flyers to your cart to see them here.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Cart Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Your Cart ({cartStore.count} items)
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-green-600">
                  {cartStore.formattedTotalPrice}
                </p>
              </div>
              {cartStore.count > 0 && (
                <Button variant="outline" onClick={handleClearCart}>
                  Clear Cart
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Cart Items */}
      <div className="space-y-4">
        {cartStore.cartItems.map((item) => (
          <CartItemCard key={item.id} item={item} />
        ))}
      </div>

      {/* Cart Footer */}
      <Card>
        <CardContent className="py-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">
                {cartStore.count} {cartStore.count === 1 ? 'item' : 'items'} in cart
              </p>
              <p className="text-xs text-gray-500">
                Added on {formatDate(cartStore.cartItems[0]?.added_time || '')}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-3xl font-bold text-green-600">
                {cartStore.formattedTotalPrice}
              </p>
              <Button className="mt-2" size="lg">
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
})

export default Cart
