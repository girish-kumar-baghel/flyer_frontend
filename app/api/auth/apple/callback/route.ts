import { NextRequest, NextResponse } from 'next/server';

/**
 * Apple OAuth Callback API Route
 * Handles the token exchange server-side for better security
 * Note: Apple uses POST method for callback
 */
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const code = formData.get('code') as string;
        const error = formData.get('error') as string;
        const userParam = formData.get('user') as string;

        if (error) {
            console.error('Apple OAuth error:', error);
            return NextResponse.json(
                { success: false, error: 'Apple sign-in was cancelled or failed' },
                { status: 400 }
            );
        }

        if (!code) {
            return NextResponse.json(
                { success: false, error: 'No authorization code received' },
                { status: 400 }
            );
        }

        const clientId = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID;
        const clientSecret = process.env.APPLE_CLIENT_SECRET;
        const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth/apple/callback`;

        if (!clientId || !clientSecret) {
            console.error('Apple OAuth credentials not configured');
            return NextResponse.json(
                { success: false, error: 'Apple OAuth not configured' },
                { status: 500 }
            );
        }

        // Exchange code for access token
        const tokenResponse = await fetch('https://appleid.apple.com/auth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code',
            }),
        });

        if (!tokenResponse.ok) {
            const errorData = await tokenResponse.json();
            console.error('Token exchange failed:', errorData);
            return NextResponse.json(
                { success: false, error: 'Failed to exchange code for token' },
                { status: 400 }
            );
        }

        const tokenData = await tokenResponse.json();
        const idToken = tokenData.id_token;

        // Decode ID token to get user info
        const payload = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString());

        // Parse user data if provided (only on first sign-in)
        let userData = null;
        if (userParam) {
            try {
                userData = JSON.parse(userParam);
            } catch (e) {
                console.warn('Failed to parse user data:', e);
            }
        }

        // Apple provides user info only on first sign-in
        const userName = userData?.name
            ? `${userData.name.firstName || ''} ${userData.name.lastName || ''}`.trim()
            : payload.email;

        // Return user data
        return NextResponse.json({
            success: true,
            user: {
                id: payload.sub,
                email: payload.email,
                name: userName || payload.email,
                provider: 'apple',
            },
        });
    } catch (error: any) {
        console.error('Apple OAuth callback error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
