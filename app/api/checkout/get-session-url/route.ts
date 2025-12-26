import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-10-29.clover',
})

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const sessionId = searchParams.get('sessionId')

        if (!sessionId) {
            return NextResponse.json(
                { error: 'Missing sessionId' },
                { status: 400 }
            )
        }

        console.log('🔍 Retrieving Stripe session:', sessionId)

        // Retrieve the session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId)

        if (!session || !session.url) {
            return NextResponse.json(
                { error: 'Session URL not found' },
                { status: 404 }
            )
        }

        console.log('✅ Session URL retrieved:', session.url)

        return NextResponse.json({ url: session.url })
    } catch (error) {
        console.error('❌ Error retrieving session URL:', error)
        return NextResponse.json(
            { error: 'Failed to retrieve session URL' },
            { status: 500 }
        )
    }
}
