'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/stores/StoreProvider'
import { Button } from '@/components/ui/button'
import { TestTube, FlaskConical } from 'lucide-react'
import { toast } from 'sonner'

export default function TestOrderPage() {
  const router = useRouter()
  const { authStore, flyerFormStore } = useStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleQuickTest = async () => {
    if (!authStore.user?.id) {
      toast.error("Please sign in to create a test order.")
      authStore.handleAuthModal()
      return
    }

    // Refresh user data to get latest email
    await authStore.refreshUserData()

    setIsSubmitting(true)
    
    try {
      // Create a minimal test order matching Postman format
      const formData = new FormData()
      
      // Add basic fields
      formData.append('presenting', 'XYZ Events')
      formData.append('event_title', 'Summer Party 2025')
      formData.append('event_date', '2025-12-01')
      formData.append('flyer_info', 'Special flyer for summer party')
      formData.append('address_phone', '123 Main St, 555-1234')
      formData.append('djs', JSON.stringify([{ name: 'DJ Mike' }, { name: 'DJ Anna' }]))
      formData.append('host', JSON.stringify({ name: 'John Host' }))
      formData.append('sponsors', JSON.stringify([{}, {}, {}]))
      formData.append('story_size_version', 'true')
      formData.append('custom_flyer', 'false')
      formData.append('animated_flyer', 'true')
      formData.append('instagram_post_size', 'false')
      formData.append('delivery_time', '5 Hours')
      formData.append('custom_notes', 'Please make it colorful')
      formData.append('flyer_is', '1')
      
      // Add user information
      formData.append('web_user_id', authStore.user.id)
      formData.append('email', authStore.user.email || authStore.user.name || 'unknown@example.com')
      
      // Mark as test order
      formData.append('isTest', 'true')

      console.log("Sending quick test order:", {
        presenting: formData.get('presenting'),
        event_title: formData.get('event_title'),
        event_date: formData.get('event_date'),
        djs: formData.get('djs'),
        host: formData.get('host'),
        web_user_id: formData.get('web_user_id'),
        email: formData.get('email')
      })

      // Send test order
      const response = await fetch('/api/test-order', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.details?.message || error.message || 'Test order failed')
      }

      const result = await response.json()
      console.log("Test order response:", result)
      
      if (result.isTest) {
        toast.success('Test order validated successfully! (No real order created)')
        toast.info('Real orders are created only after Stripe payment')
      } else {
        toast.success('Test order created successfully!')
      }
      
      if (result.data?.id) {
        toast.success(`Test ID: ${result.data.id}`)
      }

    } catch (error: any) {
      console.error('Test order error:', error)
      toast.error(error.message || 'Test order failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTestWithFiles = async () => {
    if (!authStore.user?.id) {
      toast.error("Please sign in to create a test order.")
      authStore.handleAuthModal()
      return
    }

    setIsSubmitting(true)
    
    try {
      // Create a test order with mock files
      const formData = new FormData()
      
      // Add basic fields
      formData.append('presenting', 'Test Events')
      formData.append('event_title', 'Test Party with Files')
      formData.append('event_date', '2025-12-15')
      formData.append('flyer_info', 'Test flyer with file uploads')
      formData.append('address_phone', '456 Test Ave, 555-6789')
      formData.append('djs', JSON.stringify([{ name: 'Test DJ 1' }, { name: 'Test DJ 2' }]))
      formData.append('host', JSON.stringify({ name: 'Test Host' }))
      formData.append('sponsors', JSON.stringify([{}, {}, {}]))
      formData.append('story_size_version', 'false')
      formData.append('custom_flyer', 'true')
      formData.append('animated_flyer', 'false')
      formData.append('instagram_post_size', 'true')
      formData.append('delivery_time', '24 Hours')
      formData.append('custom_notes', 'Test with files')
      formData.append('flyer_is', '2')
      
      // Add user information
      formData.append('web_user_id', authStore.user.id)
      formData.append('email', authStore.user.email || authStore.user.name || 'unknown@example.com')
      
      // Mark as test order
      formData.append('isTest', 'true')

      // Create a mock image file
      const mockImage = new Blob(['test image content'], { type: 'image/jpeg' })
      const imageFile = new File([mockImage], 'test-image.jpg', { type: 'image/jpeg' })
      formData.append('image', imageFile)
      
      // Create mock venue logo
      const mockLogo = new Blob(['test logo content'], { type: 'image/png' })
      const logoFile = new File([mockLogo], 'test-logo.png', { type: 'image/png' })
      formData.append('venue_logo', logoFile)

      console.log("Sending test order with files:", {
        hasImage: formData.has('image'),
        hasVenueLogo: formData.has('venue_logo'),
        imageName: formData.get('image') instanceof File ? 'test-image.jpg' : 'Not a file',
        logoName: formData.get('venue_logo') instanceof File ? 'test-logo.png' : 'Not a file',
        web_user_id: formData.get('web_user_id'),
        email: formData.get('email')
      })

      // Send test order
      const response = await fetch('/api/test-order', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.details?.message || error.message || 'Test order with files failed')
      }

      const result = await response.json()
      console.log("Test order with files response:", result)
      
      if (result.isTest) {
        toast.success('Test order with files validated! (No real order created)')
        toast.info('Real orders are created only after Stripe payment')
      } else {
        toast.success('Test order with files created successfully!')
      }
      
      if (result.data?.id) {
        toast.success(`Test ID: ${result.data.id}`)
      }

    } catch (error: any) {
      console.error('Test order with files error:', error)
      toast.error(error.message || 'Test order with files failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Test Order Page</h1>
        
        <div className="space-y-8">
          {/* Quick Test Section */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Quick Test</h2>
            <p className="text-gray-400 mb-6">
              Validate your form data without creating a real order. This tests the data format and validation.
            </p>
            <p className="text-yellow-400 text-sm mb-6">
              ⚠️ Test orders do NOT create real orders. Real orders are created only after Stripe payment.
            </p>
            <Button
              onClick={handleQuickTest}
              disabled={isSubmitting}
              className="bg-yellow-500 hover:bg-yellow-600 text-black mr-4"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Testing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <TestTube className="w-4 h-4" />
                  Quick Test Order
                </span>
              )}
            </Button>
          </div>

          {/* Test with Files Section */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Test with Files</h2>
            <p className="text-gray-400 mb-6">
              Validate form data with mock image files to test file upload functionality.
            </p>
            <p className="text-yellow-400 text-sm mb-6">
              ⚠️ This does NOT create real orders. Real orders are created only after Stripe payment.
            </p>
            <Button
              onClick={handleTestWithFiles}
              disabled={isSubmitting}
              className="bg-blue-500 hover:bg-blue-600 text-white mr-4"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Testing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <TestTube className="w-4 h-4" />
                  Test with Files
                </span>
              )}
            </Button>
          </div>

          {/* Full Test Section */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Full Form Test</h2>
            <p className="text-gray-400 mb-6">
              Go to the flyer form to test with complete form data and real file uploads.
            </p>
            <Button
              onClick={() => router.push('/flyers')}
              variant="outline"
              className="mr-4"
            >
              Go to Flyer Form
            </Button>
          </div>

          {/* Test Checklist */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Test Checklist:</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-lg font-medium mb-2 text-green-400">✅ Backend Integration</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-400">
                  <li>API endpoint reachable</li>
                  <li>FormData properly formatted</li>
                  <li>Response handled correctly</li>
                  <li>Order created in backend</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-medium mb-2 text-blue-400">📁 File Uploads</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-400">
                  <li>Main flyer image</li>
                  <li>Venue logo</li>
                  <li>DJ/Artist images</li>
                  <li>Host image</li>
                  <li>Sponsor images</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Debug Info */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Debug Information</h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-400">Backend URL:</span> http://193.203.161.174:3007/api/orders</p>
              <p><span className="text-gray-400">Test Endpoint:</span> /api/test-order</p>
              <p><span className="text-gray-400">User Status:</span> {authStore.user ? `Logged in as ${authStore.user.email || authStore.user.name}` : 'Not logged in'}</p>
              <p><span className="text-gray-400">User ID:</span> {authStore.user?.id || 'N/A'}</p>
              <p><span className="text-gray-400">User Email:</span> {authStore.user?.email || 'NULL'}</p>
              <p><span className="text-gray-400">User Name:</span> {authStore.user?.name || 'N/A'}</p>
              <p><span className="text-gray-400">Browser Console:</span> Check for detailed logs</p>
              <Button 
                onClick={() => authStore.refreshUserData()} 
                variant="outline" 
                size="sm"
                className="mt-2"
              >
                Refresh User Data
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
