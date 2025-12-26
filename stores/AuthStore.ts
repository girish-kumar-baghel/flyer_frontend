// stores/AuthStore.ts
import { makeAutoObservable, runInAction, autorun } from "mobx"
import { getApiUrl } from "@/config/api"
import { registerUserInDatabase, formatCognitoUserId } from "@/lib/api-client"
import { Amplify } from 'aws-amplify'
import { Hub } from '@aws-amplify/core'
import {
  signIn as awsSignIn,
  signInWithRedirect as awsSignInWithRedirect,
  signUp as awsSignUp,
  signOut as awsSignOut,
  getCurrentUser,
  fetchAuthSession,
  resetPassword as awsResetPassword,
  confirmResetPassword as awsConfirmResetPassword,
  type SignInInput,
  type SignUpInput,
  type ResetPasswordInput,
  type ConfirmResetPasswordInput,
  type SignInWithRedirectInput,
  type AuthUser as AWSAuthUser
} from 'aws-amplify/auth'
import { awsConfig } from "@/config/aws-config"

// Configure AWS Amplify
const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: awsConfig.userPoolId,
      userPoolClientId: awsConfig.userPoolWebClientId,
      loginWith: {
        oauth: {
          ...awsConfig.oauth,
          redirectSignIn: [awsConfig.oauth.redirectSignIn],
          redirectSignOut: [awsConfig.oauth.redirectSignOut],
          scopes: awsConfig.oauth.scopes
        },
      },
    },
  },
}

Amplify.configure(amplifyConfig, { ssr: true })

export interface AuthUser {
  id: string
  name: string
  email: string
  provider?: string
  phone?: string
  favorites?: string[]
  orders?: string[]
  createdAt?: string
}

type LoginPayload = {
  email: string
  password: string
}

type RegisterPayload = {
  fullname: string
  email: string
  password: string
}

const STORAGE_KEY = "grodify_session"

export class AuthStore {
  user: AuthUser | null = null
  token: string | null = null
  loading = false
  error: string | null = null
  authModal = false
  private authListener: any = null
  private cartStore: any = null
  private favoritesStore: any = null

  constructor(cartStore?: any, favoritesStore?: any) {
    this.cartStore = cartStore
    this.favoritesStore = favoritesStore
    makeAutoObservable(this)
    this.initializeAuthListener()
  }

  private initializeAuthListener = () => {
    // Clean up any existing listener
    if (this.authListener) {
      this.authListener()
    }

    // Define the Hub payload type for auth events
    type AuthHubPayload = {
      event: 'signedIn' | 'signedOut' | 'signInWithRedirect' | 'signInWithRedirect_failure' | 'tokenRefresh' | 'tokenRefresh_failure' | string;
      data?: any;
      message?: string;
    };

    // Set up new auth state listener with proper typing
    this.authListener = Hub.listen('auth', async ({ payload }: { payload: AuthHubPayload }) => {
      if (!payload) return;

      switch (payload.event) {
        case 'signedIn':
          await this.updateUserFromAmplify()
          break
        case 'signedOut':
          this.clearUser()
          break
        case 'signInWithRedirect':
        case 'signInWithRedirect_failure':
          // Handle redirect sign-in success/failure
          if (payload.event === 'signInWithRedirect_failure') {
            console.error('Sign in with redirect failed:', payload.message || 'Unknown error')
          }
          break
        case 'tokenRefresh':
        case 'tokenRefresh_failure':
          // Handle token refresh events if needed
          break
        default:
          // Handle any other auth events
          break
      }
    })
  }

  hydrate = () => {
    if (typeof window === "undefined") return
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return

    try {
      const parsed = JSON.parse(stored)
      runInAction(() => {
        this.user = parsed.user ?? null
        this.token = parsed.token ?? null
      })
    } catch (error) {
      console.error("Failed to hydrate auth session", error)
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }

  private persistSession = () => {
    if (typeof window === "undefined") return
    const payload = JSON.stringify({ user: this.user, token: this.token })
    window.localStorage.setItem(STORAGE_KEY, payload)
  }

  private clearSessionStorage = () => {
    if (typeof window === "undefined") return
    window.localStorage.removeItem(STORAGE_KEY)
  }

  private normalizeUser = (payload: any): AuthUser => {
    const name = payload?.fullname ?? payload?.name ?? payload?.email ?? "User"
    return {
      id: String(payload?.id ?? payload?.user_id ?? payload?.uuid ?? ""),
      name,
      email: payload?.email ?? "",
      phone: payload?.phone ?? payload?.mobile ?? "",
      provider: payload?.provider ?? "email",
      favorites: payload?.favorites ?? [],
      orders: payload?.orders ?? [],
      createdAt: payload?.created_at ?? payload?.createdAt ?? new Date().toISOString(),
    }
  }

  private setSession = (user: AuthUser | null, token: string | null = null) => {
    runInAction(() => {
      this.user = user
      this.token = token
      if (user) {
        this.persistSession()
      }
    })
  }

  private clearUser = () => {
    this.setSession(null, null)
    this.clearSessionStorage()
  }

  get authHeaders() {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {}
  }

  get isLoggedIn() {
    return Boolean(this.user)
  }

  login = async ({ email, password }: LoginPayload) => {
    this.loading = true
    this.error = null
    try {
      // Basic validation
      if (!email || !password) {
        throw new Error('Email and password are required')
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address')
      }

      if (password.length < 1) {
        throw new Error('Password is required')
      }

      const signInInput: SignInInput = {
        username: email,
        password,
      }

      const { isSignedIn, nextStep } = await awsSignIn(signInInput)

      if (!isSignedIn) {
        // Handle additional authentication steps
        if (nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
          throw new Error('You need to set a new password. Please check your email for instructions.')
        }
        if (nextStep.signInStep === 'CONFIRM_SIGN_UP') {
          throw new Error('Please verify your email address before signing in. Check your inbox for the verification code.')
        }
        throw new Error('Additional authentication steps required. Please try again.')
      }

      return await this.updateUserFromAmplify()
    } catch (error: any) {
      let errorMessage = "Login failed"

      // Handle specific AWS Cognito errors
      const errorString = error?.message || error?.toString() || ''

      // User not found scenarios - Comprehensive coverage
      if (errorString.includes('UserNotFoundException') ||
        errorString.includes('User does not exist') ||
        errorString.includes('user not found') ||
        errorString.includes('USER_NOT_FOUND') ||
        errorString.includes('User not found') ||
        errorString.includes('Username does not exist') ||
        errorString.includes('username does not exist') ||
        errorString.includes('USERNAME_DOES_NOT_EXIST') ||
        errorString.includes('Invalid username') ||
        errorString.includes('invalid username') ||
        errorString.includes('INVALID_USERNAME') ||
        errorString.includes('No such user') ||
        errorString.includes('no such user') ||
        errorString.includes('NO_SUCH_USER')) {
        errorMessage = 'No account found with this email address. Please check your email or create a new account.'
      } else if (errorString.includes('NotAuthorizedException')) {
        if (errorString.includes('Incorrect username or password')) {
          errorMessage = 'Incorrect email or password. Please try again.'
        } else if (errorString.includes('Password attempts exceeded')) {
          errorMessage = 'Too many failed login attempts. Please try again later or reset your password.'
        } else {
          errorMessage = 'Invalid credentials. Please check your email and password.'
        }
      } else if (errorString.includes('UserNotConfirmedException')) {
        errorMessage = 'Your email address has not been verified. Please check your inbox for the verification code.'
      } else if (errorString.includes('UserLambdaValidationException')) {
        errorMessage = 'Unable to sign in. The service is temporarily unavailable. Please try again later.'
      } else if (errorString.includes('TooManyRequestsException')) {
        errorMessage = 'Too many login attempts. Please wait a moment and try again.'
      } else if (errorString.includes('LimitExceededException')) {
        errorMessage = 'Attempt limit exceeded. Please try again later.'
      } else if (errorString.includes('InvalidParameterException')) {
        if (errorString.includes('email')) {
          errorMessage = 'Invalid email format. Please enter a valid email address.'
        } else {
          errorMessage = 'Invalid input. Please check your email and password.'
        }
      } else if (errorString.includes('Network error') || errorString.includes('fetch')) {
        errorMessage = 'Network connection error. Please check your internet connection and try again.'
      } else if (errorString.includes('timeout')) {
        errorMessage = 'Request timed out. Please check your connection and try again.'
      } else if (errorString.includes('Email and password are required')) {
        errorMessage = 'Please enter both email and password.'
      } else if (errorString.includes('Please enter a valid email address')) {
        errorMessage = 'Please enter a valid email address.'
      } else if (errorString.includes('Password is required')) {
        errorMessage = 'Please enter your password.'
      } else if (errorString.includes('set a new password')) {
        errorMessage = errorString
      } else if (errorString.includes('verify your email')) {
        errorMessage = errorString
      } else if (error?.message) {
        errorMessage = error.message
      }

      runInAction(() => {
        this.error = errorMessage
      })
      throw new Error(errorMessage)
    } finally {
      runInAction(() => {
        this.loading = false
      })
    }
  }

  // Add a public method to manually refresh user data
  refreshUserData = async () => {
    return await this.updateUserFromAmplify()
  }

  private updateUserFromAmplify = async () => {
    try {
      const user = await getCurrentUser()
      const session = await fetchAuthSession()
      const token = session.tokens?.idToken?.toString() || ''

      console.log('Raw user from AWS:', user);
      console.log('Session tokens:', session.tokens);
      console.log('ID Token exists:', !!token);

      // Extract data from JWT token
      let emailFromToken = ''
      let nameFromToken = ''
      let providerFromToken = 'cognito' // default

      if (token) {
        try {
          // Simple JWT decode (without verification since it's from AWS)
          const payload = JSON.parse(atob(token.split('.')[1]))
          console.log('JWT payload:', payload);

          emailFromToken = payload.email || ''
          console.log('Email from token:', emailFromToken);

          // Extract name from token (different providers use different fields)
          nameFromToken = payload.name || payload.given_name || payload.nickname || ''
          console.log('Name from token:', nameFromToken);

          // Detect provider from token
          // Google: identities array contains google
          // Apple: identities array contains apple
          // Cognito: no identities or identities is empty
          if (payload.identities && Array.isArray(payload.identities) && payload.identities.length > 0) {
            const providerName = payload.identities[0].providerName?.toLowerCase() || ''
            if (providerName.includes('google')) {
              providerFromToken = 'google'
            } else if (providerName.includes('apple')) {
              providerFromToken = 'apple'
            }
          }
          console.log('Provider from token:', providerFromToken);

        } catch (e) {
          console.warn('Could not extract data from token:', e)
        }
      }

      const normalized = this.normalizeUser({
        id: user.userId,
        email: emailFromToken || user.signInDetails?.loginId || '',
        name: nameFromToken || user.username || emailFromToken || user.userId,
        provider: providerFromToken,
      })

      console.log('Normalized user:', normalized);

      // Register user in backend database
      try {
        const formattedUserId = formatCognitoUserId(user.userId, providerFromToken)
        console.log('Formatted user ID for database:', formattedUserId);

        const result = await registerUserInDatabase({
          fullname: normalized.name,
          email: normalized.email,
          user_id: formattedUserId,
        })

        if (result.success) {
          console.log('✅ User successfully registered/updated in database:', result);
        } else {
          console.error('❌ Failed to register user in database:', result.message);
        }
      } catch (dbError) {
        console.error('❌ Error registering user in database:', dbError);
        // Continue with authentication even if database registration fails
      }

      runInAction(() => {
        this.setSession(normalized, token)
        this.authModal = false
      })

      return normalized
    } catch (error) {
      runInAction(() => {
        this.clearUser()
      })
      return null
    }
  }

  register = async ({ fullname, email, password }: RegisterPayload) => {
    this.loading = true
    this.error = null
    try {
      // Basic validation
      if (!fullname || !email || !password) {
        throw new Error('All fields are required')
      }

      // Name validation
      if (fullname.trim().length < 2) {
        throw new Error('Name must be at least 2 characters long')
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address')
      }

      // Password validation (basic checks, Cognito will enforce policy)
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long')
      }

      const signUpInput: SignUpInput = {
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            name: fullname,
            // Add any additional attributes as needed
          },
        },
      }

      const { isSignUpComplete, userId, nextStep } = await awsSignUp(signUpInput)

      // Register user in backend database immediately after Cognito registration
      try {
        const formattedUserId = formatCognitoUserId(userId, 'cognito')
        console.log('Registering user in database with ID:', formattedUserId);

        const result = await registerUserInDatabase({
          fullname: fullname,
          email: email,
          user_id: formattedUserId,
        })

        if (result.success) {
          console.log('✅ User successfully registered in database:', result);
        } else {
          console.error('❌ Failed to register user in database:', result.message);
        }
      } catch (dbError) {
        console.error('❌ Error registering user in database:', dbError);
        // Continue with authentication even if database registration fails
      }

      // If sign up is complete, automatically sign in the user
      if (isSignUpComplete) {
        try {
          // Auto-login after successful registration
          const signInInput: SignInInput = {
            username: email,
            password,
          }

          const { isSignedIn } = await awsSignIn(signInInput)

          if (isSignedIn) {
            await this.updateUserFromAmplify()
            return {
              success: true,
              autoLogin: true,
              user: {
                id: userId,
                email,
                name: fullname,
              },
              message: 'Account created successfully! You are now logged in.'
            }
          } else {
            // Registration successful but auto-login failed
            return {
              success: true,
              autoLogin: false,
              user: {
                id: userId,
                email,
                name: fullname,
              },
              message: 'Account created successfully. Please sign in manually.'
            }
          }
        } catch (loginError: any) {
          // Registration successful but auto-login failed
          console.error('Auto-login after registration failed:', loginError)
          return {
            success: true,
            autoLogin: false,
            user: {
              id: userId,
              email,
              name: fullname,
            },
            message: 'Account created successfully. Please sign in manually.'
          }
        }
      }

      // Return for manual verification (email verification required)
      return {
        success: isSignUpComplete,
        autoLogin: false,
        user: {
          id: userId,
          email,
          name: fullname,
        },
        message: 'User registration successful. Please check your email to confirm your account.'
      }
    } catch (error: any) {
      let errorMessage = "Registration failed"

      // Handle specific AWS Cognito errors
      const errorString = error?.message || error?.toString() || ''

      if (errorString.includes('UsernameExistsException') || errorString.includes('User already exists')) {
        errorMessage = 'An account with this email already exists. Please sign in or use a different email.'
      } else if (errorString.includes('InvalidPasswordException')) {
        if (errorString.includes('Password did not conform with policy')) {
          errorMessage = 'Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.'
        } else {
          errorMessage = 'Password does not meet security requirements. Please choose a stronger password.'
        }
      } else if (errorString.includes('InvalidParameterException')) {
        if (errorString.includes('email')) {
          errorMessage = 'Invalid email format. Please enter a valid email address.'
        } else if (errorString.includes('name')) {
          errorMessage = 'Invalid name format. Please enter your full name.'
        } else {
          errorMessage = 'Invalid input. Please check all fields and try again.'
        }
      } else if (errorString.includes('TooManyRequestsException')) {
        errorMessage = 'Too many registration attempts. Please wait a moment and try again.'
      } else if (errorString.includes('LimitExceededException')) {
        errorMessage = 'Attempt limit exceeded. Please try again later.'
      } else if (errorString.includes('Network error') || errorString.includes('fetch')) {
        errorMessage = 'Network connection error. Please check your internet connection and try again.'
      } else if (errorString.includes('timeout')) {
        errorMessage = 'Request timed out. Please check your connection and try again.'
      } else if (errorString.includes('All fields are required')) {
        errorMessage = 'Please fill in all required fields.'
      } else if (errorString.includes('Name must be at least 2 characters long')) {
        errorMessage = 'Name must be at least 2 characters long.'
      } else if (errorString.includes('Please enter a valid email address')) {
        errorMessage = 'Please enter a valid email address.'
      } else if (errorString.includes('Password must be at least 8 characters long')) {
        errorMessage = 'Password must be at least 8 characters long.'
      } else if (error?.message) {
        errorMessage = error.message
      }

      runInAction(() => {
        this.error = errorMessage
      })
      throw new Error(errorMessage)
    } finally {
      runInAction(() => {
        this.loading = false
      })
    }
  }

  logout = async () => {
    const userId = this.user?.id // Save userId before clearing

    try {
      console.log("🚪 Logging out user...")
      await awsSignOut()
    } catch (error) {
      console.error('Error during sign out:', error)
    } finally {
      // Clear user session
      this.clearUser()

      // Clear cart and favorites stores
      if (this.cartStore) {
        console.log("🛒 Clearing cart...")
        // Clear local cart items immediately
        this.cartStore.cartItems = []
      }

      if (this.favoritesStore) {
        console.log("❤️ Clearing favorites...")
        this.favoritesStore.clearLocalFavorites()
      }

      console.log("✅ Logout complete - all data cleared")
    }
  }

  updateProfile = async (payload: Partial<AuthUser>) => {
    if (!this.user) return
    const updated = { ...this.user, ...payload }
    this.setSession(updated, this.token)
  }

  signInWithProvider = async (provider: "google" | "apple") => {
    try {
      // This will redirect to the Cognito Hosted UI
      const signInInput: SignInWithRedirectInput = {
        provider: provider.toLowerCase() as 'Google' | 'Apple',
      }
      await awsSignInWithRedirect(signInInput)
    } catch (error: any) {
      console.error('Error signing in with provider:', error)

      let errorMessage = `Failed to sign in with ${provider}`
      const errorString = error?.message || error?.toString() || ''

      if (errorString.includes('NotAuthorizedException')) {
        errorMessage = `${provider} sign-in not authorized. Please check your ${provider} account settings.`
      } else if (errorString.includes('UserNotConfirmedException')) {
        errorMessage = `Your ${provider} account needs to be verified. Please check your email.`
      } else if (errorString.includes('Network error') || errorString.includes('fetch')) {
        errorMessage = 'Network connection error. Please check your internet connection and try again.'
      } else if (errorString.includes('timeout')) {
        errorMessage = 'Request timed out. Please check your connection and try again.'
      } else if (errorString.includes('TooManyRequestsException')) {
        errorMessage = 'Too many sign-in attempts. Please wait a moment and try again.'
      } else if (errorString.includes('InvalidParameterException')) {
        errorMessage = 'Invalid sign-in parameters. Please try again.'
      } else if (errorString.includes('UserLambdaValidationException')) {
        errorMessage = 'Unable to sign in with social account. The service is temporarily unavailable. Please try again later.'
      } else if (error?.message) {
        errorMessage = error.message
      }

      throw new Error(errorMessage)
    }
  }

  sendOTP = async (email: string) => {
    try {
      // Basic validation
      if (!email) {
        throw new Error('Email is required')
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address')
      }

      const resetPasswordInput: ResetPasswordInput = { username: email }
      const result = await awsResetPassword(resetPasswordInput)

      // In v6, resetPassword doesn't return a boolean, so we assume success if no error is thrown
      return {
        success: true,
        message: 'Password reset code sent to your email.',
        nextStep: result.nextStep
      }
    } catch (error: any) {
      console.error('Error sending OTP:', error)

      let errorMessage = 'Failed to send password reset code'
      const errorString = error?.message || error?.toString() || ''

      // User not found scenarios - Comprehensive coverage for password reset
      if (errorString.includes('UserNotFoundException') ||
        errorString.includes('User does not exist') ||
        errorString.includes('user not found') ||
        errorString.includes('USER_NOT_FOUND') ||
        errorString.includes('User not found') ||
        errorString.includes('Username does not exist') ||
        errorString.includes('username does not exist') ||
        errorString.includes('USERNAME_DOES_NOT_EXIST') ||
        errorString.includes('Invalid username') ||
        errorString.includes('invalid username') ||
        errorString.includes('INVALID_USERNAME') ||
        errorString.includes('No such user') ||
        errorString.includes('no such user') ||
        errorString.includes('NO_SUCH_USER')) {
        errorMessage = 'No account found with this email address. Please check your email or create a new account.'
      } else if (errorString.includes('InvalidParameterException')) {
        if (errorString.includes('email')) {
          errorMessage = 'Invalid email format. Please enter a valid email address.'
        } else {
          errorMessage = 'Invalid input. Please check your email address.'
        }
      } else if (errorString.includes('LimitExceededException') || errorString.includes('TooManyRequestsException')) {
        errorMessage = 'Too many password reset attempts. Please wait a moment and try again.'
      } else if (errorString.includes('Network error') || errorString.includes('fetch')) {
        errorMessage = 'Network connection error. Please check your internet connection and try again.'
      } else if (errorString.includes('timeout')) {
        errorMessage = 'Request timed out. Please check your connection and try again.'
      } else if (errorString.includes('Email is required')) {
        errorMessage = 'Please enter your email address.'
      } else if (errorString.includes('Please enter a valid email address')) {
        errorMessage = 'Please enter a valid email address.'
      } else if (error?.message) {
        errorMessage = error.message
      }

      throw new Error(errorMessage)
    }
  }

  verifyOTP = async (email: string, code: string, newPassword: string) => {
    try {
      // Basic validation
      if (!email || !code || !newPassword) {
        throw new Error('All fields are required')
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address')
      }

      // Code validation
      if (code.trim().length < 1) {
        throw new Error('Verification code is required')
      }

      // Password validation (basic checks, Cognito will enforce policy)
      if (newPassword.length < 8) {
        throw new Error('New password must be at least 8 characters long')
      }

      const confirmResetPasswordInput: ConfirmResetPasswordInput = {
        username: email,
        confirmationCode: code,
        newPassword,
      }

      // In v6, confirmResetPassword doesn't return a boolean
      await awsConfirmResetPassword(confirmResetPasswordInput)

      return {
        success: true,
        message: 'Password reset successful. You can now sign in with your new password.'
      }
    } catch (error: any) {
      console.error('Error verifying OTP:', error)

      let errorMessage = 'Failed to reset password'
      const errorString = error?.message || error?.toString() || ''

      // User not found scenarios - Comprehensive coverage for OTP verification
      if (errorString.includes('UserNotFoundException') ||
        errorString.includes('User does not exist') ||
        errorString.includes('user not found') ||
        errorString.includes('USER_NOT_FOUND') ||
        errorString.includes('User not found') ||
        errorString.includes('Username does not exist') ||
        errorString.includes('username does not exist') ||
        errorString.includes('USERNAME_DOES_NOT_EXIST') ||
        errorString.includes('Invalid username') ||
        errorString.includes('invalid username') ||
        errorString.includes('INVALID_USERNAME') ||
        errorString.includes('No such user') ||
        errorString.includes('no such user') ||
        errorString.includes('NO_SUCH_USER')) {
        errorMessage = 'No account found with this email address. Please check your email or create a new account.'
      } else if (errorString.includes('InvalidParameterException')) {
        if (errorString.includes('code')) {
          errorMessage = 'Invalid verification code. Please check the code and try again.'
        } else if (errorString.includes('password')) {
          errorMessage = 'New password does not meet security requirements. Please choose a stronger password.'
        } else {
          errorMessage = 'Invalid input. Please check all fields and try again.'
        }
      } else if (errorString.includes('CodeMismatchException')) {
        errorMessage = 'Invalid verification code. Please check the code and try again.'
      } else if (errorString.includes('ExpiredCodeException')) {
        errorMessage = 'The verification code has expired. Please request a new code.'
      } else if (errorString.includes('InvalidPasswordException')) {
        if (errorString.includes('Password did not conform with policy')) {
          errorMessage = 'Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.'
        } else {
          errorMessage = 'New password does not meet security requirements. Please choose a stronger password.'
        }
      } else if (errorString.includes('LimitExceededException') || errorString.includes('TooManyRequestsException')) {
        errorMessage = 'Too many verification attempts. Please wait a moment and try again.'
      } else if (errorString.includes('Network error') || errorString.includes('fetch')) {
        errorMessage = 'Network connection error. Please check your internet connection and try again.'
      } else if (errorString.includes('timeout')) {
        errorMessage = 'Request timed out. Please check your connection and try again.'
      } else if (errorString.includes('All fields are required')) {
        errorMessage = 'Please fill in all required fields.'
      } else if (errorString.includes('Please enter a valid email address')) {
        errorMessage = 'Please enter a valid email address.'
      } else if (errorString.includes('Verification code is required')) {
        errorMessage = 'Please enter the verification code.'
      } else if (errorString.includes('New password must be at least 8 characters long')) {
        errorMessage = 'New password must be at least 8 characters long.'
      } else if (error?.message) {
        errorMessage = error.message
      }

      throw new Error(errorMessage)
    }
  }

  handleAuthModal = () => {
    this.authModal = !this.authModal
  }

  // Set user from direct OAuth (Google/Apple without Cognito)
  setOAuthUser = (oauthUser: { id: string; email: string; name: string; picture?: string; provider: 'google' | 'apple' }) => {
    const normalized = this.normalizeUser({
      id: oauthUser.id,
      email: oauthUser.email,
      name: oauthUser.name,
      provider: oauthUser.provider,
    })

    console.log('Setting OAuth user:', normalized)

    // Create a simple token (you might want to get this from your backend)
    const simpleToken = `oauth_${oauthUser.provider}_${oauthUser.id}`

    runInAction(() => {
      this.setSession(normalized, simpleToken)
      this.authModal = false
    })
  }
}
