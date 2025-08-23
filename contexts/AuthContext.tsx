"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useRef } from "react"
import { initializeFirebase, getFirebaseServices } from "@/lib/firebase"
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth"

interface User {
  id: string
  email: string
  name: string
  isAdmin?: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Hardcoded admin credentials
const ADMIN_CREDENTIALS = {
  email: "pokemonstorepk@gmail.com",
  password: "pokemonstorepk786",
  name: "Pokemon Store Admin",
  id: "admin-1",
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const initializedRef = useRef(false)

  // Initialize Firebase auth state listener
  useEffect(() => {
    let unsub: (() => void) | undefined
    
    const initializeAuth = async () => {
      // Prevent duplicate initialization on re-renders/HMR
      if (initializedRef.current) return
      initializedRef.current = true
      await initializeFirebase()
      const services = getFirebaseServices()
      if (!services?.auth) return
      
      // Only restore admin session if we're on an admin route
      const isAdminRoute = window.location.pathname.startsWith('/admin')
      
      if (isAdminRoute) { 
        const storedUser = localStorage.getItem("pokemon-admin-user")
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser)
            // Only set user from localStorage if they have a valid session
            const token = await services.auth.currentUser?.getIdToken()
            if (token) {
              setUser(parsedUser)
              console.log("✅ Restored admin user from valid session")
              return
            }
          } catch (error) {
            console.error("Error parsing stored user:", error)
          }
          // Clear invalid session
          localStorage.removeItem("pokemon-admin-user")
          setUser(null)
        }
      }
      
      // Set up auth state change listener
      unsub = onAuthStateChanged(services.auth, async (fbUser: FirebaseUser | null) => {
        if (fbUser) {
          const isAdmin = (fbUser.email || "").toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase()
          const current: User = {
            id: fbUser.uid,
            email: fbUser.email || "",
            name: fbUser.displayName || (isAdmin ? ADMIN_CREDENTIALS.name : "Customer"),
            isAdmin,
          }
          
          // Only update state if we're on the admin route and it's an admin user
          const isAdminRoute = window.location.pathname.startsWith('/admin')
          if (isAdminRoute && isAdmin) {
            setUser(current)
            localStorage.setItem("pokemon-admin-user", JSON.stringify(current))
            console.log("✅ Admin user authenticated")
          } else if (!isAdminRoute) {
            // For customer routes, don't maintain admin session
            setUser(current)
          }
        } else {
          // Only clear on explicit logout
          if (user) {
            setUser(null)
            localStorage.removeItem("pokemon-admin-user")
            console.log("ℹ️ User logged out")
          }
        }
      })
    }
    
    initializeAuth()
    return () => {
      if (unsub) unsub()
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true)

    try {
      await initializeFirebase()
      const services = getFirebaseServices()
      if (!services?.auth) throw new Error("Auth not initialized")
      const cred = await signInWithEmailAndPassword(services.auth, email, password)
      const fbUser = cred.user
      const userData: User = {
        id: fbUser.uid,
        email: fbUser.email || email,
        name: fbUser.displayName || ADMIN_CREDENTIALS.name,
        isAdmin: (fbUser.email || email).toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase(),
      }
      setUser(userData)
      localStorage.setItem("pokemon-admin-user", JSON.stringify(userData))
      console.log("✅ Admin login successful (Firebase)")
      return true
    } catch (error) {
      console.error("❌ Login error:", error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await initializeFirebase()
      const services = getFirebaseServices()
      if (services?.auth) {
        await signOut(services.auth)
      }
      setUser(null)
      localStorage.removeItem("pokemon-admin-user")
      console.log("✅ Admin logout successful")
    } catch (error) {
      console.error("❌ Logout error:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
