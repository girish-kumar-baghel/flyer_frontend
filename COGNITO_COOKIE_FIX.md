# Fixing Cognito Cookie Issues on HTTP (EC2)

## Problem
AWS Cognito is trying to set secure cookies (HTTPS only) but your EC2 is running on HTTP, causing login failures.

## Solution Options

### Option 1: Update Cognito App Client (Recommended for Development)

1. Go to AWS Cognito Console
2. Select your User Pool
3. Go to "App integration" → "App client settings"
4. Find your app client and click "Edit"
5. Under "Auth session configuration", uncheck "Set to require HTTPS"
6. Save changes

### Option 2: Set Up HTTPS with SSL Certificate (Recommended for Production)

1. Get a free SSL certificate from AWS Certificate Manager (ACM)
2. Set up an Application Load Balancer (ALB)
3. Configure HTTPS listener on ALB
4. Point your domain to ALB
5. Update Cognito callback URLs to use HTTPS

### Option 3: Use Environment Variable Override

Add this to your EC2 environment variables:
```bash
COGNITO_COOKIE_SECURE=false
```

### Option 4: Configure Amplify for HTTP

In your app, add this configuration:
```javascript
// Before configuring Amplify
Amplify.configure({
  Auth: {
    ...authConfig,
    cookieStorage: {
      secure: false, // Allow cookies on HTTP
      sameSite: 'lax'
    }
  }
})
```

## Temporary Fix (Development Only)

If you need immediate access, you can modify the AuthGuard component to use localStorage instead of cookies temporarily.
