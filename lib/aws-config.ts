// AWS Cognito configuration with HTTP/HTTPS detection

export const isProduction = process.env.NODE_ENV === 'production'
export const isLocalhost = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
export const isHttp = typeof window !== 'undefined' && window.location.protocol === 'http:'

// Cognito configuration
export const cognitoConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || "ap-southeast-2_1tWWnrkxi",
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || "2rrjp79uvfvje1ip5c70c4e1gk", // Update this if you create a new app client
      region: process.env.NEXT_PUBLIC_AWS_REGION || "ap-southeast-2",
    },
    // Only configure cookie storage for non-HTTPS environments
    ...(isHttp && {
      cookieStorage: {
        secure: false, // Allow cookies on HTTP
        sameSite: 'lax',
        path: '/',
        expires: 365, // days
      },
      // Use localStorage for HTTP environments
      storage: localStorage,
    }),
  },
}

// Export for use in components
export default cognitoConfig
