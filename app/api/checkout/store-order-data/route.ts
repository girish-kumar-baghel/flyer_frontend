import { NextRequest, NextResponse } from 'next/server'

// Temporary in-memory storage (in production, use Redis or database)
const orderDataStore = new Map<string, any>()

export async function POST(req: NextRequest) {
  try {
    const { sessionId, orderData } = await req.json()
    
    if (!sessionId || !orderData) {
      return NextResponse.json(
        { error: 'Missing sessionId or orderData' },
        { status: 400 }
      )
    }

    // Store order data with session ID as key
    orderDataStore.set(sessionId, orderData)
    
    // Set expiration (30 minutes)
    setTimeout(() => {
      orderDataStore.delete(sessionId)
    }, 30 * 60 * 1000)

    console.log('✅ Order data stored for session:', sessionId)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ Error storing order data:', error)
    return NextResponse.json(
      { error: 'Failed to store order data' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing sessionId' },
        { status: 400 }
      )
    }

    const orderData = orderDataStore.get(sessionId)
    
    if (!orderData) {
      console.log('❌ Order data not found for session:', sessionId)
      return NextResponse.json(
        { error: 'Order data not found' },
        { status: 404 }
      )
    }

    console.log('✅ Order data retrieved for session:', sessionId)
    
    return NextResponse.json({ orderData })
  } catch (error) {
    console.error('❌ Error retrieving order data:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve order data' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { sessionId } = await req.json()
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing sessionId' },
        { status: 400 }
      )
    }

    const deleted = orderDataStore.delete(sessionId)
    
    if (deleted) {
      console.log('✅ Order data cleaned up for session:', sessionId)
    } else {
      console.log('⚠️ No order data found to clean up for session:', sessionId)
    }
    
    return NextResponse.json({ success: true, deleted })
  } catch (error) {
    console.error('❌ Error cleaning up order data:', error)
    return NextResponse.json(
      { error: 'Failed to clean up order data' },
      { status: 500 }
    )
  }
}
