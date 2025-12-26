import { OrderSubmission } from '@/types/order';

export function buildOrderFormData(submission: OrderSubmission): FormData {
  const { formData, files } = submission;
  const formDataObj = new FormData();

  console.log('Building FormData with:', { formData, files })

  // Required fields based on working Postman code
  formDataObj.append('presenting', formData.presenting || '')
  formDataObj.append('event_title', formData.event_title || '')
  formDataObj.append('event_date', formData.event_date || '')
  formDataObj.append('flyer_info', formData.flyer_info || '')
  formDataObj.append('address_phone', formData.address_phone || '')
  formDataObj.append('story_size_version', String(formData.story_size_version || false))
  formDataObj.append('custom_flyer', String(formData.custom_flyer || false))
  formDataObj.append('animated_flyer', String(formData.animated_flyer || false))
  formDataObj.append('instagram_post_size', String(formData.instagram_post_size || true))
  formDataObj.append('custom_notes', formData.custom_notes || '')
  formDataObj.append('flyer_is', String(formData.flyer_is || 26))
  formDataObj.append('category_id', String(formData.category_id || 9))
  formDataObj.append('user_id', formData.user_id || '99ae0488-f0a1-70db-db50-da298fdef51esery')
  formDataObj.append('delivery_time', formData.delivery_time || '1 Hour')
  formDataObj.append('total_price', String(formData.total_price || 10))
  formDataObj.append('subtotal', String(formData.subtotal || 10))
  formDataObj.append('image_url', formData.image_url || 'https://images.unsplash.com/photo.jpg')
  formDataObj.append('email', formData.email || 'user@example.com') // Use real email from form
  formDataObj.append('web_user_id', '')
  
  // Add duplicate total_price with space (as seen in Postman)
  formDataObj.append(' total_price', String(formData.total_price || 78))

  // JSON fields
  console.log('Appending djs as JSON:', formData.djs)
  formDataObj.append('djs', JSON.stringify(formData.djs || []))
  
  console.log('Appending host as JSON:', formData.host)
  formDataObj.append('host', JSON.stringify(formData.host || {}))
  
  console.log('Appending sponsors as JSON:', formData.sponsors)
  formDataObj.append('sponsors', JSON.stringify(formData.sponsors || []))

  // Append files
  if (files.venueLogoFile) {
    console.log('Appending venue_logo file:', files.venueLogoFile.name)
    formDataObj.append('venue_logo', files.venueLogoFile);
  }
  if (files.hostFile) {
    console.log('Appending host_file:', files.hostFile.name)
    formDataObj.append('host_file', files.hostFile);
  }

  // Append DJ files
  files.djFiles.forEach((file, index) => {
    console.log(`Appending dj_${index}:`, file.name)
    formDataObj.append(`dj_${index}`, file);
  });

  // Append sponsor files
  files.sponsorFiles.forEach((file, index) => {
    console.log(`Appending sponsor_${index}:`, file.name)
    formDataObj.append(`sponsor_${index}`, file);
  });

  // Log all FormData entries (for debugging)
  console.log('FormData entries:')
  for (let [key, value] of formDataObj.entries()) {
    if (value instanceof File) {
      console.log(`  ${key}: File(${value.name}, ${value.size} bytes)`)
    } else {
      console.log(`  ${key}: ${value}`)
    }
  }

  return formDataObj;
}

export async function submitOrder(
  orderSubmission: OrderSubmission
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    console.log('Building form data...')
    const formData = buildOrderFormData(orderSubmission)
    
    console.log('Sending request to: http://193.203.161.174:3007/api/orders')
    
    const response = await fetch('http://193.203.161.174:3007/api/orders', {
      method: 'POST',
      body: formData,
      // Note: Don't set Content-Type header - let the browser set it with the correct boundary
    })

    console.log('Response status:', response.status)
    console.log('Response ok:', response.ok)

    const responseData = await response.json()
    console.log('Response data:', responseData)

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to submit order')
    }

    return { success: true, data: responseData }
  } catch (error) {
    console.error('Order submission error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}
