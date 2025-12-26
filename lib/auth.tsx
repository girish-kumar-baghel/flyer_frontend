"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

export interface User {
  id: string
  email: string
  name: string
  phone: string
  avatar?: string
  provider: "email" | "google" | "apple"
  createdAt: string
  favorites: string[]
  orders: string[]
}

// interface AuthContextType {
//   user: User | null
//   loading: boolean
//   // signIn: (email: string, password: string) => Promise<void>
//   signIn: (userData: any) => Promise<void>

//   signUp: (email: string, password: string, name: string) => Promise<void>
//   signInWithGoogle: () => Promise<void>
//   signInWithApple: () => Promise<void>
//   signOut: () => Promise<void>
//   sendOTP: (email: string) => Promise<void>
//   verifyOTP: (email: string, otp: string) => Promise<void>
//   updateProfile: (data: Partial<User>) => Promise<void>
// }

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (userData: any) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInWithApple: () => Promise<void>
  signOut: () => Promise<void>
  sendOTP: (email: string) => Promise<void>
  verifyOTP: (email: string, otp: string) => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
}


const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem("grodify_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  // const signIn = async (email: string, password: string) => {
  //   setLoading(true)
  //   try {
  //     // Mock authentication - replace with real API call
  //     await new Promise((resolve) => setTimeout(resolve, 1000))

  //     const mockUser: User = {
  //       id: "1",
  //       email,
  //       name: email.split("@")[0],
  //       phone: "",
  //       provider: "email",
  //       createdAt: new Date().toISOString(),
  //       favorites: [],
  //       orders: [],
  //     }

  //     setUser(mockUser)
  //     localStorage.setItem("grodify_user", JSON.stringify(mockUser))
  //   } catch (error) {
  //     throw new Error("Invalid credentials")
  //   } finally {
  //     setLoading(false)
  //   }
  // }
  const signIn = async (backendUser: any) => {
  setLoading(true)
  try {
    const userData: User = {
      id: backendUser.id?.toString() || "",
      email: backendUser.email || "",
      name: backendUser.fullname || backendUser.email?.split("@")[0] || "User",
      phone: "",                     // backend does not provide phone
      avatar: "",                    // backend does not provide avatar
      provider: "email",
      createdAt: new Date().toISOString(),
      favorites: [],
      orders: [],
    }

    setUser(userData)
    localStorage.setItem("grodify_user", JSON.stringify(userData))
  } catch (error) {
    throw new Error("Login failed")
  } finally {
    setLoading(false)
  }
}




  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true)
    try {
      // Mock registration - replace with real API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name,
        phone: "",
        provider: "email",
        createdAt: new Date().toISOString(),
        favorites: [],
        orders: [],
      }

      setUser(mockUser)
      localStorage.setItem("grodify_user", JSON.stringify(mockUser))
    } catch (error) {
      throw new Error("Registration failed")
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    setLoading(true)
    try {
      // Mock Google sign-in - replace with real implementation
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockUser: User = {
        id: "google_" + Date.now(),
        email: "user@gmail.com",
        name: "Google User",
        phone: '',
        provider: "google",
        createdAt: new Date().toISOString(),
        favorites: [],
        orders: [],
      }

      setUser(mockUser)
      localStorage.setItem("grodify_user", JSON.stringify(mockUser))
    } catch (error) {
      throw new Error("Google sign-in failed")
    } finally {
      setLoading(false)
    }
  }

  const signInWithApple = async () => {
    setLoading(true)
    try {
      // Mock Apple sign-in - replace with real implementation
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockUser: User = {
        id: "apple_" + Date.now(),
        email: "user@icloud.com",
        name: "Apple User",
        phone: '',
        provider: "apple",
        createdAt: new Date().toISOString(),
        favorites: [],
        orders: [],
      }

      setUser(mockUser)
      localStorage.setItem("grodify_user", JSON.stringify(mockUser))
    } catch (error) {
      throw new Error("Apple sign-in failed")
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setUser(null)
    localStorage.removeItem("grodify_user")
  }

  const sendOTP = async (email: string) => {
    // Mock OTP sending - replace with real API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("OTP sent to:", email)
  }

  const verifyOTP = async (email: string, otp: string) => {
    // Mock OTP verification - replace with real API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    if (otp !== "123456") {
      throw new Error("Invalid OTP")
    }
  }

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return

    const updatedUser = { ...user, ...data }
    setUser(updatedUser)
    localStorage.setItem("grodify_user", JSON.stringify(updatedUser))
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithApple,
    signOut,
    sendOTP,
    verifyOTP,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

