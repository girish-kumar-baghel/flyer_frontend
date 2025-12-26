// Direct OAuth Client for Google and Apple (without Cognito)
import { registerUserInDatabase, formatCognitoUserId } from "@/lib/api-client";

export interface OAuthUserInfo {
    id: string;
    email: string;
    name: string;
    picture?: string;
    provider: "google" | "apple";
}

export interface OAuthResponse {
    success: boolean;
    user?: OAuthUserInfo;
    error?: string;
}

/**
 * Handle Google OAuth Sign-In
 * This uses the Google OAuth 2.0 flow
 */
export const signInWithGoogle = async (): Promise<OAuthResponse> => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!clientId) {
        const errorMessage = "Google Sign-In is not configured. Please add NEXT_PUBLIC_GOOGLE_CLIENT_ID to your .env.local file.";
        console.error(errorMessage);
        throw new Error(errorMessage);
    }

    try {
        // Build Google OAuth URL
        // Using production redirect URI: https://grodify.com/auth/google/callback
        const redirectUri = "https://grodify.com/auth/google/callback";
        const scope = "openid email profile";
        const responseType = "code";

        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
            `client_id=${encodeURIComponent(clientId)}` +
            `&redirect_uri=${encodeURIComponent(redirectUri)}` +
            `&response_type=${responseType}` +
            `&scope=${encodeURIComponent(scope)}` +
            `&access_type=offline` +
            `&prompt=consent`;

        console.log('Redirecting to Google OAuth...');
        console.log('Redirect URI:', redirectUri);

        // Redirect to Google OAuth
        window.location.href = googleAuthUrl;

        return { success: true };
    } catch (error: any) {
        console.error("Google OAuth error:", error);
        throw new Error(error.message || "Failed to sign in with Google");
    }
};

/**
 * Handle Apple OAuth Sign-In
 * This uses the Apple Sign In flow
 */
export const signInWithApple = async (): Promise<OAuthResponse> => {
    const clientId = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID;

    if (!clientId) {
        const errorMessage = "Apple Sign-In is not configured. Please add NEXT_PUBLIC_APPLE_CLIENT_ID to your .env.local file.";
        console.error(errorMessage);
        throw new Error(errorMessage);
    }

    try {
        // Build Apple OAuth URL
        // Using production redirect URI: https://grodify.com/auth/apple/callback
        const redirectUri = "https://grodify.com/auth/apple/callback";
        const scope = "name email";
        const responseType = "code";
        const responseMode = "form_post";

        const appleAuthUrl = `https://appleid.apple.com/auth/authorize?` +
            `client_id=${encodeURIComponent(clientId)}` +
            `&redirect_uri=${encodeURIComponent(redirectUri)}` +
            `&response_type=${responseType}` +
            `&response_mode=${responseMode}` +
            `&scope=${encodeURIComponent(scope)}`;

        console.log('Redirecting to Apple OAuth...');
        console.log('Redirect URI:', redirectUri);

        // Redirect to Apple OAuth
        window.location.href = appleAuthUrl;

        return { success: true };
    } catch (error: any) {
        console.error("Apple OAuth error:", error);
        throw new Error(error.message || "Failed to sign in with Apple");
    }
};

/**
 * Exchange Google authorization code for user info
 */
export const handleGoogleCallback = async (code: string): Promise<OAuthResponse> => {
    try {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        const clientSecret = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET;
        // Using production redirect URI to match Google Cloud Console configuration
        const redirectUri = "https://grodify.com/auth/google/callback";

        if (!clientId || !clientSecret) {
            throw new Error("Google OAuth credentials not configured");
        }

        // Exchange code for access token
        const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: "authorization_code",
            }),
        });

        if (!tokenResponse.ok) {
            throw new Error("Failed to exchange code for token");
        }

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        // Get user info
        const userInfoResponse = await fetch(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (!userInfoResponse.ok) {
            throw new Error("Failed to get user info");
        }

        const userInfo = await userInfoResponse.json();

        const oauthUser: OAuthUserInfo = {
            id: userInfo.id,
            email: userInfo.email,
            name: userInfo.name || userInfo.email,
            picture: userInfo.picture,
            provider: "google",
        };

        // Register user in backend database
        const formattedUserId = formatCognitoUserId(oauthUser.id, "google");
        await registerUserInDatabase({
            fullname: oauthUser.name,
            email: oauthUser.email,
            user_id: formattedUserId,
        });

        return {
            success: true,
            user: oauthUser,
        };
    } catch (error: any) {
        console.error("Google callback error:", error);
        return {
            success: false,
            error: error.message || "Failed to complete Google sign-in",
        };
    }
};

/**
 * Exchange Apple authorization code for user info
 */
export const handleAppleCallback = async (
    code: string,
    user?: any
): Promise<OAuthResponse> => {
    try {
        const clientId = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID;
        const clientSecret = process.env.NEXT_PUBLIC_APPLE_CLIENT_SECRET;
        // Using production redirect URI to match Apple Developer Console configuration
        const redirectUri = "https://grodify.com/auth/apple/callback";

        if (!clientId || !clientSecret) {
            throw new Error("Apple OAuth credentials not configured");
        }

        // Exchange code for access token
        const tokenResponse = await fetch("https://appleid.apple.com/auth/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: "authorization_code",
            }),
        });

        if (!tokenResponse.ok) {
            throw new Error("Failed to exchange code for token");
        }

        const tokenData = await tokenResponse.json();
        const idToken = tokenData.id_token;

        // Decode ID token to get user info
        const payload = JSON.parse(atob(idToken.split(".")[1]));

        // Apple provides user info only on first sign-in
        const userName = user?.name
            ? `${user.name.firstName || ""} ${user.name.lastName || ""}`.trim()
            : payload.email;

        const oauthUser: OAuthUserInfo = {
            id: payload.sub,
            email: payload.email,
            name: userName || payload.email,
            provider: "apple",
        };

        // Register user in backend database
        const formattedUserId = formatCognitoUserId(oauthUser.id, "apple");
        await registerUserInDatabase({
            fullname: oauthUser.name,
            email: oauthUser.email,
            user_id: formattedUserId,
        });

        return {
            success: true,
            user: oauthUser,
        };
    } catch (error: any) {
        console.error("Apple callback error:", error);
        return {
            success: false,
            error: error.message || "Failed to complete Apple sign-in",
        };
    }
};
