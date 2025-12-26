import { NextRequest, NextResponse } from 'next/server';

/**
 * Google OAuth Callback API Route
 * Handles the token exchange server-side for better security
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
            console.error('Google OAuth error:', error);
            return NextResponse.json(
                { success: false, error: 'Google sign-in was cancelled or failed' },
                { status: 400 }
            );
        }

        if (!code) {
            return NextResponse.json(
                { success: false, error: 'No authorization code received' },
                { status: 400 }
            );
        }

        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth/google/callback`;

        if (!clientId || !clientSecret) {
            console.error('Google OAuth credentials not configured');
            return NextResponse.json(
                { success: false, error: 'Google OAuth not configured' },
                { status: 500 }
            );
        }

        // Exchange code for access token
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
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
        const accessToken = tokenData.access_token;

        // Get user info
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!userInfoResponse.ok) {
            console.error('Failed to get user info');
            return NextResponse.json(
                { success: false, error: 'Failed to get user info' },
                { status: 400 }
            );
        }

        const userInfo = await userInfoResponse.json();

        // Return user data
        return NextResponse.json({
            success: true,
            user: {
                id: userInfo.id,
                email: userInfo.email,
                name: userInfo.name || userInfo.email,
                picture: userInfo.picture,
                provider: 'google',
            },
        });
    } catch (error: any) {
        console.error('Google OAuth callback error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
