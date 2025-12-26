import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
})

export async function POST(request: Request) {
  try {
    const { amount, orderData } = await request.json()

    console.log('📋 Creating Stripe session with order data')
    console.log('💰 Amount:', amount)
    console.log('📦 Order data received:', {
      userId: orderData.userId,
      email: orderData.userEmail,
      presenting: orderData.formData?.presenting,
      total_price: orderData.formData?.total_price
    })

    // Encode order data as base64 to store in Stripe metadata
    const orderDataString = JSON.stringify(orderData)
    const orderDataBase64 = Buffer.from(orderDataString).toString('base64')

    console.log('📦 Order data size:', orderDataString.length, 'bytes')
    console.log('📦 Base64 size:', orderDataBase64.length, 'bytes')

    // Check if metadata is too large (Stripe limit is 500 chars per field)
    if (orderDataBase64.length > 500) {
      console.error('❌ Order data too large for Stripe metadata:', orderDataBase64.length, 'bytes')
      console.log('💡 Splitting into multiple metadata fields...')

      // Split into chunks of 500 characters
      const chunkSize = 500
      const chunks = []
      for (let i = 0; i < orderDataBase64.length; i += chunkSize) {
        chunks.push(orderDataBase64.substring(i, i + chunkSize))
      }

      console.log(`📦 Split into ${chunks.length} chunks`)

      // Create metadata object with chunks
      const metadata: any = {
        userId: orderData.userId || '',
        userEmail: orderData.userEmail || '',
        totalPrice: amount.toString(),
        chunkCount: chunks.length.toString()
      }

      // Add each chunk (Stripe allows up to 50 metadata keys)
      chunks.forEach((chunk, index) => {
        metadata[`orderData_${index}`] = chunk
      })

      // Create Stripe session with chunked metadata
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Flyer Design Order',
                description: `Custom flyer for ${orderData.formData?.presenting || 'Event'}`,
              },
              unit_amount: Math.round(amount * 100),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout`,
        metadata: metadata,
      })

      console.log('✅ Stripe session created with chunked metadata:', session.id)
      return NextResponse.json({ sessionId: session.id })
    }

    // If data fits in one field, use simple approach
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Flyer Design Order',
              description: `Custom flyer for ${orderData.formData?.presenting || 'Event'}`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout`,
      metadata: {
        orderData: orderDataBase64,
        userId: orderData.userId || '',
        userEmail: orderData.userEmail || '',
        totalPrice: amount.toString(),
      },
    })

    console.log('✅ Stripe session created:', session.id)
    return NextResponse.json({ sessionId: session.id })

  } catch (error: any) {
    console.error('❌ Stripe checkout error:', error)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
