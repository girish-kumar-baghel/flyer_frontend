// AWS Cognito Configuration
export const awsConfig = {
  // REQUIRED - Amazon Cognito Region
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
  
  // REQUIRED - Amazon Cognito User Pool ID
  userPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID || 'YOUR_USER_POOL_ID',
  
  // REQUIRED - Amazon Cognito Web Client ID
  userPoolWebClientId: process.env.NEXT_PUBLIC_AWS_USER_POOL_WEB_CLIENT_ID || 'YOUR_APP_CLIENT_ID',
  
  // OPTIONAL - Authentication flow type
  authenticationFlowType: 'USER_PASSWORD_AUTH',
  
  // OPTIONAL - OAuth configuration
  oauth: {
    domain: process.env.NEXT_PUBLIC_AWS_COGNITO_DOMAIN || 'YOUR_COGNITO_DOMAIN.auth.us-east-1.amazoncognito.com',
    scopes: ['email', 'profile', 'openid'],
    redirectSignIn: process.env.NEXT_PUBLIC_OAUTH_REDIRECT_SIGN_IN || 'http://localhost:3000/',
    redirectSignOut: process.env.NEXT_PUBLIC_OAUTH_REDIRECT_SIGN_OUT || 'http://localhost:3000/login',
    responseType: 'code' as const,
  },
  
  // OPTIONAL - Cookie storage configuration
  cookieStorage: {
    domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN || 'localhost',
    path: '/',
    expires: 30, // days
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
  },
}

// Type for AWS Amplify Auth configuration
export type AuthConfig = {
  region: string
  userPoolId: string
  userPoolWebClientId: string
  authenticationFlowType: 'USER_SRP_AUTH' | 'USER_PASSWORD_AUTH'
  oauth: {
    domain: string
    scopes: string[]
    redirectSignIn: string
    redirectSignOut: string
    responseType: 'code' | 'token'
  }
  cookieStorage?: {
    domain: string
    path: string
    expires: number
    secure: boolean
    sameSite: 'lax' | 'strict' | 'none'
  }
}
