import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('Test order API called')
    
    // Parse the incoming FormData (not JSON)
    const formData = await request.formData()
    console.log('Received FormData with entries:')
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: File(${value.name}, ${value.size} bytes)`)
      } else {
        console.log(`  ${key}: ${value}`)
      }
    }
    
    // Create a new FormData to send to backend
    const backendFormData = new FormData()
    
    // Copy all entries from the received FormData
    for (let [key, value] of formData.entries()) {
      backendFormData.append(key, value)
    }
    
    // Ensure required fields are present (add defaults if missing)
    if (!backendFormData.has('presenting')) backendFormData.append('presenting', 'Test Venue')
    if (!backendFormData.has('event_title')) backendFormData.append('event_title', 'Test Event')
    if (!backendFormData.has('event_date')) backendFormData.append('event_date', '2025-11-27')
    if (!backendFormData.has('flyer_info')) backendFormData.append('flyer_info', 'Test event information')
    if (!backendFormData.has('address_phone')) backendFormData.append('address_phone', '123 Test St | 555-0123')
    if (!backendFormData.has('story_size_version')) backendFormData.append('story_size_version', 'false')
    if (!backendFormData.has('custom_flyer')) backendFormData.append('custom_flyer', 'false')
    if (!backendFormData.has('animated_flyer')) backendFormData.append('animated_flyer', 'false')
    if (!backendFormData.has('instagram_post_size')) backendFormData.append('instagram_post_size', 'true')
    if (!backendFormData.has('custom_notes')) backendFormData.append('custom_notes', 'Test custom notes')
    if (!backendFormData.has('flyer_is')) backendFormData.append('flyer_is', '26')
    if (!backendFormData.has('category_id')) backendFormData.append('category_id', '9')
    if (!backendFormData.has('user_id')) backendFormData.append('user_id', '99ae0488-f0a1-70db-db50-da298fdef51esery')
    if (!backendFormData.has('delivery_time')) backendFormData.append('delivery_time', '1 Hour')
    if (!backendFormData.has('total_price')) backendFormData.append('total_price', '10')
    if (!backendFormData.has('subtotal')) backendFormData.append('subtotal', '10')
    if (!backendFormData.has('image_url')) backendFormData.append('image_url', 'https://images.unsplash.com/photo.jpg')
    if (!backendFormData.has('web_user_id')) backendFormData.append('web_user_id', '')
    
    // Add JSON fields if missing
    if (!backendFormData.has('djs')) backendFormData.append('djs', '[{"name":"DJ 1"},{"name":"DJ 2"}]')
    if (!backendFormData.has('host')) backendFormData.append('host', '{"name":"Test Host"}')
    if (!backendFormData.has('sponsors')) backendFormData.append('sponsors', '[{"name":"Sponsor 1"},{"name":"Sponsor 2"},{"name":"Sponsor 3"}]')
    
    // Add the duplicate total_price field with space
    if (!backendFormData.has(' total_price')) backendFormData.append(' total_price', '78')
    
    console.log('Sending FormData to backend API...')
    
    const response = await fetch('http://193.203.161.174:3007/api/orders', {
      method: 'POST',
      body: backendFormData
    })
    
    console.log('Backend API response status:', response.status)
    console.log('Backend API response ok:', response.ok)
    
    const responseData = await response.json()
    console.log('Backend API response:', responseData)
    
    if (!response.ok) {
      return NextResponse.json(
        { error: responseData.message || 'Failed to create order' },
        { status: response.status }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      data: responseData,
      message: ' order created successfully'
    })
  } catch (error) {
    console.error(' order error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
